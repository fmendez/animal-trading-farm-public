import { AnimalTradingFarm } from "../target/types/animal_trading_farm";
import { Program } from "@project-serum/anchor";
import * as assert from 'assert';
import * as anchor from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import { NodeWallet } from "@project-serum/anchor/dist/cjs/provider";
import { PublicKey } from "@solana/web3.js";


describe('animal-trading-farm', () => {

  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.AnimalTradingFarm as Program<AnimalTradingFarm>;

  let offerMakerPigTokenAccount: anchor.web3.PublicKey;
  let offerTakerCowTokenAccount: anchor.web3.PublicKey;
  let offerTakerPigTokenAccount: anchor.web3.PublicKey;
  let offerMakerCowTokenAccount: anchor.web3.PublicKey;

  let cowMint: spl.Token;
  let pigMint: spl.Token;

  let offerTaker = anchor.web3.Keypair.generate();

  before(async () => {
    const wallet = program.provider.wallet as NodeWallet;

    cowMint = await spl.Token.createMint(program.provider.connection,
      wallet.payer,
      wallet.publicKey,
      wallet.publicKey,
      0,
      spl.TOKEN_PROGRAM_ID);

    pigMint = await spl.Token.createMint(program.provider.connection,
      wallet.payer,
      wallet.publicKey,
      wallet.publicKey,
      0,
      spl.TOKEN_PROGRAM_ID);


    offerMakerCowTokenAccount = await cowMint.createAssociatedTokenAccount(
      program.provider.wallet.publicKey
    )

    offerMakerPigTokenAccount = await pigMint.createAssociatedTokenAccount(
      program.provider.wallet.publicKey
    )

    offerTakerCowTokenAccount = await cowMint.createAssociatedTokenAccount(
      offerTaker.publicKey
    )

    offerTakerPigTokenAccount = await pigMint.createAssociatedTokenAccount(
      offerTaker.publicKey
    )

    await cowMint.mintTo(offerMakerCowTokenAccount, program.provider.wallet.publicKey, [], 100);
    await pigMint.mintTo(offerTakerPigTokenAccount, program.provider.wallet.publicKey, [], 100);

  });

  it('It let you place and accept offers for tokens', async () => {

    const offer = anchor.web3.Keypair.generate();
    const [escrowedTokensOfOfferMaker, escrowedTokensOfOfferMakerBump] = await anchor.web3.PublicKey.findProgramAddress(
      [offer.publicKey.toBuffer()],
      program.programId
    )

    await program.rpc.makeOffer(
      escrowedTokensOfOfferMakerBump,
      new anchor.BN(2),
      new anchor.BN(4),
      {
        accounts: {
          offer: offer.publicKey,
          whoMadeTheOffer: program.provider.wallet.publicKey,
          tokenAccountFromWhoMadeTheOffer: offerMakerCowTokenAccount,
          escrowedTokensOfOfferMaker: escrowedTokensOfOfferMaker,
          kindOfTokenOffered: cowMint.publicKey,
          kindOfTokenWantedInReturn: pigMint.publicKey,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY
        },
        signers: [offer]
      }
    );

    assert.equal(2, (await cowMint.getAccountInfo(escrowedTokensOfOfferMaker)).amount.toNumber());
    const offerMakerCurrentCowAmounts = (await cowMint.getAccountInfo(offerMakerCowTokenAccount)).amount.toNumber();
    const offerMakerCurrentPigAmounts = (await pigMint.getAccountInfo(offerMakerPigTokenAccount)).amount.toNumber();

    const offerReceiverCurrentPigAmounts = (await pigMint.getAccountInfo(offerTakerPigTokenAccount)).amount.toNumber();

    await program.rpc.acceptOffer(
      {
        accounts: {
          offer: offer.publicKey,
          whoMadeTheOffer: program.provider.wallet.publicKey,
          whoIsTakingTheOffer: offerTaker.publicKey,
          escrowedTokensOfOfferMaker: escrowedTokensOfOfferMaker,
          accountHoldingWhatMakerWillGet: offerMakerPigTokenAccount, // account where the wanted pigs will be sent
          accountHoldingWhatReceiverWillGive: offerTakerPigTokenAccount,
          accountHoldingWhatReceiverWillGet: offerTakerCowTokenAccount, // where I'm getting my cows to
          kindOfTokenWantedInReturn: pigMint.publicKey, // 
          tokenProgram: spl.TOKEN_PROGRAM_ID,
        },
        signers: [offerTaker]
      }
    );

    assert.equal(offerMakerCurrentPigAmounts + 4, (await pigMint.getAccountInfo(offerMakerPigTokenAccount)).amount.toNumber());
    assert.equal(offerReceiverCurrentPigAmounts - 4, (await pigMint.getAccountInfo(offerTakerPigTokenAccount)).amount.toNumber());

    // accounts closed after transactions completed (e.g, accepted).
    assert.equal(null, await program.provider.connection.getAccountInfo(offer.publicKey));
    assert.equal(null, await program.provider.connection.getAccountInfo(escrowedTokensOfOfferMaker));

  });

  it('it lets you cancel offers after placing them', async () => {

    const offer = anchor.web3.Keypair.generate();
    const [escrowedTokensOfOfferMaker, escrowedTokensOfOfferMakerBump] = await anchor.web3.PublicKey.findProgramAddress(
      [offer.publicKey.toBuffer()],
      program.programId
    )

    await program.rpc.makeOffer(
      escrowedTokensOfOfferMakerBump,
      new anchor.BN(2),
      new anchor.BN(4),
      {
        accounts: {
          offer: offer.publicKey,
          whoMadeTheOffer: program.provider.wallet.publicKey,
          tokenAccountFromWhoMadeTheOffer: offerMakerCowTokenAccount,
          escrowedTokensOfOfferMaker: escrowedTokensOfOfferMaker,
          kindOfTokenOffered: cowMint.publicKey,
          kindOfTokenWantedInReturn: pigMint.publicKey,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY
        },
        signers: [offer]
      }
    );

    await program.rpc.cancelOffer(
      {
        accounts: {
          offer: offer.publicKey,
          whoMadeTheOffer: program.provider.wallet.publicKey,
          whereTheEscrowedAccountWasFundedFrom: offerMakerCowTokenAccount,
          escrowedTokensOfOfferMaker: escrowedTokensOfOfferMaker,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
        },
      }
    );

    // accounts closed after transactions completed (e.g, accepted).
    assert.equal(null, await program.provider.connection.getAccountInfo(offer.publicKey));
    assert.equal(null, await program.provider.connection.getAccountInfo(escrowedTokensOfOfferMaker));

  });

  const getBalance = async (mint) => {
    try {
      const parsedAccount = await program.provider.connection.getParsedTokenAccountsByOwner(program.provider.wallet.publicKey, { mint, });
      return parsedAccount.value[0].account.data.parsed.info.tokenAmount.uiAmount;
    } catch (error) {
      console.log("No mints found for wallet");
    }
  }

  const airdrop = async (seed, bump, mintPda, amount, associatedAccount) => {

    await program.rpc.airdrop(
      seed,
      bump,
      amount,
      {
        accounts: {
          payer: program.provider.wallet.publicKey,
          mint: mintPda,
          destination: associatedAccount,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: spl.ASSOCIATED_TOKEN_PROGRAM_ID,
        },
        signers: [],
      }
    );

  }

  it('it lets you airdrop some cow and pigs', async () => {

    const cowSeed = Buffer.from(anchor.utils.bytes.utf8.encode("cow-mint-faucet"));
    const pigSeed = Buffer.from(anchor.utils.bytes.utf8.encode("pig-mint-faucet"));

    const [cowMintPda, cowMintPdaBump] = await anchor.web3.PublicKey.findProgramAddress(
      [cowSeed],
      program.programId);

    const [pigMintPda, pigMintPdaBump] = await anchor.web3.PublicKey.findProgramAddress(
      [pigSeed],
      program.programId);


    let associatedCowTokenAccount = await spl.Token.getAssociatedTokenAddress(
      spl.ASSOCIATED_TOKEN_PROGRAM_ID,
      spl.TOKEN_PROGRAM_ID,
      cowMintPda,
      program.provider.wallet.publicKey,
    );

    let associatedPigTokenAccount = await spl.Token.getAssociatedTokenAddress(
      spl.ASSOCIATED_TOKEN_PROGRAM_ID,
      spl.TOKEN_PROGRAM_ID,
      pigMintPda,
      program.provider.wallet.publicKey,
    );

    let amount = new anchor.BN(25 * 1000000000);
    const cowBalanceBeforeDrop = await getBalance(cowMintPda);
    const pigBalanceBeforeDrop = await getBalance(pigMintPda);

    await airdrop(cowSeed, cowMintPdaBump, cowMintPda, amount, associatedCowTokenAccount);
    await airdrop(pigSeed, pigMintPdaBump, pigMintPda, amount, associatedPigTokenAccount);

    const cowBalanceAfterDrop = await getBalance(cowMintPda);
    const pigBalanceAfterDrop = await getBalance(pigMintPda);
    assert.equal(cowBalanceAfterDrop - cowBalanceBeforeDrop, 25);
    assert.equal(pigBalanceAfterDrop - pigBalanceBeforeDrop, 25);

  });
});