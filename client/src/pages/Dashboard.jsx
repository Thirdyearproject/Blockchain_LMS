import React, { useState } from "react";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  adminSidebarLinks,
  studentSidebarLinks,
  teacherSidebarLinks,
  guestSidebarLinks,
} from "../data/dashboardLinks";
import SidebarLink from "../components/Dashboard/SidebarLink";

function Dashboard() {
  const { type } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  // Choose sidebar links based on user type
  const getSidebarLinks = () => {
    switch (type) {
      case 4:
        return adminSidebarLinks;
      case 3:
        return teacherSidebarLinks;
      case 2:
        return studentSidebarLinks;
      case 1:
        return guestSidebarLinks;
      default:
        return [];
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-60" : "w-20"
        } h-full fixed top-0 left-0 z-20 flex flex-col bg-white shadow-md transition-all duration-300`}
      >
        <div className="flex flex-col gap-6 mt-20">
          {getSidebarLinks().map((link, index) => (
            <SidebarLink
              key={index}
              link={link}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          ))}
        </div>

        {/* Toggle button */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center cursor-pointer text-blue-500 absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-100 p-2 rounded-full shadow-md"
        >
          {isOpen ? <MdArrowBackIos className="pl-1" /> : <MdArrowForwardIos />}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 ml-20 transition-all duration-300 ${
          isOpen ? "ml-60" : "ml-20"
        } p-6`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
