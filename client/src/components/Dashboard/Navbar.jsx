import React, { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaRegBell } from "react-icons/fa6";
import { RiArrowDropDownLine } from "react-icons/ri";
import { BsSearch } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { resetSignupData, setSignup, setSignupData, setToken, setUser } from "../../redux/Slices/authSlice";
import { FaFlag } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Navbar = ({ name }) => {
  const options = ["Courses","Projects", "Skills", "Certifications", "Jobs", "Task"];
  const [selectedOption, setSelectedOption] = useState("Courses");
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handlelogout() {
    window.location.href = 'http://localhost:5678/auth/logout';
    localStorage.removeItem("lmstoken");
    localStorage.removeItem("lmsuser");
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetSignupData(null));
    dispatch(setSignup(false));
    navigate("/");
  }

  return (
    <div className="flex justify-between  bg-gray-100 mb-8">
      <div className="md:text-2xl text-xl lg:text-3xl font-bold pl-10 text-black">
        {name}
      </div>
      <div className="justify-between w-[40%] md:flex hidden rounded-full shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
        <div className="flex p-2 items-center group relative cursor-pointer">
          <p className="font-semibold ml-2">{selectedOption}</p>
          <RiArrowDropDownLine size={20} />
          {/* floating div showing options */}
          <div className="absolute z-10 hidden group-hover:block top-12 bg-white shadow-lg p-2 w-[110px] cursor-pointer text-[#f3f4f6]  rounded-md group-hover:transition-all group-hover:ease-in-out group-hover:duration-200">
            {options.map((item, index) => (
              <p
                onClick={() => setSelectedOption(item)}
                key={index}
                className={`${
                  selectedOption === item
                    ? "text-blue-400 font-semibold"
                    : "text-black"
                }`}
              >
                {item}
              </p>
            ))}
          </div>
        </div>
        <input
          type="text"
          className="outline-0 w-full bg-transparent rounded-full  px-4"
        />
        <button className="w-[50px] h-[40px] m-1 rounded-full bg-[#22a8f1] text-white flex items-center justify-center">
          <BsSearch />
        </button>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex gap-4 items-center">
          <div className=" flex items-center justify-center cursor-pointer">
            <FaFlag size={25} />
            <IoMdArrowDropdown size={25} className="cursor-pointer" />
          </div>
          <div className="border-r-[2px] border-gray-400 h-[30px]"></div>
          <FaRegBell size={20} className="text-gray-600 cursor-pointer" />
        </div>
        <div className="flex items-center gap-2 group relative">
          <div className="h-[30px] w-[30px] overflow-hidden rounded-full cursor-pointer">
            <img
              src="https://img.freepik.com/free-photo/bohemian-man-with-his-arms-crossed_1368-3542.jpg?w=740&t=st=1720848490~exp=1720849090~hmac=12984ae6f7e558c7f5c5769acbdbb908c2c2c4eb7297bf82c2d1688cf276bdbf"
              className="w-full h-full object-cover "
            />
          </div>
          <div className="capitalize font-semibold flex cursor-pointer">
            Hi, {user?.firstName}
            <RiArrowDropDownLine size={25} />
          </div>
          <div
            className="invisible absolute left-[50%]
                      translate-x-[-55%] translate-y-[45%]
                   top-[50%]
                  flex flex-col rounded-lg bg-black text-white p-4 text-richblack-5
                  opacity-0 transition-all duration-200 group-hover:visible
                  group-hover:opacity-100 lg:w-[150px] w-[180px] z-20"
          >
            <div
              className="absolute left-[30%] top-0
                  translate-x-[80%]
                  translate-y-[-15%] h-6 w-6 rotate-45 rounded bg-black z-20"
            ></div>
            <button
              onClick={handlelogout}
              className="text-sm font-semibold hover:text-blue-300 transition-all duration-200 ease-out"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
