import { PublicKey, Connection, Commitment } from "@solana/web3.js";
import { Provider } from "@project-serum/anchor";
import { NodeWallet } from "@project-serum/anchor/dist/cjs/provider";
import { useConnection } from "@solana/wallet-adapter-react";
import { retrieveTokens } from "./api";
import { addMintsWithAccount, addTokens } from "./features/trades/tradesSlice";

// CowMintPDA:   2Qd9uanvZ9y5Kzy6Us5i36RZpmyp6KbrSsQ9VFRw7d7Z
// CowMintPDABUM:   255

// CowMintPDA:   2Qd9uanvZ9y5Kzy6Us5i36RZpmyp6KbrSsQ9VFRw7d7Z
// CowMintPDABUM:   255
// PigMintPDA:   7ddqSovv9HDm82xZ7o51mX3emYQFTAvVSv5uvyCQXTpV
// PigMintPDABUM:   255

// CowMintPDA:   2Qd9uanvZ9y5Kzy6Us5i36RZpmyp6KbrSsQ9VFRw7d7Z
// CowMintPDABUM:   255
// PigMintPDA:   7ddqSovv9HDm82xZ7o51mX3emYQFTAvVSv5uvyCQXTpV
// PigMintPDABUM:   255

export const TOKEN_INFO = [
    {
        image: require("./assets/images/cow.png").default,
        mint: "2Qd9uanvZ9y5Kzy6Us5i36RZpmyp6KbrSsQ9VFRw7d7Z",
        mintBump: 255,
        name: "cow",
        emoji: "🐮"
    },
    {
        image: require("./assets/images/pig.png").default,
        mint: "7ddqSovv9HDm82xZ7o51mX3emYQFTAvVSv5uvyCQXTpV",
        mintBump: 255,
        name: "pig",
        emoji: "🐷"
    }
]
export const tokenByMint = (mint: string) => {
    return TOKEN_INFO.filter(t => t.mint === mint)[0]
}


export const PROGRAM_ID = new PublicKey("6iHfHR4e2KusjUQMoqEgjNqaxw4Cgg5R3xgKrCorxEHN");

const opts = {
    preflightCommitment: "processed" as Commitment,
};

export const getConnection = () => {
    let network = localStorage.getItem("network") || "https://api.devnet.solana.com";
    const connection = new Connection(network, opts.preflightCommitment);
    return connection;
};

export const getProvider = async (wallet: NodeWallet) => {
    const provider = new Provider(
        getConnection(),
        wallet,
        opts
    );
    return provider;
};

export const refreshTokens = async (wallet: NodeWallet, connection: Connection, dispatch: any) => {
    const res = await retrieveTokens((wallet as any) as NodeWallet, connection);
    if (res) {
        dispatch(addMintsWithAccount(res.mintsWithAssociatedAccounts));
        dispatch(addTokens(res.tradeableTokens));
    }
}
