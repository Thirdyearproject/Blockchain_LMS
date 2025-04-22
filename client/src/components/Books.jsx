/* File: Books.jsx */
import React, { useState, useEffect } from "react";

const Books = ({ contract, account }) => {
  const [availableBooks, setAvailableBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contract) {
      fetchBooks();
    }
  }, [contract]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      // Fetch all books from the contract
      const filter = contract.filters.BookAdded();
      const events = await contract.queryFilter(filter);

      const books = events.map((event) => ({
        id: event.args.bookId,
        title: event.args.title,
        clearance: event.args.requiredClearance,
        isAvailable: event.args.isAvailable,
      }));

      // Separate available and borrowed books
      const available = books.filter((book) => book.isAvailable);
      const borrowed = books.filter((book) => !book.isAvailable);

      setAvailableBooks(available);
      setBorrowedBooks(borrowed);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const borrowBook = async (bookId) => {
    try {
      const transaction = await contract.borrowBook(bookId);
      await transaction.wait();
      alert("Book borrowed successfully!");
      fetchBooks(); // Refresh the book list
    } catch (error) {
      console.error("Error borrowing book:", error);
      alert("Failed to borrow book.");
    }
  };

  const returnBook = async (bookId) => {
    try {
      const transaction = await contract.returnBook(bookId);
      await transaction.wait();
      alert("Book returned successfully!");
      fetchBooks(); // Refresh the book list
    } catch (error) {
      console.error("Error returning book:", error);
      alert("Failed to return book.");
    }
  };

  return (
    <div>
      <h2>Available Books</h2>
      {loading ? (
        <p>Loading books...</p>
      ) : (
        <div>
          {availableBooks.length > 0 ? (
            availableBooks.map((book) => (
              <div key={book.id} style={styles.bookItem}>
                <p>{book.title}</p>
                <button
                  onClick={() => borrowBook(book.id)}
                  style={styles.button}
                >
                  Borrow
                </button>
              </div>
            ))
          ) : (
            <p>No available books.</p>
          )}
        </div>
      )}

      <h2>Borrowed Books</h2>
      {loading ? (
        <p>Loading books...</p>
      ) : (
        <div>
          {borrowedBooks.length > 0 ? (
            borrowedBooks.map((book) => (
              <div key={book.id} style={styles.bookItem}>
                <p>{book.title}</p>
                <button
                  onClick={() => returnBook(book.id)}
                  style={styles.button}
                >
                  Return
                </button>
              </div>
            ))
          ) : (
            <p>No borrowed books.</p>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  bookItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #ccc",
  },
  button: {
    padding: "5px 10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Books;
