
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { getPhantomWallet } from "@solana/wallet-adapter-wallets";
import { store } from "./store";
import { Provider } from "react-redux";
import { useState } from "react";
import Home from "./components/Home";

const wallets = [getPhantomWallet()];

function App() {
  const [network, setNetwork] = useState("https://api.testnet.solana.com")
  const handleNetworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem("network", e.target.value);
    setNetwork(e.target.value);
  }

  return (
    <div>
      <div>
        <span className="font-bold">Network:</span>
        <select onChange={(e) => handleNetworkChange((e as any) as React.ChangeEvent<HTMLInputElement>)} >
          <option value="https://api.testnet.solana.com">https://api.testnet.solana.com</option>
          <option value="https://api.devnet.solana.com">https://api.devnet.solana.com</option>
        </select>

      </div>
      <ConnectionProvider endpoint={network}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Provider store={store}>
              <Home />
            </Provider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>

    </div>
  )

}

export default App;