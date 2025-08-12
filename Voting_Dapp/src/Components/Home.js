import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { ABI, Contract_Address } from "../constants.js";

const Home = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTxLoading, setIsTxLoading] = useState(false); // For button state

  useEffect(() => {
    const initialize = async () => {
      if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask!");
        setLoading(false);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        setCurrentAccount(account);

        const contract = new ethers.Contract(Contract_Address, ABI, signer);

        const status = await contract.isCompleted();
        setIsCompleted(status);

        const winner = await contract.getWinner();
        setIsWinner(winner.toLowerCase() === account.toLowerCase());
      } catch (err) {
        console.error("Error initializing contract:", err);
        if (err.message.includes("cannot estimate gas")) {
          console.error("Contract not deployed or function reverted");
        } else if (err.code === "CALL_EXCEPTION") {
          console.error(
            "Contract call failed: function may not exist or reverted"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        initialize(); // Re-fetch data
      } else {
        setCurrentAccount("");
        setLoading(false);
      }
    };

    initialize();

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  const enterLottery = async () => {
    if (!window.ethereum) return;
    setIsTxLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(Contract_Address, ABI, signer);
      const value = ethers.parseEther("0.005");

      const tx = await contract.Join({ value });
      await tx.wait();
      alert("🎉 Successfully entered the lottery!");
    } catch (err) {
      console.error(err);
      alert("Transaction failed. Check console.");
    } finally {
      setIsTxLoading(false);
    }
  };

  const claimPrize = async () => {
    if (!window.ethereum) return;
    try {
      setIsTxLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(Contract_Address, ABI, signer);

      const tx = await contract.claimPrize();
      await tx.wait();
      alert("💰 Prize claimed successfully!");
    } catch (err) {
      console.error(err);
      alert("Claim failed. Are you the winner?");
    } finally {
      setIsTxLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-white text-2xl font-semibold animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 text-center">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300">
          🎰 Enter the Lottery
        </h1>

        {/* Wallet Info */}
        <p className="text-lg mb-8">
          <span className="font-medium">Wallet:</span>{" "}
          <span className="block mt-1 px-4 py-2 bg-white/10 rounded-lg break-all font-mono text-sm">
            {currentAccount}
          </span>
        </p>

        {/* Action Buttons */}
        <div className="space-y-6">
          {isCompleted ? (
            isWinner ? (
              <button
                onClick={claimPrize}
                disabled={isTxLoading}
                className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xl rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95 duration-200"
              >
                {isTxLoading ? "Claiming..." : "💰 Claim Prize"}
              </button>
            ) : (
              <p className="text-red-200 text-lg font-medium bg-red-900/30 rounded-lg p-4 border border-red-700">
                🏁 Lottery completed. You are not the winner.
              </p>
            )
          ) : (
            <button
              onClick={enterLottery}
              disabled={isTxLoading}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xl rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95 duration-200"
            >
              {isTxLoading ? "Entering..." : "🎫 Enter Lottery (0.005 ETH)"}
            </button>
          )}
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-300 mt-10">
          Good luck! Winner selected fairly on-chain 🙌
        </p>
      </div>
    </div>
  );
};

export default Home;
