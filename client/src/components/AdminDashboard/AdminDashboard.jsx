import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import Navbar from "../Dashboard/Navbar";
import BookUpload from "../BookUpload";
import Books from "../Books";
import RegisterUser from "../RegisterUser";
import UpdateClearance from "../UpdateClearance";
import VoteOnBooks from "../VoteOnBooks";

function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);

  const [privateKey, setPrivateKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getPrivateKey = async () => {
      const inputKey = prompt("Please enter your private key:");
      if (!inputKey) {
        setErrorMessage("Private key is required.");
        return;
      }
      try {
        setPrivateKey(inputKey);
      } catch (error) {
        console.error("Invalid private key:", error);
        setErrorMessage("Invalid private key entered.");
      }
    };

    getPrivateKey();
  }, []);

  const renderErrorMessage = () => {
    if (errorMessage) {
      return (
        <div className="error-banner bg-red-200 p-2 rounded mt-2">
          {errorMessage}
          <button
            onClick={() => setErrorMessage("")}
            className="ml-2 text-red-600 font-bold"
          >
            ✕
          </button>
        </div>
      );
    }
    return null;
  };

  const renderDashboardContent = () => {
    if (!privateKey) return null; // don't show dashboard if key not set
    return (
      <div>
        <BookUpload account={user} privateKey={privateKey} />
        <hr className="black-line" />
        <Books account={user} privateKey={privateKey} />
        <hr className="black-line" />
        <RegisterUser account={user} privateKey={privateKey} />
        <UpdateClearance account={user} privateKey={privateKey} />
        <hr className="black-line" />
        <VoteOnBooks account={user} privateKey={privateKey} />
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-gray-100 w-full p-4">
      <div className="w-full">
        <Navbar name="My Dashboard" />
      </div>

      {renderErrorMessage()}

      <div className="w-full flex lg:flex-nowrap flex-wrap gap-6 mx-auto h-fit">
        <div className="header">
          <p style={{ color: "black" }}>Account: {user}</p>
          <hr className="black-line" />
        </div>

        {renderDashboardContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;
