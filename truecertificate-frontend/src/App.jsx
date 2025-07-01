import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import AddCertificate from "./components/AddCertificate";

function App() {
  const [wallet, setWallet] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">🎓 CertiProof</h1>
      <ConnectWallet setWallet={setWallet} />

      {wallet && (
        <div className="mt-6">
          <AddCertificate wallet={wallet} />
        </div>
      )}
    </div>
  );
}

export default App;
