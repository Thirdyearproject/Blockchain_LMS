import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Upload from "../build/contracts/BookManager.json";
import { RPC_URL } from "../services/apis";

const VoteOnBooks = ({ account, privateKey }) => {
  const [contract, setContract] = useState(null);
  const [bookId, setBookId] = useState("");
  const [approve, setApprove] = useState(true);
  const [message, setMessage] = useState("");

  const initializeWallet = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(privateKey, provider);

      const lastIndex = Object.keys(Upload.networks).length - 1;
      const networkId = Object.keys(Upload.networks)[lastIndex];
      const networkData = Upload.networks[networkId];

      if (!networkData || !networkData.address) {
        throw new Error(`Contract not deployed on network ${networkId}`);
      }

      const contractInstance = new ethers.Contract(
        networkData.address,
        Upload.abi,
        wallet
      );

      setContract(contractInstance);
    } catch (error) {
      console.error("Wallet initialization failed:", error);
      setMessage("Wallet initialization failed.");
    }
  };

  useEffect(() => {
    initializeWallet();
  }, []);

  const handleVote = async () => {
    if (!contract) {
      setMessage("Contract not ready yet.");
      return;
    }

    try {
      const tx = await contract.voteOnBook(bookId, approve);
      await tx.wait();
      setMessage("Vote submitted successfully!");
    } catch (error) {
      console.error("Voting error:", error);
      setMessage("Voting failed.");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold">Vote on Book</h2>

      <input
        type="number"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
        placeholder="Book ID (Index)"
        className="border p-2 rounded"
      />

      <select
        value={approve}
        onChange={(e) => setApprove(e.target.value === "true")}
        className="border p-2 rounded"
      >
        <option value="true">Approve</option>
        <option value="false">Reject</option>
      </select>

      <button
        onClick={handleVote}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Submit Vote
      </button>

      {message && <p className="text-red-500 mt-2">{message}</p>}
    </div>
  );
};

export default VoteOnBooks;
