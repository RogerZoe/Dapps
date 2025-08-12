import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { ABI, Contract_Address } from "../constants.js";

const Winner = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [winnerAddress, setWinnerAddress] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

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
        setWinnerAddress(winner);

        const owner = await contract.getManager();
        setIsOwner(owner.toLowerCase() === account.toLowerCase());
      } catch (err) {
        console.error("Error initializing contract:", err);
        if (err.message.includes("cannot estimate gas")) {
          console.error("Contract not deployed or function reverted");
        } else if (err.code === "CALL_EXCEPTION") {
          console.error("Contract call failed: function may not exist or reverted");
        }
      } finally {
        setLoading(false);
      }
    };

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        initialize(); // Re-initialize on account change
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

  const pickWinner = async () => {
    if (!window.ethereum) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(Contract_Address, ABI, signer);

      const tx = await contract.SelectWinner();
      setLoading(true);
      await tx.wait();

      // Refresh data after transaction
      const updatedWinner = await contract.getWinner();
      const status = await contract.isCompleted();
      setWinnerAddress(updatedWinner);
      setIsCompleted(status);
    } catch (err) {
      console.error("Error picking winner:", err);
      alert("Failed to pick winner. Are you the owner?");
    } finally {
      setLoading(false);
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
      <div className="max-w-3xl mx-auto bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 bg-clip-text text-transparent  bg-gradient-to-t from-pink-300 to-purple-900 ">
          🏁 Result Page
        </h1>

        {/* Wallet Info */}
        <p className="text-lg text-center mb-8">
          <span className="font-medium">Your Wallet:</span>{" "}
          <span className="block mt-1 px-4 py-2 bg-white/10 rounded-lg break-all font-mono text-sm">
            {currentAccount}
          </span>
        </p>

        {/* Main Content */}
        <div className="space-y-8">
          {isCompleted ? (
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">🎉 The Winner Is:</h2>
              <div className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg break-all max-w-md mx-auto font-bold text-black text-lg transform transition hover:scale-105 duration-300">
                {winnerAddress}
              </div>
            </div>
          ) : (
            <div className="text-center">
              {isOwner ? (
                <button
                  onClick={pickWinner}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xl rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95 duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300"
                >
                  {loading ? "Picking..." : "✨ Pick Winner"}
                </button>
              ) : (
                <p className="text-red-200 text-lg font-medium bg-red-900/30 rounded-lg p-4 border border-red-700">
                  You are not the owner. Cannot pick winner.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-300 mt-10">
         Lottery Dapp
        </p>
      </div>
    </div>
  );
};

export default Winner;