
import "../index.css";
import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useCallback, useEffect } from "react";
import { allOpenOffers, retrieveTokens } from "../api";
import { NodeWallet } from "@project-serum/anchor/dist/cjs/provider";
import Tokens from "../components/Tokens";
import pigImg from '../assets/images/pig.png';
import cowImg from '../assets/images/cow.png';
import Offers from "../components/Offers";
import { addMintsWithAccount, addOffers, addTokens } from "../features/trades/tradesSlice";
import { useAppDispatch } from "../hooks";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




Amplify.configure(awsconfig);
require("@solana/wallet-adapter-react-ui/styles.css");

function Home() {
    const wallet = useWallet();
    const dispatch = useAppDispatch();
    const { connection } = useConnection();
    const init = useCallback(async () => {
        if (wallet.connected) {
            const tokens = await retrieveTokens((wallet as any) as NodeWallet, connection);
            const allOffers = await allOpenOffers();
            dispatch(addOffers(allOffers));
            dispatch(addMintsWithAccount(tokens.mintsWithAssociatedAccounts));
            dispatch(addTokens(tokens.tradeableTokens));
        }
    }, [wallet])

    useEffect(() => {

        init();

    })

    if (!wallet.connected) {
        return (
            <div className="main-container p-4">
                <div className="flex flex-row lg:w-1/4 sm:w-full md:w-1/2 items-center justify-center mx-auto">
                    <img src={pigImg} className="w-7 m-2" alt="" />
                    <WalletMultiButton />
                    <img src={cowImg} className="w-7 m-2" alt="" />
                </div>

            </div>
        );
    } else {
        return (
            <div className="main-container p-4">
                <ToastContainer
                    position="top-left"

                />
                <Tokens />
                <Offers />
            </div>
        );
    }
}

export default Home;