import React, { useState } from "react";
import { ethers } from "ethers";
import BookManager from "../build/contracts/BookManager.json"; // Correct contract
import { RPC_URL } from "../services/apis";

const VoteOnBooks = ({ account, privateKey }) => {
  const [contract, setContract] = useState(null);
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadPendingBooks = async () => {
    try {
      setLoading(true);
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(privateKey, provider);

      const lastIndex = Object.keys(BookManager.networks).length - 1;
      const networkId = Object.keys(BookManager.networks)[lastIndex];
      const networkData = BookManager.networks[networkId];

      if (!networkData || !networkData.address) {
        throw new Error(`Contract not deployed on network ${networkId}`);
      }

      const contractInstance = new ethers.Contract(
        networkData.address,
        BookManager.abi,
        wallet
      );

      setContract(contractInstance);

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
      setMessage("");
    } catch (error) {
      console.error("Error loading books:", error);
      setMessage("Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (bookId, approve) => {
    if (!contract) {
      setMessage("Contract not ready yet.");
      return;
    }

    try {
      const tx = await contract.voteOnBook(bookId, approve);
      await tx.wait();
      setMessage("Vote submitted successfully!");
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Voting failed:", error);
      setMessage("Voting failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-8 px-4">
      <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">
          Vote on Pending Books
        </h1>

        {!books.length ? (
          <div className="flex justify-center mb-6">
            <button
              onClick={loadPendingBooks}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold w-full max-w-md"
              disabled={loading}
            >
              {loading ? "Loading..." : "Start Voting"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow"
              >
                <div>
                  <h2 className="text-xl font-bold mb-2 text-gray-800">
                    {book.title}
                  </h2>
                  <p className="text-gray-600 mb-4">by {book.author}</p>
                  {book.ipfsHash && (
                    <a
                      href={`https://gateway.pinata.cloud/ipfs/${book.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline text-sm"
                    >
                      View File
                    </a>
                  )}
                  <span className="inline-block bg-yellow-300 text-yellow-800 text-xs font-bold px-2 py-1 rounded mt-2">
                    Pending Approval
                  </span>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                  <button
                    onClick={() => handleVote(book.id, true)}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold w-full"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleVote(book.id, false)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold w-full"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {message && <p className="text-center text-red-500 mt-6">{message}</p>}
      </div>
    </div>
  );
};

export default VoteOnBooks;
