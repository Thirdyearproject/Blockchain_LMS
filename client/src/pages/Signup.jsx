import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  setSignup,
  resetSignupData,
  setRegisteredAccounts,
} from "../redux/Slices/authSlice";

import { ethers } from "ethers";
import ELibraryAccessABI from "../artifacts/contracts/ELibraryAccess.sol/ELibraryAccess.json";
import { CONTRACT_ADDRESS } from "../services/apis";

// Hardhat’s default mnemonic
const HARDHAT_MNEMONIC =
  "test test test test test test test test test test test junk";

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterAll = async () => {
    setIsLoading(true);
    try {
      // Connect to local Hardhat node
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");

      // Derive the admin wallet
      const adminWallet = ethers.Wallet.fromPhrase(
        HARDHAT_MNEMONIC,
        `m/44'/60'/0'/0/0`
      ).connect(provider);

      // Instantiate contract
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ELibraryAccessABI.abi,
        adminWallet
      );

      const accounts = await provider.listAccounts();
      if (accounts.length < 5) {
        console.warn(
          "⚠️ Need at least 5 accounts: admin + teacher + 2 students"
        );
        setIsLoading(false);
        return;
      }

      let registeredAccounts = [];
      let nonce = await provider.getTransactionCount(adminWallet.address); // Get the current nonce of the admin wallet

      console.group("📝 registerUser()");
      for (let i = 1; i <= 4; i++) {
        const userSigner = accounts[i];
        const userAddr = await userSigner.getAddress();
        let clearanceLevel;

        if (i === 1) {
          clearanceLevel = 2; // Admin
        } else if (i === 2) {
          clearanceLevel = 1; // Teacher
        } else {
          clearanceLevel = 0; // Students
        }

        const tx = await contract.registerUser(userAddr, clearanceLevel, {
          nonce: nonce++, // Use the current nonce and increment it for the next transaction
        });
        await tx.wait();
        console.log(
          ` [${i}] ${userAddr} registered (level=${
            clearanceLevel === 2
              ? "Admin"
              : clearanceLevel === 1
              ? "Teacher"
              : "Student"
          })`
        );

        registeredAccounts.push({
          address: userAddr,
          clearanceLevel,
        });
      }
      console.groupEnd();

      // Save to Redux and LocalStorage
      dispatch(setSignup(true));
      dispatch(setRegisteredAccounts(registeredAccounts));
      localStorage.setItem(
        "registeredAccounts",
        JSON.stringify(registeredAccounts)
      );

      alert("🎉 Admin, Teacher, and Students registered successfully!");
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
          {/* Back to Login */}
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
