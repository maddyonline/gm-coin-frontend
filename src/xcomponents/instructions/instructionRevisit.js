const {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    Token,
} = require("@solana/spl-token");
const anchor = require("@project-serum/anchor");


async function lookupPdas(pdas, connection, programId) {
    for (const seedStr of pdas) {
        let buffer;
        if (typeof seedStr === "string") {
            buffer = Buffer.from(anchor.utils.bytes.utf8.encode(seedStr));
        } else if (seedStr instanceof anchor.web3.PublicKey) {
            buffer = seedStr.toBuffer();
        } else {
            throw new Error("Unrecognized type");
        }
        const [pdaPublicKey, pdaNonce] = await anchor.web3.PublicKey.findProgramAddress(
            [buffer],
            programId
        )

        console.log(seedStr, pdaPublicKey.toString(), pdaNonce)
        try {
            const pdaAccount = await connection.getAccountInfo(pdaPublicKey)
            console.log({ pdaAccount })
            if (pdaAccount && pdaAccount.owner) {
                console.log(`owner: ${pdaAccount.owner}`)
            }
        } catch (error) {
            console.log(error)
        }
        console.log("---")
    }

}

export default async function (program, mint) {
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
    const visitorTokenAccount = account.address;

    if (!visitorTokenAccount) {
        throw new Error("Visitor token account not ready");
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

    const pdas = [
        "vault",
        "gm_coin",
        visitorState,
    ]
    await lookupPdas(pdas, program.provider.connection, program.programId);

    const tx = await program.rpc.visitAgain(vaultProgramNonce, {
        accounts: {
            globalState: _pda,
            visitor: program.provider.wallet.publicKey,
            visitorState,
            vault: new anchor.web3.PublicKey("DPgCpwZoRPj6SCumjBxoLZT68Jh9w7oWfzL8gsU9ePZH"),
            vaultProgram,
            to: visitorTokenAccount,
            owner: program.provider.wallet.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        },
    });

    console.log("Revisit tx", tx);
    // let visitorStateAccount = await program.account.visitorState.fetch(visitorState);
    // console.log({
    //     visitorCount: visitorStateAccount.visitCount.toNumber(),
    //     lastVisit: visitorStateAccount.lastVisit.toNumber(),
    // });
}