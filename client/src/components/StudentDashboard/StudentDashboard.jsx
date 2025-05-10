import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../Dashboard/Navbar";

function StudentDashboard({ setPrivateKey }) {
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
    <div className="flex-1 p-8 w-full max-w-screen-xl mx-auto flex flex-col gap-10">
      {/* Navbar */}
      <Navbar name="Student Dashboard" />

      {/* Account Info */}
      <div className="bg-white p-6 rounded-xl shadow-xl">
        <p className="text-gray-800 font-semibold text-lg">Account: {user}</p>
      </div>

      {/* Private Key Input */}
      <div className="bg-white p-6 rounded-xl shadow-xl mt-8">
        <p className="text-gray-800 font-semibold mb-4 text-lg">
          Set your Private Key:
        </p>
        <input
          type="text"
          className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Enter your private key"
          value={privateKeyInput}
          onChange={handlePrivateKeyChange}
        />
        <button
          onClick={handlePrivateKeySubmit}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Set Private Key
        </button>
      </div>

      {/* Instructions */}
      <div className="text-gray-600 mt-8 text-sm text-center">
        Please enter the Private Key and select an option from the sidebar to
        continue.
      </div>
    </div>
  );
}

export default StudentDashboard;
