import { faRetweet } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { OfferType } from "../types";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { acceptOffer, cancelOffer, getTokenAssociatedAccount } from "../api";
import { NodeWallet } from "@project-serum/anchor/dist/cjs/provider";
import { PublicKey } from '@solana/web3.js';
import { useAppDispatch } from "../hooks";
import { removeOffer } from "../features/trades/tradesSlice";
import { refreshTokens, tokenByMint } from "../util";
import { toast } from "react-toastify";

type Props = {
    offer: OfferType,
}

function Offer({ offer }: Props) {
    const { sendTransaction } = useWallet();
    const wallet = useWallet();
    const { connection } = useConnection();
    const dispatch = useAppDispatch();

    const handleAccept = async (offer: OfferType) => {
        const tokensImReceiving = await getTokenAssociatedAccount((wallet as any) as NodeWallet, new PublicKey(offer.kindOfTokenOffered));
        const tokensImGiving = await getTokenAssociatedAccount((wallet as any) as NodeWallet, new PublicKey(offer.kindOfTokenWantedInReturn));

        let acceptedOffer = await acceptOffer(offer, new PublicKey(tokensImReceiving), new PublicKey(tokensImGiving), sendTransaction, (wallet as any) as NodeWallet)
        if (acceptedOffer) {
            dispatch(removeOffer(acceptedOffer.id));
            refreshTokens((wallet as any) as NodeWallet, connection, dispatch);
            toast.success("Offer accepted!");
        }
    }

    const handleCancel = async (offer: OfferType) => {
        let cancelledOffer = await cancelOffer(offer, (wallet as any) as NodeWallet)
        if (cancelledOffer) {
            dispatch(removeOffer(cancelledOffer.id));
            refreshTokens((wallet as any) as NodeWallet, connection, dispatch);
            toast.success("Offer cancelled!");
        }
    }


    return (
        <div className="bg-offer-card rounded-lg m-2 flex flex-col items-center pb-1">
            <div className="flex flex-col w-auto items-center text-sm mb-4 mt-2 p-1 bg-red-btn rounded-lg ">
                <h4 className="font-bold">Offer Maker:</h4>
                <span className="lg:pl-3">
                    {offer.whoMadeTheOffer}
                </span>
            </div>
            <div className="flex flex-col items-center mt-2">
                <div className="bg-token-card p-1 rounded-xl">
                    <img className="w-24 mb-2 mt-1" src={tokenByMint(offer.kindOfTokenOffered).image} alt="" />
                    <div className="flex flex-col place-items-end">
                        <div >
                            <span className="bg-token-amount rounded-3xl p-1 font-semibold">{offer.amountOffered}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <FontAwesomeIcon icon={faRetweet} size="5x" />
                </div>
                <div className="bg-token-card p-1 rounded-xl">
                    <div >
                        <span className="bg-token-amount rounded-3xl p-1 font-semibold">{offer.amountWanted}</span>
                    </div>
                    <img className="w-24 mb-2 mt-1" src={tokenByMint(offer.kindOfTokenWantedInReturn).image} alt="" />
                </div>

                <div className="mt-2 mb-2">
                    {
                        offer.whoMadeTheOffer !== wallet.publicKey?.toString() &&
                        <button onClick={() => handleAccept(offer)} className="bg-green-btn rounded-xl mr-3 p-1 px-2">Accept</button>
                    }

                    {
                        offer.whoMadeTheOffer === wallet.publicKey?.toString() &&
                        <button onClick={() => handleCancel(offer)} className="bg-red-btn rounded-xl p-1 px-2">Cancel</button>
                    }
                </div>

            </div>
        </div>
    )
}

export default Offer;
