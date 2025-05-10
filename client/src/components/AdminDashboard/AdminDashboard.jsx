import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../Dashboard/Navbar";
import BookUpload from "../BookUpload";
import Books from "../Books";
import RegisterUser from "../RegisterUser";
import UpdateClearance from "../UpdateClearance";
import VoteOnBooks from "../VoteOnBooks";

function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);

  const [privateKey, setPrivateKey] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePrivateKeySubmit = (e) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setErrorMessage("Private key is required.");
      return;
    }
    try {
      setPrivateKey(inputKey.trim());
      setErrorMessage("");
    } catch (error) {
      console.error("Invalid private key:", error);
      setErrorMessage("Invalid private key entered.");
    }
  };

  const renderErrorMessage = () => {
    if (errorMessage) {
      return (
        <div className="bg-red-200 text-red-800 p-3 rounded-md flex justify-between items-center">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage("")}
            className="font-bold text-xl ml-4"
          >
            ✕
          </button>
        </div>
      );
    }
    return null;
  };

  const renderPrivateKeyInput = () => {
    if (privateKey) return null;
    return (
      <form
        onSubmit={handlePrivateKeySubmit}
        className="bg-white p-6 rounded-md shadow-md w-full max-w-md mx-auto flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-center">
          Enter Private Key
        </h2>
        <input
          type="password"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          placeholder="Your Private Key"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
    );
  };

  const renderDashboardContent = () => {
    if (!privateKey) return null;
    return (
      <div className="flex flex-col gap-10">
        <BookUpload account={user} privateKey={privateKey} />
        <hr className="border-gray-300" />
        <Books account={user} privateKey={privateKey} />
        <hr className="border-gray-300" />
        <RegisterUser account={user} privateKey={privateKey} />
        <UpdateClearance account={user} privateKey={privateKey} />
        <hr className="border-gray-300" />
        <VoteOnBooks account={user} privateKey={privateKey} />
      </div>
    );
  };

  return (
    <div className="flex-1 p-6 w-full max-w-[1600px] mx-auto flex flex-col gap-8">
      {/* Navbar */}
      <Navbar name="Admin Dashboard" />

      {/* Content */}
      <div className="flex-1 p-6 w-full max-w-7xl mx-auto flex flex-col gap-8">
        {/* Error Message */}
        {renderErrorMessage()}

        {/* Account Info */}
        <div className="bg-white p-4 rounded shadow-md">
          <p className="text-gray-700 font-semibold break-words">
            Account: {user}
          </p>
        </div>

        {/* Private Key Form */}
        {renderPrivateKeyInput()}

        {/* Main Dashboard Content */}
        {renderDashboardContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;
