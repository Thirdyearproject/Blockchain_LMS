import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import BookManager from "../build/contracts/BookManager.json"; // Correct contract
import { BookAddress } from "../services/apis";

const VoteOnBooks = () => {
  const [contract, setContract] = useState(null);
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setMessage("Please install MetaMask!");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      const contractInstance = new ethers.Contract(
        BookAddress,
        BookManager.abi,
        signer
      );
      setContract(contractInstance);
      return contractInstance;
    } catch (error) {
      console.error("Wallet connection failed:", error);
      setMessage("Failed to connect to wallet.");
      return null;
    }
  };

  const loadPendingBooks = async () => {
    try {
      setLoading(true);
      setMessage("");

      let contractInstance = contract;
      if (!contractInstance) {
        contractInstance = await connectWallet();
        if (!contractInstance) return;
      }

      const allBooks = await contractInstance.getAllBooks();
      const pendingBooks = allBooks
        .map((book, index) => ({
          id: index,
          title: book.title,
          author: book.author,
          ipfsHash: book.ipfsHash,
          requiredClearance: Number(book.requiredClearance),
          status: Number(book.status),
        }))
        .filter((book) => book.status === 0); // Only Proposed books

      setBooks(pendingBooks);
    } catch (error) {
      console.error("Error loading books:", error);
      setMessage("Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (bookId, approve) => {
    try {
      setMessage("");

      let contractInstance = contract;
      if (!contractInstance) {
        contractInstance = await connectWallet();
        if (!contractInstance) return;
      }

      const tx = await contractInstance.voteOnBook(bookId, approve);
      await tx.wait();

      setMessage("Vote submitted successfully!");
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Voting failed:", error);
      setMessage("Voting failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-5xl bg-white p-10 rounded-3xl shadow-2xl">
        <h1 className="text-5xl font-extrabold mb-10 text-center text-indigo-700">
          Vote on Pending Books
        </h1>

        {!account && (
          <div className="flex justify-center mb-8">
            <button
              onClick={connectWallet}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Connect Wallet
            </button>
          </div>
        )}

        {!books.length && account ? (
          <div className="flex justify-center mb-8">
            <button
              onClick={loadPendingBooks}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Loading..." : "Start Voting"}
            </button>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-gradient-to-r from-white to-indigo-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {book.title}
                  </h2>
                  <p className="text-gray-600 mb-3 italic">by {book.author}</p>
                  {book.ipfsHash && (
                    <a
                      href={`https://gateway.pinata.cloud/ipfs/${book.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:text-indigo-600 underline text-sm"
                    >
                      View File
                    </a>
                  )}
                  <div className="mt-3">
                    <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full">
                      Pending Approval
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={() => handleVote(book.id, true)}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-full font-semibold shadow-md transition-all"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleVote(book.id, false)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-full font-semibold shadow-md transition-all"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {message && (
          <p className="text-center text-lg font-semibold text-red-500 mt-10">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default VoteOnBooks;
