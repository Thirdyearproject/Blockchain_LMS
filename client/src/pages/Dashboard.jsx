import React, { useEffect, useState } from "react";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import { Outlet } from "react-router-dom";
import { sidebarLinks } from "../data/dashboardLinks";
import SidebarLink from "../components/Dashboard/SidebarLink";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="relative h-fit">
      <div
        className={`${
          isOpen ? "w-[200px]" : "w-[70px]"
        } h-[100vh] fixed top-0 left-0  z-20 flex flex-col ${
          isOpen ? "" : "items-center"
        } bg-white transition-all duration-300 ease-out`}
      >
        <div className="flex flex-col gap-4 mt-16">
          {sidebarLinks.map((link, index) => (
            <SidebarLink
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              link={link}
              key={index}
            />
          ))}
        </div>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`flex cursor-pointer items-center justify-center text-[#1ea9f2] absolute bottom-10 ${
            isOpen ? "right-[-9%]" : "right-[-22%]"
          } bg-[#dceafd] p-2 rounded-full`}
        >
          {isOpen ? <MdArrowBackIos className="pl-1" /> : <MdArrowForwardIos />}
        </div>
      </div>
      <div className={`h-full flex transition-all duration-300 ml-[70px]`}>
        {dashboardData && <Outlet context={dashboardData} />}
      </div>
    </div>
  );
}

export default Dashboard;
