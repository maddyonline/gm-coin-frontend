import { useConnection } from '@solana/wallet-adapter-react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import React from 'react';
const anchor = require("@project-serum/anchor");

const IDL = require("./idl.json");


export default function useProgram() {
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
    const [program, setProgram] = React.useState(null);
    const loadProgram = React.useCallback(() => {
        if (wallet && connection) {
            const provider = new anchor.Provider(
                connection,
                wallet,
                anchor.Provider.defaultOptions(),
            );
            console.log({ address: IDL.metadata.address })
            const programId = new anchor.web3.PublicKey(IDL.metadata.address);
            const program = new anchor.Program(IDL, programId, provider);
            setProgram(program);
        }

    }, [wallet, connection]);
    return { program, loadProgram };
}