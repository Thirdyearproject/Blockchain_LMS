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

  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     try {
  //       setLoading(true);
  //       const token = localStorage.getItem("lmstoken");
  //       if (!token) {
  //         throw new Error("No token found");
  //       }

  //       const response = await fetch(
  //         `${process.env.VITE_APP_BASE_URL}/api/v1/user/dashboard`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${JSON.parse(token)}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       if (!response.ok) {
  //         if (response.status === 401) {
  //           // Token not provided
  //           localStorage.removeItem("lmstoken");
  //           localStorage.removeItem("lmsuser");
  //           navigate("/");
  //           return;
  //         }
  //         if (response.status === 403) {
  //           // Token  is expired
  //           localStorage.removeItem("lmstoken");
  //           localStorage.removeItem("lmsuser");
  //           navigate("/");
  //           return;
  //         }
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const contentType = response.headers.get("content-type");
  //       if (!contentType || !contentType.includes("application/json")) {
  //         throw new TypeError("Oops, we haven't got JSON!");
  //       }

  //       const data = await response.json();
  //       setDashboardData(data);
  //     } catch (err) {
  //       console.error("Fetch error:", err);
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDashboardData();
  // }, [navigate]);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

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
