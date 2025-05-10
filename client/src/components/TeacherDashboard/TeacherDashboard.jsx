import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../Dashboard/Navbar";

function TeacherDashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex-1 p-6 w-full max-w-[1600px] mx-auto flex flex-col gap-8">
      {/* Navbar */}
      <Navbar name="Teacher Dashboard" />

      {/* Account Info */}
      <div className="bg-white p-4 rounded shadow-md">
        <p className="text-gray-700 font-semibold break-words">
          Account: {user}
        </p>
      </div>

      {/* Instructions */}
      <div className="text-gray-600">
        Please select an option from the sidebar to continue.
      </div>
    </div>
  );
}

export default TeacherDashboard;
