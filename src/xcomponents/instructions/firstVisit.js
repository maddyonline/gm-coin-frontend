const anchor = require("@project-serum/anchor");

export default async function (program) {
    const visitor = program.provider.wallet;
    console.log({ visitor: visitor.publicKey.toString() })
    
    const [visitorState, visitorBump] = await anchor.web3.PublicKey.findProgramAddress(
        [visitor.publicKey.toBuffer()],
        program.programId
    )
    const tx = await program.rpc.firstVisit(visitorBump, {
        accounts: {
            payer: visitor.publicKey,
            // visitor accounts
            visitor: visitor.publicKey,
            visitorState,
            systemProgram: anchor.web3.SystemProgram.programId,
            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        },
        signers: []
    });
    console.log("First visit tx.", tx);

}