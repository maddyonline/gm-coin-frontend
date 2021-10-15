import React, { useCallback } from 'react';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
// import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';

const {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    Token,
} = require("@solana/spl-token");

export const MyAccountDetails = ({ mint, account, setAccount }) => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();


    const onClick = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();
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

        setAccount(await client.getAccountInfo(associatedToken));
    }, [mint, account, setAccount, publicKey, connection]);

    if (!mint || !mint.toString()) {
        return null;
    }

    return (
        <div>
            <div>Mint: {mint.toString()}</div>
            <div>{JSON.stringify(account)}</div>
            <button onClick={onClick} disabled={!publicKey}>
                Fetch Details
            </button>
        </div>

    );
};




