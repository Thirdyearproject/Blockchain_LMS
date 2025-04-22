/* File: DisplayBooks.jsx */
import React, { useState, useEffect } from "react";
import "./Display.css";

const DisplayBooks = ({ contract, provider, selectedAccount }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const getBooks = async () => {
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }
    setLoading(true);
    try {
      const filter = contract.filters.BookAdded();
      const events = await contract.queryFilter(filter);

      if (events && events.length > 0) {
        const bookItems = events.map((event, i) => {
          return (
            <div key={i} className="book-item">
              <p className="book-title">{event.args.title}</p>
            </div>
          );
        });
        setBooks(bookItems);
      } else {
        setBooks([<p key="nobooks">No books found in the library.</p>]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([
        <p key="error" className="error-message">
          Error fetching book titles. Please try again.
        </p>,
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract) {
      getBooks();
    }
  }, [contract]);

  return (
    <div className="display-container">
      <div className="account-header">
        <div className="account-info">
          <p>Current Account: {selectedAccount?.account_name}</p>
        </div>
      </div>
      <div className="input-area">
        <button
          className="get-data-button"
          onClick={getBooks}
          disabled={loading || !contract}
        >
          {loading ? "Loading Books..." : "Refresh Book List"}
        </button>
      </div>
      <div className="book-list-container">{books}</div>
    </div>
  );
};

export default DisplayBooks;
