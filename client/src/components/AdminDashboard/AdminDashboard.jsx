import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../Dashboard/Navbar";

function AdminDashboard({ setPrivateKey }) {
  const { user } = useSelector((state) => state.auth);
  const [privateKeyInput, setPrivateKeyInput] = useState("");

  const handlePrivateKeyChange = (event) => {
    setPrivateKeyInput(event.target.value);
  };

  const handlePrivateKeySubmit = () => {
    if (privateKeyInput.trim()) {
      setPrivateKey(privateKeyInput);
      alert("Private Key set successfully.");
    } else {
      alert("Please enter a valid private key.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 p-6">
      {/* Navbar */}
      <Navbar name="Admin Dashboard" />

      <div className="flex-grow">
        {/* Account Info */}
        <div className="bg-white p-6 rounded-2xl shadow-xl max-w-xl mx-auto">
          <p className="text-gray-800 font-semibold text-lg">Account: {user}</p>
        </div>

        {/* Private Key Input */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mt-6 max-w-xl mx-auto">
          <p className="text-gray-800 font-semibold mb-4 text-lg">
            Set your Private Key:
          </p>
          <input
            type="text"
            className="border-2 border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
            placeholder="Enter your private key"
            value={privateKeyInput}
            onChange={handlePrivateKeyChange}
          />
          <button
            onClick={handlePrivateKeySubmit}
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Set Private Key
          </button>
        </div>

        {/* Instructions */}
        <div className="text-gray-600 mt-6 text-center text-sm font-medium">
          Please enter the Private Key and select an option from the sidebar to
          continue.
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
