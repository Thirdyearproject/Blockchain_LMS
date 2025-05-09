import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../Dashboard/Navbar";
import BookUpload from "../BookUpload";
import Books from "../Books";
import { Wallet } from "ethers";
import VoteOnBooks from "../VoteOnBooks";

function TeacherDashboard() {
  const { user } = useSelector((state) => state.auth);

  const [errorMessage, setErrorMessage] = useState("");
  const [privateKey, setPrivateKey] = useState(null);

  const renderErrorMessage = () =>
    errorMessage && (
      <div className="error-banner">
        {errorMessage}
        <button onClick={() => setErrorMessage("")}>✕</button>
      </div>
    );

  const renderDashboardContent = () => {
    return (
      <div>
        <hr className="black-line" />
        <BookUpload account={user} privateKey={privateKey} />
        <hr className="black-line" />
        <Books account={user} privateKey={privateKey} />
        <hr className="black-line" />
        <VoteOnBooks account={user} privateKey={privateKey} />
      </div>
    );
  };

  const initializeWalletConnection = async () => {
    try {
      const inputPrivateKey = prompt("Please enter your private key:");
      if (!inputPrivateKey) {
        setErrorMessage("Private key is required.");
        return;
      }

      // Validate the private key before setting it
      try {
        new Wallet(inputPrivateKey); // If invalid, this will throw
        setPrivateKey(inputPrivateKey); // If valid, set it
      } catch (walletError) {
        setErrorMessage("Invalid private key. Please try again.");
        console.error("Invalid private key:", walletError);
      }
    } catch (error) {
      setErrorMessage("Failed to initialize wallet connection.");
      console.error("Error initializing wallet:", error);
    }
  };

  useEffect(() => {
    initializeWalletConnection();
  }, [user]);

  return (
    <div className="flex flex-col bg-gray-100 w-full p-4">
      <div className="w-full">
        <Navbar name="My Dashboard" />
      </div>

      {renderErrorMessage()}

      <div className="w-full flex lg:flex-nowrap flex-wrap gap-6 mx-auto h-fit">
        <div className="header">
          {user && <p style={{ color: "black" }}>Account: {user}</p>}
          <hr className="black-line" />
        </div>

        {privateKey && renderDashboardContent()}
      </div>
    </div>
  );
}

export default TeacherDashboard;
