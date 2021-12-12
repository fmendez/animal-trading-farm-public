import { useState } from 'react'
import { TradeableTokenType } from '../types'
import { PublicKey, } from '@solana/web3.js';
import { refreshTokens, TOKEN_INFO } from '../util';
import { BN } from '@project-serum/anchor';
import { makeOffer, retrieveTokens } from '../api';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { NodeWallet } from "@project-serum/anchor/dist/cjs/provider";
import Counter from './Counter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../hooks';
import { addOffer } from '../features/trades/tradesSlice';
import { toast } from 'react-toastify';

type Props = {
    token: TradeableTokenType
}

function TradeableToken({ token }: Props) {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [amountOffered, setAmountOffered] = useState(1);
    const [amountWanted, setAmountWanted] = useState(1);

    const tradingPairs = () => {
        return TOKEN_INFO.filter(t => t.mint !== token.mint)
    }

    const [tokenWanted, setTokenWanted] = useState(tradingPairs()[0].mint);
    const { mintsWithAccounts } = useAppSelector(state => state.trades);
    const dispatch = useAppDispatch();

    const initiateTrade = async (token: TradeableTokenType) => {
        const kindOfTokenOffered = new PublicKey(token.mint)
        const kindOfTokenWanted = new PublicKey(tokenWanted);
        const whereToSendWhatsWanted = mintsWithAccounts.filter(m => m.mint === tokenWanted)[0].associatedAccount;
        toast.info("Placing trade...");

        try {

            const newOffer = await makeOffer(
                kindOfTokenOffered,
                kindOfTokenWanted,
                new PublicKey(whereToSendWhatsWanted),
                new PublicKey(token.accountHoldingToken),
                new BN(`1${"0".repeat(token.decimals)}`).muln(amountOffered),
                new BN(`1${"0".repeat(token.decimals)}`).muln(amountWanted),
                (wallet as any) as NodeWallet
            );
            if (newOffer) {
                dispatch(addOffer(newOffer));
                refreshTokens((wallet as any) as NodeWallet, connection, dispatch);
                toast.success("Trade placed!");
            }


        } catch (error) {
            toast.error("There was an error placing the trade.")
            console.log("Error while initiating a trade: ", error);
        }

    }

    return (
        <div>
            <div className="bg-token-card rounded-lg m-2 flex flex-col items-center pb-1">
                <div className="flex flex-col items-center">
                    <div className="bg-token-amount rounded-2xl p-1 mt-3 mb-3 flex flex-col items-center">
                        <span className="font-bold mr-1 underline">mint address</span>
                        <span>
                            {token.mint}
                        </span>
                    </div>
                    <div className="bg-token-amount rounded-2xl p-1 self-end mr-2 mt-2 font-bold">{parseInt(token.amount)}</div>
                    <img className="w-28 h-20 mb-2 mt-1" src={token.image} alt="" />
                    <div className="m-2">
                        <Counter

                            increment={() => {
                                if (amountOffered < (parseInt(token.amount))) {
                                    setAmountOffered(amountOffered + 1)
                                };
                            }}

                            decrement={() => {
                                if (amountOffered > 0) {
                                    setAmountOffered(amountOffered - 1)
                                };
                            }}
                            currentValue={amountOffered}

                        />
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faRetweet} size="5x" />

                        <select value={tokenWanted} onChange={(e) => setTokenWanted(e.target.value)} className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                            {tradingPairs().map((t) => {
                                return <option className="text-center" key={t.mint} defaultValue={t.mint} value={t.mint}>{t.name}{t.emoji}</option>
                            })}
                        </select>
                    </div>

                    <div className="text-center mt-4 p-2">
                        <Counter

                            increment={() => {
                                setAmountWanted(amountWanted + 1)
                            }}

                            decrement={() => {
                                if (amountWanted > 0) {
                                    setAmountWanted(amountWanted - 1)
                                };
                            }}
                            currentValue={amountWanted}

                        />
                    </div>

                    <div className="text-center mt-2">
                        <button onClick={() => initiateTrade(token)} className="bg-green-btn rounded-2xl p-2 mt-5 mb-5 font-semibold">Place Offer</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default TradeableToken;
