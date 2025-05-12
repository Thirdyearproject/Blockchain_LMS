import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../Dashboard/Navbar";

function TeacherDashboard({ setPrivateKey }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex-1 p-6 w-full max-w-screen-xl mx-auto flex flex-col gap-8">
      {/* Navbar */}
      <Navbar name="Teacher Dashboard" />

      {/* Account Info */}
      <div className="bg-white p-6 rounded-xl shadow-xl">
        <p className="text-gray-800 font-semibold text-lg">Account: {user}</p>
      </div>

      {/* Instructions */}
      <div className="text-gray-600 mt-6 text-sm text-center">
        Please select an option from the sidebar to continue.
      </div>
    </div>
  );
}

export default TeacherDashboard;
