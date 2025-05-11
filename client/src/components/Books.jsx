import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import BookManagerArtifact from "../build/contracts/BookManager.json";
import BorrowManagerArtifact from "../build/contracts/BorrowManager.json";
import { RPC_URL, BookAddress, BorrowAddress } from "../services/apis";

const Books = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookContract, setBookContract] = useState(null);
  const [borrowContract, setBorrowContract] = useState(null);
  const [account, setAccount] = useState(""); // Add state to store current account

  useEffect(() => {
    const setupContracts = async () => {
      try {
        if (!window.ethereum) {
          console.error("Please install MetaMask!");
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();

        setAccount(signer.address); // Set the current account

        const bookContractInstance = new ethers.Contract(
          BookAddress,
          BookManagerArtifact.abi,
          signer
        );
        setBookContract(bookContractInstance);

        const borrowContractInstance = new ethers.Contract(
          BorrowAddress,
          BorrowManagerArtifact.abi,
          signer
        );
        setBorrowContract(borrowContractInstance);
      } catch (error) {
        console.error("Error setting up contracts:", error);
      }
    };

    setupContracts();
  }, []); // Empty dependency array to run setupContracts once

  const fetchBooks = async () => {
    if (!bookContract || !borrowContract || !account) {
      console.error("Contracts or account not ready");
      return;
    }

    setLoading(true);
    try {
      const totalBooks = await bookContract.getBooksCount();
      const books = [];

      for (let i = 0; i < totalBooks; i++) {
        const book = await bookContract.getBook(i);
        books.push({
          index: i,
          id: book.bookId,
          title: book.title,
          author: book.author,
          ipfsHash: book.ipfsHash,
          requiredClearance: Number(book.requiredClearance),
          status: Number(book.status),
        });
      }
      console.log(books);

      const available = [];
      const borrowed = [];

      for (const book of books) {
        if (book.status === 1) {
          const alreadyBorrowed = await borrowContract.hasBorrowed(
            account,
            book.index
          );
          alreadyBorrowed ? borrowed.push(book) : available.push(book);
        }
      }

      setAllBooks(books);
      setAvailableBooks(available);
      setBorrowedBooks(borrowed);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const borrowBook = async (bookIndex) => {
    if (!borrowContract || !account) {
      console.error("Borrow Contract or account not initialized");
      return;
    }
    console.log(bookIndex);

    try {
      const tx = await borrowContract.borrowBook(bookIndex, {
        value: ethers.parseEther("0.01"),
      });
      await tx.wait();
      alert("Book borrowed successfully!");
      await fetchBooks();
    } catch (error) {
      console.error("Error borrowing book:", error);
      alert("Failed to borrow book.");
    }
  };

  const returnBook = async (bookId) => {
    if (!borrowContract || !account) {
      console.error("Borrow Contract or account not initialized");
      return;
    }

    try {
      // Find the borrow record ID (`_borrowId`) for this user and book
      const borrows = await borrowContract.getAllBorrows();
      console.log(borrows);
      const borrowId = borrows.findIndex(
        (b) =>
          b.user.toLowerCase() === account.toLowerCase() &&
          Number(b.bookId) === bookId &&
          !b.returned
      );

      if (borrowId === -1) {
        alert("No active borrow record found for this book.");
        return;
      }

      const tx = await borrowContract.returnBook(borrowId);
      await tx.wait();
      alert("Book returned successfully!");
      await fetchBooks();
    } catch (error) {
      console.error("Error returning book:", error);
      alert("Failed to return book.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto my-16 p-10 bg-gradient-to-b from-indigo-50 to-white rounded-3xl shadow-2xl">
      <h1 className="text-5xl font-extrabold text-center mb-14 text-indigo-800 tracking-tight">
        📚 Library Book Management
      </h1>

      <div className="flex justify-center mb-14">
        <button
          onClick={fetchBooks}
          disabled={loading}
          className={`px-10 py-4 rounded-full font-bold text-lg shadow-md transition-all duration-300 ${
            loading
              ? "bg-indigo-300 text-white cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105"
          }`}
        >
          {loading ? "Fetching..." : "Fetch Books"}
        </button>
      </div>

      {/* All Books Section */}
      <section className="mb-20">
        <h2 className="text-4xl font-bold mb-8 text-purple-700 border-b-4 pb-4 border-purple-300">
          📖 All Books
        </h2>
        {allBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allBooks.map((book) => (
              <div
                key={book.index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between border border-gray-200"
              >
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-500 mb-6">by {book.author}</p>
                  <p
                    className={`text-md font-semibold ${
                      book.status === 1
                        ? "text-green-600"
                        : "text-gray-400 italic"
                    }`}
                  >
                    {book.status === 1 ? "Available" : "Unavailable"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic mt-4">No books available.</p>
        )}
      </section>

      {/* Available Books Section */}
      <section className="mb-20">
        <h2 className="text-4xl font-bold mb-8 text-blue-700 border-b-4 pb-4 border-blue-300">
          🆓 Available Books
        </h2>
        {availableBooks.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {availableBooks.map((book) => (
              <li
                key={book.index}
                className="flex justify-between items-center py-6 hover:bg-indigo-50 px-4 rounded-xl transition-all duration-300"
              >
                <p className="text-xl font-medium text-gray-800">
                  {book.title}
                </p>
                <button
                  onClick={() => borrowBook(book.index)}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
                >
                  Borrow
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 italic mt-4">
            No available books to borrow.
          </p>
        )}
      </section>

      {/* Borrowed Books Section */}
      <section>
        <h2 className="text-4xl font-bold mb-8 text-green-700 border-b-4 pb-4 border-green-300">
          ✅ Borrowed Books
        </h2>
        {borrowedBooks.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {borrowedBooks.map((book) => (
              <li
                key={book.id}
                className="flex flex-col md:flex-row md:justify-between md:items-center py-6 hover:bg-green-50 px-4 rounded-xl transition-all duration-300 space-y-4 md:space-y-0"
              >
                <div>
                  <p className="text-xl font-medium text-gray-800">
                    {book.title}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => returnBook(book.index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
                  >
                    Return
                  </button>
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${book.ipfsHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
                  >
                    Open File
                  </a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 italic mt-4">No borrowed books yet.</p>
        )}
      </section>
    </div>
  );
};

export default Books;
