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
    <div className="relative h-fit">
      <div
        className={`${
          isOpen ? "w-[200px]" : "w-[70px]"
        } h-[100vh] fixed top-0 left-0 z-20 flex flex-col ${
          isOpen ? "" : "items-center"
        } bg-white transition-all duration-300 ease-out`}
      >
        {/* Sidebar Links */}
        <div className="flex flex-col gap-4 mt-16">
          {getSidebarLinks().map((link, index) => (
            <SidebarLink
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              link={link}
              key={index}
            />
          ))}
        </div>

        {/* Sidebar Toggle Button */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`flex cursor-pointer items-center justify-center text-[#1ea9f2] absolute bottom-10 ${
            isOpen ? "right-[-9%]" : "right-[-22%]"
          } bg-[#dceafd] p-2 rounded-full`}
        >
          {isOpen ? <MdArrowBackIos className="pl-1" /> : <MdArrowForwardIos />}
        </div>
      </div>

      {/* Main Outlet */}
      <div className="h-full flex transition-all duration-300 ml-[70px]">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
