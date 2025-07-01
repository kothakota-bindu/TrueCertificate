import { useState, useEffect } from "react";
import { ethers } from "ethers";

const ConnectWallet = ({ setWallet }) => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      setWallet({ provider, signer, address });
      setConnected(true);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
    }
  }, []);

  return (
    <div className="flex flex-col items-center mt-4">
      {!connected ? (
        <button
          onClick={connectWallet}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl"
        >
          Connect Wallet
        </button>
      ) : (
        <p className="text-green-600 font-medium">Connected: {account}</p>
      )}
    </div>
  );
};

export default ConnectWallet;
