import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../Dashboard/Navbar";

function AdminDashboard({ setPrivateKey }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 p-6">
      {/* Navbar */}
      <Navbar name="Admin Dashboard" />

      <div className="flex-grow">
        {/* Account Info */}
        <div className="bg-white p-6 rounded-2xl shadow-xl max-w-xl mx-auto">
          <p className="text-gray-800 font-semibold text-lg">Account: {user}</p>
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
