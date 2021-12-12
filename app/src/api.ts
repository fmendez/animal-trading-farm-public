import { NodeWallet } from '@project-serum/anchor/dist/cjs/provider';
import { PublicKey, Connection, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { MintWithAssociatedAccountType, OfferType, TradeableTokenType } from './types';
import { Idl, Program, BN, web3, utils } from '@project-serum/anchor';
import { getProvider, PROGRAM_ID, TOKEN_INFO } from './util';
import idl from "./idl.json";
import * as spl from '@solana/spl-token';
import { v4 as uuidv4 } from 'uuid';
import API, { graphqlOperation } from '@aws-amplify/api';
import { listOpenOffers } from './graphql/queries';
import { createOpenOffer, updateOpenOffer } from './graphql/mutations';
const { Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } = web3;

export const retrieveTokens = async (wallet: NodeWallet, connection: Connection) => {


    let tradeableTokens: TradeableTokenType[] = [];
    let mintsWithAssociatedAccounts: MintWithAssociatedAccountType[] = [];
    try {
        await Promise.all(TOKEN_INFO.map(async (tokenAvailable) => {
            let tokenMint = new PublicKey(tokenAvailable.mint);
            const tokenAccounts = (await connection.getParsedTokenAccountsByOwner(wallet.publicKey as PublicKey, { mint: tokenMint })).value;
            tokenAccounts.forEach(({ pubkey, account }) => {
                const data = account.data.parsed.info;
                const token: TradeableTokenType = {
                    image: tokenAvailable.image,
                    mint: tokenAvailable.mint,
                    name: tokenAvailable.name,
                    symbol: tokenAvailable.name,
                    accountHoldingToken: pubkey.toString(),
                    owner: data.owner,
                    amount: data.tokenAmount.uiAmount,
                    decimals: data.tokenAmount.decimals,
                }
                tradeableTokens.push(token);
                mintsWithAssociatedAccounts.push({ mint: tokenAvailable.mint, associatedAccount: pubkey.toString() })
            });
        }));


    } catch (error) {
        console.log("This account doesn't have any cows or pigs mint. Try airdroping some");
    }
    return {
        tradeableTokens,
        mintsWithAssociatedAccounts
    }
}

export const allOpenOffers = async () => {
    try {
        const offerData: any = await API.graphql(graphqlOperation(listOpenOffers, {
            filter: {
                status: {
                    eq: "open"
                }
            }
        }))
        const offerList = offerData.data.listOpenOffers.items;
        return offerList;
    } catch (err) {
        console.log("error fetching open offers");
    }
}

export const makeOffer = async (
    kindOfTokenOffered: PublicKey,
    kindOfTokenWanted: PublicKey,
    whereToSendWhatsWanted: PublicKey,
    accountHoldingOffering: PublicKey,
    amountOffered: BN,
    amountWanted: BN,
    wallet: NodeWallet) => {

    const provider = await getProvider((wallet as any) as NodeWallet);
    const program = new Program((idl as any) as Idl, PROGRAM_ID, provider);
    const tokenProgramID = spl.TOKEN_PROGRAM_ID;

    const offer = Keypair.generate();
    const [escrowedTokensOfOfferMaker, escrowedTokensOfOfferMakerBump] = await PublicKey.findProgramAddress(
        [offer.publicKey.toBuffer()],
        program.programId
    )

    try {
        const tx = await program.rpc.makeOffer(
            escrowedTokensOfOfferMakerBump,
            amountOffered,
            amountWanted,
            {
                accounts: {
                    offer: offer.publicKey,
                    whoMadeTheOffer: program.provider.wallet.publicKey,
                    tokenAccountFromWhoMadeTheOffer: accountHoldingOffering,
                    escrowedTokensOfOfferMaker: escrowedTokensOfOfferMaker,
                    kindOfTokenOffered: kindOfTokenOffered,
                    kindOfTokenWantedInReturn: kindOfTokenWanted,
                    tokenProgram: tokenProgramID,
                    systemProgram: SystemProgram.programId,
                    rent: SYSVAR_RENT_PUBKEY
                },
                signers: [offer]
            }
        )

        const newOffer = await saveOffer({
            id: null,
            tx: tx,
            offer: offer.publicKey.toString(),
            whoMadeTheOffer: program.provider.wallet.publicKey.toString(),
            escrowedTokensOfOfferMaker: escrowedTokensOfOfferMaker.toString(),
            accountHoldingWhatReceiverWillGet: accountHoldingOffering.toString(),
            kindOfTokenOffered: kindOfTokenOffered.toString(),
            kindOfTokenWantedInReturn: kindOfTokenWanted.toString(),
            whereToSendWhatsWanted: whereToSendWhatsWanted.toString(),
            amountOffered: amountOffered.toNumber() / 1000000000,
            amountWanted: amountWanted.toNumber() / 1000000000,
            status: 'open',
        });

        return newOffer;
    } catch (err) {
        console.log("Transaction error: ", err);
    }

}

export const cancelOffer = async (openOffer: OfferType, wallet: NodeWallet) => {

    const provider = await getProvider((wallet as any) as NodeWallet);
    const program = new Program((idl as any) as Idl, PROGRAM_ID, provider);

    try {
        const tx = await program.rpc.cancelOffer(
            {
                accounts: {
                    offer: new PublicKey(openOffer.offer),
                    whoMadeTheOffer: new PublicKey(openOffer.whoMadeTheOffer),
                    whereTheEscrowedAccountWasFundedFrom: new PublicKey(openOffer.accountHoldingWhatReceiverWillGet),
                    escrowedTokensOfOfferMaker: new PublicKey(openOffer.escrowedTokensOfOfferMaker),
                    tokenProgram: spl.TOKEN_PROGRAM_ID,
                }
            }
        );

        let updatedOffer = await updateOffer({ ...openOffer, status: 'cancelled' });
        return updatedOffer;

    } catch (err) {
        console.log("Transaction error: ", err);
    }

}

export const acceptOffer = async (openOffer: OfferType, tokensImReceiving: PublicKey, tokensImGiving: PublicKey, sendTransaction: any, wallet: NodeWallet) => {

    const provider = await getProvider((wallet as any) as NodeWallet);
    const program = new Program((idl as any) as Idl, PROGRAM_ID, provider);

    try {
        const tx = new Transaction();
        tx.add(
            program.transaction.acceptOffer(
                {
                    accounts: {
                        offer: new PublicKey(openOffer.offer),
                        whoMadeTheOffer: new PublicKey(openOffer.whoMadeTheOffer),
                        whoIsTakingTheOffer: wallet.publicKey,
                        escrowedTokensOfOfferMaker: new PublicKey(openOffer.escrowedTokensOfOfferMaker),
                        accountHoldingWhatMakerWillGet: new PublicKey(openOffer.whereToSendWhatsWanted), // account where the wanted pigs will be sent 
                        accountHoldingWhatReceiverWillGive: tokensImGiving,
                        accountHoldingWhatReceiverWillGet: tokensImReceiving,
                        kindOfTokenWantedInReturn: new PublicKey(openOffer.kindOfTokenWantedInReturn),
                        tokenProgram: spl.TOKEN_PROGRAM_ID,
                    }
                }
            )
        );
        const signature = await sendTransaction(tx, program.provider.connection);
        await program.provider.connection.confirmTransaction(signature, 'processed');

        let updatedOffer = await updateOffer({ ...openOffer, status: 'accepted' });
        return updatedOffer;

    } catch (err) {
        console.log("Transaction error: ", err);
    }

}

const saveOffer = async (offer: OfferType) => {
    try {
        delete offer.createdAt;
        delete offer.updatedAt;
        offer.id = uuidv4();
        let res: any = await API.graphql(graphqlOperation(createOpenOffer, { input: offer }))
        return res.data.createOpenOffer;
    } catch (error) {
        console.log("error updating offer on the DB");
    }
}

const updateOffer = async (offer: OfferType) => {
    try {
        delete offer.createdAt;
        delete offer.updatedAt;
        let res: any = await API.graphql(graphqlOperation(updateOpenOffer, { input: offer }))
        return res.data.updateOpenOffer;
    } catch (error) {
        console.log("error updating offer on the DB");
    }
}

export const airdropCows = async (wallet: NodeWallet) => {
    const cowSeed = Buffer.from(utils.bytes.utf8.encode("cow-mint-faucet"));
    const cowMintPDA = new PublicKey("2Qd9uanvZ9y5Kzy6Us5i36RZpmyp6KbrSsQ9VFRw7d7Z");
    const cowMintBump = 255;
    try {
        await airdropToken(cowSeed, cowMintBump, cowMintPDA, wallet);
    } catch (error) {
        console.log("Transaction error: ", error);
    }
}

export const airdropPigs = async (wallet: NodeWallet) => {
    const pigSeed = Buffer.from(utils.bytes.utf8.encode("pig-mint-faucet"));
    const pigMintPDA = new PublicKey("7ddqSovv9HDm82xZ7o51mX3emYQFTAvVSv5uvyCQXTpV");
    const pigMintBump = 255;
    try {
        await airdropToken(pigSeed, pigMintBump, pigMintPDA, wallet);
    } catch (error) {
        console.log("Transaction error: ", error);
    }
}

const airdropToken = async (seed: Buffer, bump: number, mintPda: PublicKey, wallet: NodeWallet) => {
    const provider = await getProvider((wallet as any) as NodeWallet);
    const program = new Program((idl as any) as Idl, PROGRAM_ID, provider);
    let amount = new BN(25 * 1000000000);

    let associatedAccount = await spl.Token.getAssociatedTokenAddress(
        spl.ASSOCIATED_TOKEN_PROGRAM_ID,
        spl.TOKEN_PROGRAM_ID,
        mintPda,
        program.provider.wallet.publicKey,
    );

    await program.rpc.airdrop(
        seed,
        bump,
        amount,
        {
            accounts: {
                payer: program.provider.wallet.publicKey,
                mint: mintPda,
                destination: associatedAccount,
                rent: SYSVAR_RENT_PUBKEY,
                tokenProgram: spl.TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                associatedTokenProgram: spl.ASSOCIATED_TOKEN_PROGRAM_ID,
            },
            signers: [],
        }
    );
}

export const airdropSol = async (wallet: NodeWallet) => {
    const provider = await getProvider((wallet as any) as NodeWallet);
    const program = new Program((idl as any) as Idl, PROGRAM_ID, provider);
    let tx;
    try {
        let signature = await program.provider.connection.requestAirdrop(provider.wallet.publicKey, LAMPORTS_PER_SOL);
        tx = await program.provider.connection.confirmTransaction(signature, 'processed');
    } catch (error) {
        console.log("Transaction error: ", error);
    }
    return tx;
}

export const getTokenAssociatedAccount = async (wallet: NodeWallet, mint: PublicKey) => {

    const provider = await getProvider((wallet as any) as NodeWallet);
    const program = new Program((idl as any) as Idl, PROGRAM_ID, provider);

    let res = await spl.Token.getAssociatedTokenAddress(
        spl.ASSOCIATED_TOKEN_PROGRAM_ID,
        spl.TOKEN_PROGRAM_ID,
        mint,
        program.provider.wallet.publicKey,
    );

    return res;
}
