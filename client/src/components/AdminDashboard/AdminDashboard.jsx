import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../Dashboard/Navbar";

function AdminDashboard({ setPrivateKey }) {
  const { user } = useSelector((state) => state.auth);

  const handlePrivateKeyChange = (event) => {
    setPrivateKey(event.target.value);
  };
  let privateKey = "";

  const handlePrivateKeySubmit = () => {
    if (privateKey) {
      alert("Private Key set successfully.");
    } else {
      alert("Please enter a valid private key.");
    }
  };

  return (
    <div className="flex-1 p-6 w-full max-w-[1600px] mx-auto flex flex-col gap-8">
      {/* Navbar */}
      <Navbar name="Admin Dashboard" />

      {/* Account Info */}
      <div className="bg-white p-4 rounded shadow-md">
        <p className="text-gray-700 font-semibold break-words">
          Account: {user}
        </p>
      </div>

      {/* Private Key Input */}
      <div className="bg-white p-4 rounded shadow-md mt-6">
        <p className="text-gray-700 font-semibold mb-2">
          Set your Private Key:
        </p>
        <input
          type="text"
          className="border p-2 w-full rounded"
          placeholder="Enter your private key"
          value={privateKey}
          onChange={handlePrivateKeyChange}
        />
        <button
          onClick={handlePrivateKeySubmit}
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Set Private Key
        </button>
      </div>

      {/* Instructions */}
      <div className="text-gray-600 mt-6">
        Please enter the Private Key and select an option from the sidebar to
        continue.
      </div>
    </div>
  );
}

export default AdminDashboard;
