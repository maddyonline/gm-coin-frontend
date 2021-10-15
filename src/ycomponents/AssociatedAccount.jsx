import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';
const {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    Token,
} = require("@solana/spl-token");


export default function useAssociatedAccount(mint) {
    const wallet = useWallet()
    const [account, setAccount] = React.useState(null);
    React.useEffect(() => {
        const updateAccount = async () => {
            try {
                const associatedToken = await Token.getAssociatedTokenAddress(
                    ASSOCIATED_TOKEN_PROGRAM_ID,
                    TOKEN_PROGRAM_ID,
                    mint,
                    wallet.publicKey
                );

                const client = new Token(
                    program.provider.connection,
                    mint,
                    TOKEN_PROGRAM_ID,
                    program.provider.wallet.publicKey
                );

                setAccount(await client.getAccountInfo(associatedToken));

            } catch (error) {
                console.log(error);
                return;
            }
        }
        if (mint && wallet) {
            updateAccount();
        }
    }, [mint, wallet])

    return account;
}