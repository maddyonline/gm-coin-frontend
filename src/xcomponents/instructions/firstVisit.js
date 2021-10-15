const {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    Token,
} = require("@solana/spl-token");
const anchor = require("@project-serum/anchor");

export default async function (program, mint) {
    let visitorTokenAccount;
    try {
        const associatedToken = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mint,
            program.provider.wallet.publicKey
        );

        const client = new Token(
            program.provider.connection,
            mint,
            TOKEN_PROGRAM_ID,
            program.provider.wallet.publicKey
        );

        const account = await client.getAccountInfo(associatedToken);
        console.log({ account })
        visitorTokenAccount = account.address;
    } catch (error) {
        console.log(error);
        return;
    }

    let [vaultProgram, vaultProgramNonce] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(anchor.utils.bytes.utf8.encode("vault"))],
        program.programId
    )

    const [visitorState, _] = await anchor.web3.PublicKey.findProgramAddress(
        [program.provider.wallet.publicKey.toBuffer()],
        program.programId
    )
    const [_pda, __] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(anchor.utils.bytes.utf8.encode("gm_coin"))],
        program.programId
    );

    const tx = await program.rpc.firstVisit(vaultProgramNonce, visitorBump, {
        accounts: {
            payer: program.provider.wallet.publicKey,
            // visitor accounts
            visitor: program.provider.wallet.publicKey,
            visitorState,
            to: visitorTokenAccount,
            owner: program.provider.wallet.publicKey,
            // vault accounts
            vault: vaultTokenAccount,
            vaultProgram,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        },
    });
    console.log("First tx.", tx);

}