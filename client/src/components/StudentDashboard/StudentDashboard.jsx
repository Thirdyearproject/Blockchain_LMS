import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../Dashboard/Navbar";
import Books from "../Books";

function StudentDashboard() {
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
    if (!privateKey) {
      return (
        <p className="text-red-500 font-semibold">
          Please provide your private key to continue.
        </p>
      );
    }

    return (
      <div>
        <Books account={user} privateKey={privateKey} />
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
      setPrivateKey(inputPrivateKey);
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

      <div className="bg rounded-lg shadow-md p-4 max-w-full max-w-lg mx-0 mb-6">
        {user && (
          <p className="text-gray-800 font-semibold text-base text-left">
            <span className="text-gray-500 font-normal mr-2">Account:</span>
            {user}
          </p>
        )}
        <hr className="mt-3 border-t border-gray-300" />
      </div>

      {renderDashboardContent()}
    </div>
  );
}

export default StudentDashboard;
