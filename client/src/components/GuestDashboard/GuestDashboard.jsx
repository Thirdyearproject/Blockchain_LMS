import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Navbar from "../Dashboard/Navbar";
import ELibrary from "../../build/contracts/BookManager.json";
import { RPC_URL, BookAddress } from "../../services/apis";

function GuestDashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContract = async () => {
      try {
        // 1. Connect to blockchain
        const provider = new ethers.JsonRpcProvider(RPC_URL);

        // 4. Create contract instance
        const contract = new ethers.Contract(
          BookAddress,
          ELibrary.abi,
          provider
        );
        console.log("Contract loaded:", contract.target);

        // 5. Fetch books
        const booksCount = await contract.getBooksCount();
        console.log("Books count:", booksCount.toString());

        const booksArray = [];
        for (let i = 0; i < booksCount; i++) {
          const book = await contract.getBook(i);
          // Assuming the contract returns an object with title and author
          booksArray.push({ title: book.title, author: book.author });
        }

        setBooks(booksArray);
      } catch (error) {
        console.error("Error loading contract or fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContract();
  }, []);

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen w-full p-6">
      <Navbar name="Guest Dashboard" />

      <div className="w-full max-w-4xl mx-auto mt-8 flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Library Books
        </h2>

        {loading ? (
          <div className="flex justify-center items-center text-xl text-gray-600">
            <span>Loading books...</span>
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl shadow-lg text-lg text-gray-700 hover:bg-gray-100 transition duration-300"
              >
                <span className="text-xl font-semibold">{idx + 1}. </span>
                <div className="text-gray-900 font-bold">{book.title}</div>
                <div className="text-gray-600 text-sm">by {book.author}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-600">
            No books available
          </p>
        )}
      </div>
    </div>
  );
}

export default GuestDashboard;
