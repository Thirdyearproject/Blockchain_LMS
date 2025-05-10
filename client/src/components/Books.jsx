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

        // Set up BookManager contract
        const lastBookIndex =
          Object.keys(BookManagerArtifact.networks).length - 1;
        const bookNetworkId = Object.keys(BookManagerArtifact.networks)[
          lastBookIndex
        ];
        const bookNetworkData = BookManagerArtifact.networks[bookNetworkId];

        if (!bookNetworkData?.address)
          return console.error("BookManager not deployed");

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

        if (!borrowNetworkData?.address)
          return console.error("BorrowManager not deployed");

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
  }, [privateKey]); // Ensure this runs whenever privateKey changes

  const fetchBooks = async () => {
    if (!bookContract || !borrowContract)
      return console.error("Contracts not ready");

    setLoading(true);
    try {
      const totalBooks = await bookContract.getBooksCount();
      const books = [];

      for (let i = 0; i < totalBooks; i++) {
        const book = await bookContract.getBook(i);
        console.log(book);
        books.push({
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
            book.id
          );
          console.log(alreadyBorrowed);
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

  const borrowBook = async (bookId) => {
    if (!borrowContract) {
      console.error("Borrow Contract not initialized");
      return;
    }
    console.log(bookId);
    try {
      const tx = await borrowContract.borrowBook(bookId, account);
      await tx.wait();
      alert("Book borrowed successfully!");
      await fetchBooks();
    } catch (error) {
      console.error("Error borrowing book:", error);
      alert("Failed to borrow book.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-12 p-8 bg-gray-100 rounded-lg shadow-2xl">
      <h1 className="text-4xl font-bold text-center mb-10 text-indigo-800">
        📚 Library Book Management
      </h1>

      <div className="flex justify-center mb-10">
        <button
          onClick={fetchBooks}
          disabled={loading}
          className={`${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all`}
        >
          {loading ? "Fetching..." : "Fetch Books"}
        </button>
      </div>

      {/* All Books Section */}
      <section className="mb-14">
        <h2 className="text-3xl font-semibold mb-6 text-purple-700 border-b-2 pb-2 border-purple-300">
          📖 All Books
        </h2>
        {allBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {book.title}
                  </h3>
                  <p className="text-gray-500 mb-4">by {book.author}</p>
                  <p
                    className={`text-sm font-semibold ${
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
          <p className="text-gray-500 italic">No books available.</p>
        )}
      </section>

      {/* Available Books Section */}
      <section className="mb-14">
        <h2 className="text-3xl font-semibold mb-6 text-blue-700 border-b-2 pb-2 border-blue-300">
          🆓 Available Books
        </h2>
        {availableBooks.length > 0 ? (
          <ul className="divide-y divide-gray-300">
            {availableBooks.map((book) => (
              <li
                key={book.id}
                className="flex justify-between items-center py-4"
              >
                <p className="text-lg font-medium text-gray-800">
                  {book.title}
                </p>
                <button
                  onClick={() => borrowBook(book.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold transition"
                >
                  Borrow
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No available books to borrow.</p>
        )}
      </section>

      {/* Borrowed Books Section */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 text-green-700 border-b-2 pb-2 border-green-300">
          ✅ Borrowed Books
        </h2>
        {borrowedBooks.length > 0 ? (
          <ul className="divide-y divide-gray-300">
            {borrowedBooks.map((book) => (
              <li
                key={book.id}
                className="flex justify-between items-center py-4"
              >
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    {book.title}
                  </p>
                  <p className="text-gray-500 italic">
                    Return functionality coming soon
                  </p>
                </div>
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${book.ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Open File
                </a>
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
