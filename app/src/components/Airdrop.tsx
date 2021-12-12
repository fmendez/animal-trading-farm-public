import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks';
import { airdropCows, airdropPigs, airdropSol, retrieveTokens } from '../api';
import { NodeWallet } from '@project-serum/anchor/dist/cjs/provider';
import { addMintsWithAccount, addTokens } from '../features/trades/tradesSlice';
import { toast } from 'react-toastify';



function Airdrop() {
    const { tokens } = useAppSelector((state) => state.trades);
    const wallet = useWallet();
    const [solRequestSubmitted, setSolRequestSubmitted] = useState(false)
    const dispatch = useAppDispatch();
    const { connection } = useConnection();

    const airdrop = async () => {
        toast.info("Airdroping some farm animals!")
        await airdropPigs((wallet as any) as NodeWallet)
        await airdropCows((wallet as any) as NodeWallet)
        const res = await retrieveTokens((wallet as any) as NodeWallet, connection);
        if (res) {
            dispatch(addMintsWithAccount(res.mintsWithAssociatedAccounts));
            dispatch(addTokens(res.tradeableTokens));
            toast.success("You should now have some farm animals to trade!")
        }

    }

    const handleAirdropSol = async () => {
        toast.info("Airdroping some SOL...")
        setSolRequestSubmitted(true);
        const tx = await airdropSol((wallet as any) as NodeWallet)
        if (tx) {
            toast.success("Airdrop done. You should have 1+ SOL")
            setSolRequestSubmitted(false);
        }
    }


    return (
        <div className="flex items-center justify-center">
            {tokens.length === 0 &&
                <div>
                    <button onClick={() => airdrop()} className="bg-offer-card rounded-2xl p-4 mt-5 mb-5 font-semibold text-2xl m-3">Airdrop some 🐷 🐮</button>
                </div>
            }
            <button disabled={solRequestSubmitted} onClick={() => handleAirdropSol()} className="bg-offer-card rounded-2xl p-4 mt-5 mb-5 font-semibold text-2xl m-3">Airdrop some SOL</button>
        </div>
    )
}

export default Airdrop
