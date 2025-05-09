import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch } from "react-redux";
import {
  setSignup,
  resetSignupData,
  setRegisteredAccounts,
} from "../redux/Slices/authSlice";

import { ethers } from "ethers";
import UserManagerABI from "../build/contracts/UserManager.json";
import { RPC_URL } from "../services/apis";

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterAll = async () => {
    setIsLoading(true);
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);

      const adminSigner = await provider.getSigner(0);
      console.log(UserManagerABI.networks);
      const networkId = Object.keys(UserManagerABI.networks)[0];

      const networkData = UserManagerABI.networks[networkId];
      if (!networkData || !networkData.address) {
        console.error(`Contract not deployed on network ${networkId}`);
        return;
      }

      const contract = new ethers.Contract(
        networkData.address,
        UserManagerABI.abi,
        adminSigner
      );

      const addresses = await provider.listAccounts();

      let registeredAccounts = [];

      for (let i = 0; i < addresses.length; i++) {
        const userAddr = addresses[i];
        let clearanceLevel;

        if (i === 0) {
          clearanceLevel = 3; // Admin Level
        } else if (i === 1 || i === 2 || i === 3) {
          clearanceLevel = 2; // Teacher Level
        } else if (i === 8 || i === 9) {
          clearanceLevel = 0; //guest Level
        } else {
          clearanceLevel = 1; // Student Level
        }

        const tx = await contract.setClearance(userAddr, clearanceLevel);
        await tx.wait();

        console.log(
          `✅ ${userAddr} registered with Clearance Level ${
            clearanceLevel === 3
              ? "Level3"
              : clearanceLevel === 2
              ? "Level2"
              : "Level1"
          }`
        );

        registeredAccounts.push({
          userAddr,
          clearanceLevel,
        });
      }

      dispatch(setSignup(true));
      dispatch(setRegisteredAccounts(registeredAccounts));
      localStorage.setItem(
        "registeredAccounts",
        JSON.stringify(registeredAccounts)
      );

      alert("🎉 Accounts registered successfully!");
    } catch (err) {
      console.error("❌ Error registering accounts:", err);
      alert("Error—see console for details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex bg-[#f9fafa] min-h-screen">
      <div className="w-full flex flex-col items-center justify-center">
        <div className="md:w-[60%] w-full p-4">
          <div
            onClick={() => {
              navigate("/");
              dispatch(setSignup(false));
              dispatch(resetSignupData(null));
            }}
            className="flex cursor-pointer font-semibold text-blue-400 items-center gap-1 mb-4"
          >
            <IoIosArrowBack /> Back to Login
          </div>

          <h1 className="font-bold text-4xl ml-2 mb-6">Signup</h1>

          <button
            onClick={handleRegisterAll}
            disabled={isLoading}
            className="mt-6 px-5 py-3 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            {isLoading ? "Registering…" : "Register All Accounts"}
          </button>

          {isLoading && <div className="loading-spinner mt-3">Loading…</div>}
        </div>
      </div>
    </div>
  );
}
