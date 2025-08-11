import React, { useEffect, useState } from "react";
import constants from "./constant/constant.js"; // Import the default export
import { ethers } from "ethers";
import Login from "./Components/Login";
import "./index.css";
import Account from "./Components/Account";
import Finished from "./Components/Finished.jsx";

// Destructure the default export array
const [CONTRACT_ADDRESS, ABI] = constants;

const App = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [Connected, setConnected] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [votingStatus, setVotingStatus] = useState(false);
  const [remainingTime, setremainingTime] = useState("");
  const [number, setNumber] = useState("");
  const [CanVote, setCanVote] = useState(true);

  useEffect(() => {
    getCandidates();
    getCurrentStatus();
    getRemainingTime();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccounts);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccounts);
      }
    };
  }, []); // Add empty dependency array to prevent infinite loops

  async function vote() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI,
        signer
      );

      const tx = await contractInstance.vote(number);
      await tx.wait();

      await canVote(); // ✅ Update voting eligibility
      await getCandidates(); // ✅ Fetch updated candidate vote counts
    } catch (error) {
      console.error("Vote failed:", error);
    }
  }

  async function canVote() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const voteStatus = await contractInstance.voters(await signer.getAddress());
    setCanVote(voteStatus);
  }

  async function getCandidates() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI,
        signer
      );
      const candidatesList = await contractInstance.getAllVotesOfCandiates();
      console.log(candidatesList);
      const formattedCandidates = candidatesList.map((candidate, index) => {
        return {
          index: index,
          name: candidate.name,
          voteCount: Number(candidate.voteCount),
        };
      });
      setCandidates(formattedCandidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  }

  async function getCurrentStatus() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI,
        signer
      );
      const status = await contractInstance.getVotingStatus();
      setVotingStatus(status);
    } catch (error) {
      console.error("Error fetching voting status:", error);
    }
  }

  function formatTime(seconds) {
    if (seconds <= 0) return "Voting has ended";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }

  async function getRemainingTime() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI,
        signer
      );

      const time = await contractInstance.getRemainingTime(); // returns seconds
      const formatted = formatTime(Number(time));

      setremainingTime(formatted);
    } catch (error) {
      console.error("Error fetching remaining time:", error);
    }
  }

  function handleAccounts(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      // setConnected(true); // Ensure connected state is updated
      canVote();
    } else {
      setConnected(false);
      setAccount(null);
    }
  }

  async function WalletConnection() {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("Metamask Wallet Connected", address);
        setConnected(true);
        canVote();
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("Metamask is Not Connected");
    }
  }
  async function handleInputChange(e) {
    setNumber(e.target.value);
  }

  return (
    <div>
      {!votingStatus ? (
        Connected ? (
          <Account
            account={account}
            candidates={candidates}
            remainingTime={remainingTime}
            number={number}
            handleInputChange={handleInputChange}
            voteFun={vote}
            showButton={CanVote}
          />
        ) : (
          <Login connectWallet={WalletConnection} />
        )
      ) : (
        <Finished />
      )}
    </div>
  );
};

export default App;
