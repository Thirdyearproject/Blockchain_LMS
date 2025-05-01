import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../Dashboard/Navbar";
import BookUpload from "../BookUpload";
import Books from "../Books";
import { initializeWallet } from "../../services/Functions/initializeWallet";

function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);

  const renderErrorMessage = () =>
    errorMessage && (
      <div className="error-banner">
        {errorMessage}
        <button onClick={() => setErrorMessage("")}>✕</button>
      </div>
    );

  const borrowBook = async (bookId) => {
    try {
      if (!contract) throw new Error("Contract is not loaded");

      const transaction = await contract.borrowBook(bookId);
      await transaction.wait();
      alert("Book borrowed successfully!");
    } catch (error) {
      console.error("Error borrowing book:", error);
      alert("Failed to borrow book.");
    }
  };

  const returnBook = async (bookId) => {
    try {
      if (!contract) throw new Error("Contract is not loaded");

      const transaction = await contract.returnBook(bookId);
      await transaction.wait();
      alert("Book returned successfully!");
    } catch (error) {
      console.error("Error returning book:", error);
      alert("Failed to return book.");
    }
  };

  const renderDashboardContent = () => {
    if (selectedAccount && account && contract) {
      return (
        <div>
          <BookUpload
            account={account}
            provider={provider}
            contract={contract}
            privateKey={privateKey}
          />
          <hr className="black-line" />
          <Books
            contract={contract}
            account={account}
            borrowBook={borrowBook}
            returnBook={returnBook}
          />
        </div>
      );
    }
    return <div>Please connect your wallet to access the dashboard.</div>;
  };

  const initializeWalletConnection = async () => {
    try {
      const inputPrivateKey = prompt("Please enter your private key:");
      if (!inputPrivateKey) {
        setErrorMessage("Private key is required.");
        return;
      }
      setPrivateKey(inputPrivateKey);

      const { contract, address, provider } = await initializeWallet(
        inputPrivateKey
      );

      setSelectedAccount(address);
      setProvider(provider);
      setContract(contract);
      setAccount(address);
    } catch (error) {
      setErrorMessage("Failed to initialize wallet connection.");
      console.error("Error initializing wallet:", error);
    }
  };

  useEffect(() => {
    if (user?.clearanceLevel === 0) {
      initializeWalletConnection();
    }
  }, [user]);

  return (
    <div className="flex flex-col bg-gray-100 w-full p-4">
      <div className="w-full">
        <Navbar name="My Dashboard" />
      </div>

      {renderErrorMessage()}

      <div className="bg rounded-lg shadow-md p-4 max-w-full max-w-lg mx-0 mb-6">
        {account && (
          <p className="text-gray-800 font-semibold text-base text-left">
            <span className="text-gray-500 font-normal mr-2">Account:</span>
            {account}
          </p>
        )}
        <hr className="mt-3 border-t border-gray-300" />
      </div>

      {renderDashboardContent()}
    </div>
  );
}

export default StudentDashboard;
