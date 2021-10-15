import React, {
    useContext,
    createContext,
    useCallback,
} from "react";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
// import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { PublicKey } from "@solana/web3.js";
import { useItemsByOwner } from "util/db";
import useProgram from "./program";

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


export const useContractProvider = () => {
    const [mint, setMint] = React.useState(null);
    const [account, setAccount] = React.useState(null);

    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const program = useProgram();

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
        } catch (error) {
            console.log(error);
        }
    }, [publicKey, connection, mint, account, setAccount]);

    return {
        mint,
        account,
        refresh,
    }
}