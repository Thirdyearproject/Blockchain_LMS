import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import BookManagerArtifact from "../build/contracts/BookManager.json";
import BorrowManagerArtifact from "../build/contracts/BorrowManager.json";
import { RPC_URL } from "../services/apis";

const Books = ({ account, privateKey }) => {
  const [allBooks, setAllBooks] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookContract, setBookContract] = useState(null);
  const [borrowContract, setBorrowContract] = useState(null);

  useEffect(() => {
    const setupContracts = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(privateKey, provider);

        const lastBookIndex =
          Object.keys(BookManagerArtifact.networks).length - 1;
        const bookNetworkId = Object.keys(BookManagerArtifact.networks)[
          lastBookIndex
        ];
        const bookNetworkData = BookManagerArtifact.networks[bookNetworkId];

        if (!bookNetworkData?.address) {
          console.error(`BookManager not deployed on network ${bookNetworkId}`);
          return;
        }

        const bookContractInstance = new ethers.Contract(
          bookNetworkData.address,
          BookManagerArtifact.abi,
          wallet
        );
        setBookContract(bookContractInstance);

        const lastBorrowIndex =
          Object.keys(BorrowManagerArtifact.networks).length - 1;
        const borrowNetworkId = Object.keys(BorrowManagerArtifact.networks)[
          lastBorrowIndex
        ];
        const borrowNetworkData =
          BorrowManagerArtifact.networks[borrowNetworkId];

        if (!borrowNetworkData?.address) {
          console.error(
            `BorrowManager not deployed on network ${borrowNetworkId}`
          );
          return;
        }

        const borrowContractInstance = new ethers.Contract(
          borrowNetworkData.address,
          BorrowManagerArtifact.abi,
          wallet
        );
        setBorrowContract(borrowContractInstance);
      } catch (error) {
        console.error("Error setting up contracts:", error);
      }
    };

    setupContracts();
  }, [privateKey]);

  const fetchBooks = async () => {
    if (!bookContract || !borrowContract) {
      console.error("Contracts not ready yet");
      return;
    }

    setLoading(true);

    try {
      const totalBooks = await bookContract.getBooksCount();
      const books = [];

      for (let i = 0; i < totalBooks; i++) {
        const book = await bookContract.getBook(i);
        books.push({
          id: i,
          title: book.title,
          requiredClearance: Number(book.requiredClearance),
          status: Number(book.status),
        });
      }

      const available = [];
      const borrowed = [];

      for (const book of books) {
        if (book.status === 1) {
          // Only available books
          const alreadyBorrowed = await borrowContract.hasBorrowed(
            account,
            book.id
          );
          if (alreadyBorrowed) {
            borrowed.push(book);
          } else {
            available.push(book);
          }
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

  const borrowBook = async (bookId) => {
    if (!borrowContract) {
      console.error("Borrow Contract not ready");
      return;
    }

    try {
      const tx = await borrowContract.borrowBook(bookId);
      await tx.wait();

      alert("Book borrowed successfully!");
      await fetchBooks(); // Refresh after borrowing
    } catch (error) {
      console.error("Error borrowing book:", error);
      alert("Failed to borrow book.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-12 p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Library Book Management
      </h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={fetchBooks}
          disabled={loading}
          className={`${
            loading
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          } text-white font-semibold px-6 py-2 rounded-md transition`}
        >
          {loading ? "Fetching..." : "Fetch Books"}
        </button>
      </div>

      {/* All Books */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-indigo-700 border-b border-indigo-300 pb-2">
          All Books
        </h2>

        {allBooks.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {allBooks.map((book) => (
              <li key={book.id} className="py-3">
                <div className="flex justify-between items-center">
                  <p className="text-gray-800 font-semibold">{book.title}</p>
                  <span
                    className={`text-sm ${
                      book.status === 1
                        ? "text-green-600"
                        : "text-gray-400 italic"
                    }`}
                  >
                    {book.status === 1 ? "Available" : "Unavailable"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No books available.</p>
        )}
      </section>

      {/* Available Books */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-blue-700 border-b border-blue-300 pb-2">
          Available Books
        </h2>

        {availableBooks.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {availableBooks.map((book) => (
              <li
                key={book.id}
                className="flex justify-between items-center py-3"
              >
                <p className="text-gray-900 font-medium">{book.title}</p>
                <button
                  onClick={() => borrowBook(book.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-semibold transition"
                >
                  Borrow
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No available books.</p>
        )}
      </section>

      {/* Borrowed Books */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6 text-green-700 border-b border-green-300 pb-2">
          Borrowed Books
        </h2>

        {borrowedBooks.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {borrowedBooks.map((book) => (
              <li
                key={book.id}
                className="flex justify-between items-center py-3"
              >
                <p className="text-gray-900 font-medium">{book.title}</p>
                <p className="text-gray-500 italic">
                  Return functionality coming soon
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No borrowed books yet.</p>
        )}
      </section>
    </div>
  );
};

export default Books;
