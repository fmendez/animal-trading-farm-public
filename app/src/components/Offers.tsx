import React from 'react'
import { allOpenOffers } from '../api';
import { addOffers } from '../features/trades/tradesSlice';
import { useAppDispatch, useAppSelector, useInterval } from '../hooks';
import Offer from './Offer'

function Offers() {
    const { offers } = useAppSelector(state => state.trades);
    const { tokens } = useAppSelector((state) => state.trades);

    const dispatch = useAppDispatch();

    // useInterval(async (isCancelled: any) => {
    //     const allOffers = await allOpenOffers();
    //     dispatch(addOffers(allOffers));
    //     if (isCancelled) return;

    // }, 10000, true)
    // fetchMoreOffers();

    return (
        <div className="bg-opacity-20">
            {offers && offers?.length === 0 &&
                <div className="flex flex-col">
                    <h4 className="self-center text-lg pb-8 font-bold text-red-btn font-bold text-4xl">There are no offers placed </h4>
                </div>
            }
            {tokens && tokens?.length === 0 &&
                <div className="flex flex-col">
                    <h4 className="self-center text-lg pb-8 font-bold text-red-btn font-bold text-4xl">You have no Tokens to trade.</h4>
                </div>
            }
            {offers && offers?.length > 0 &&
                tokens && tokens.length > 0 &&

                <div className="flex flex-col">
                    <h4 className="self-center text-4xl  lg:text-6xl pb-8 pt-10 font-bold text-red-btn">Open Offers</h4>
                </div>
            }
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-col-1 gap-1" >
                {offers && offers.length > 0 &&
                    tokens && tokens.length > 0 &&
                    offers.map(offer => (
                        <Offer key={offer.id} offer={offer} />
                    ))
                }
            </div>
        </div>
    )
}

export default Offers
