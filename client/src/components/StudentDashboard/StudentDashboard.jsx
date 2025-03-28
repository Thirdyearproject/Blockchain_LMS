import React, { useEffect } from "react";
import Navbar from "../Dashboard/Navbar";

function StudentDashboard() {
  return (
    <div className="flex flex-col bg-gray-100 w-full p-4">
      <div className="w-full">
        <Navbar name="My Dashboard" />
      </div>
      <div className="w-full flex lg:flex-nowrap flex-wrap gap-6 mx-auto h-fit"></div>
    </div>
  );
}

export default StudentDashboard;
