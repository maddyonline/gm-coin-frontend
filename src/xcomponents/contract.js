import React, {
    useContext,
    createContext,
    useCallback,
} from "react";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

// import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { PublicKey } from "@solana/web3.js";
import { useItemsByOwner } from "util/db";

import createTokenAccount from "./instructions/createTokenAccount";
import firstVisit from "./instructions/firstVisit";
import instructionRevisit from "./instructions/instructionRevisit";

import useProgram from "./program";
const anchor = require("@project-serum/anchor")

const OWNER = "gVJfW7KKRyRI5auW7OVrrs5Nawi1";

const {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    Token,
} = require("@solana/spl-token");

const contractContext = createContext();
export const useContract = () => useContext(contractContext);
// This should wrap the app in `src/pages/_app.js`
export function ContractProvider({ children }) {
    const contract = useContractProvider();
    return <contractContext.Provider value={contract}>{children}</contractContext.Provider>;
}


async function getVisitorState(publicKey, program) {
    if (!publicKey || program === null) {
        console.log("returning early");
        return ["unknown", null];
    }

    const [visitorStatePublicKey, _] = await anchor.web3.PublicKey.findProgramAddress(
        [publicKey.toBuffer()],
        program.programId
    )
    try {
        const visitorStateAccount = await program.account.visitorState.fetch(visitorStatePublicKey);
        console.log({ visitorStateAccount })
        return ["found", visitorStateAccount];
    } catch (error) {
        console.log(error);
        if (error.message.startsWith("Account does not exist")) {
            return ["Not Found", null]
        }
    }
    return ["unknown", null];
}


export const useContractProvider = () => {
    const [mint, setMint] = React.useState(null);
    const [account, setAccount] = React.useState(null);
    const [accountStatus, setAccountStatus] = React.useState("unknown");

    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const { program, loadProgram } = useProgram();
    const [visitor, setVisitor] = React.useState(["unknown", null]);

    const { status: itemsStatus, data: itemsData } = useItemsByOwner(OWNER)



    React.useEffect(() => {
        if (itemsStatus === 'success' && itemsData && itemsData.length > 0) {
            const firstItem = itemsData[0];
            const { mint: mintStr } = firstItem;
            const mint = new PublicKey(mintStr);
            setMint(mint);
        }

    }, [itemsStatus, itemsData])

    React.useEffect(() => {
        if (program) {
            console.log({ program });
        }
    }, [program])


    const refresh = useCallback(async () => {
        if (!publicKey || !mint || !connection) return;
        loadProgram();
        setVisitor(await getVisitorState(publicKey, program));
        console.log({
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mint,
            publicKey
        })
        const associatedToken = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mint,
            publicKey
        );

        const client = new Token(
            connection,
            mint,
            TOKEN_PROGRAM_ID,
            publicKey
        );
        try {
            setAccount(await client.getAccountInfo(associatedToken));
            setAccountStatus("Found");
        } catch (error) {
            console.log(error);
            setAccountStatus("Not Found");

        }
    }, [publicKey, connection, mint, account, setAccount]);

    const create = React.useCallback(async () => {
        if (!program) {
            loadProgram();
            return;
        }
        await createTokenAccount(program, mint);
        await refresh()

    }, [program, mint])


    const visit = React.useCallback(async () => {
        if (!program) {
            loadProgram();
            return;
        }
        await firstVisit(program, mint);
        await refresh()

    }, [program, mint])

    const revisit = React.useCallback(async () => {
        if (!program) {
            loadProgram();
            return;
        }
        await instructionRevisit(program, mint);
        await refresh()

    }, [program, mint])

    return {
        mint,
        account,
        accountStatus,
        refresh,
        create,
        visit,
        revisit,
        visitor,
    }
}