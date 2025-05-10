import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSignup } from "../redux/Slices/authSlice";
import { ethers } from "ethers";
import UserManagerABI from "../build/contracts/UserManager.json";
import { RPC_URL, UserAddress } from "../services/apis";

export default function RegisterUser({ privateKey }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterAll = async () => {
    setIsLoading(true);
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(privateKey, provider);

      const contract = new ethers.Contract(
        UserAddress,
        UserManagerABI.abi,
        wallet
      );

      const addresses = await provider.listAccounts();
      let registeredAccounts = [];

      let currentNonce = await provider.getTransactionCount(wallet.address);

      for (let i = 0; i < addresses.length; i++) {
        const userAddr = addresses[i];
        let clearanceLevel;

        if (i === 0) {
          clearanceLevel = 4; // Admin
        } else if (i === 1 || i === 2 || i === 3) {
          clearanceLevel = 3; // Teacher
        } else if (i === 8 || i === 9) {
          clearanceLevel = 1; // Guest
        } else {
          clearanceLevel = 2; // Student
        }

        const tx = await contract.setClearance(userAddr, clearanceLevel, {
          nonce: currentNonce,
        });
        currentNonce += 1;
        await tx.wait();

        const clear = await contract.getClearance(userAddr);
        console.log(
          `✅ ${userAddr} registered with Clearance Level ${clear.toString()}`
        );
      }

      dispatch(setSignup(true));
      localStorage.setItem(
        "registeredAccounts",
        JSON.stringify(registeredAccounts)
      );

      alert("🎉 Accounts registered successfully!");
    } catch (error) {
      console.error("❌ Error registering accounts:", error);
      alert("Error—see console for details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">
          Register Accounts
        </h1>
        <p className="text-gray-600 mb-8">
          Click the button below to register all user accounts on the
          blockchain.
        </p>

        <button
          onClick={handleRegisterAll}
          disabled={isLoading}
          className="w-full py-3 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Registering…" : "Register All Accounts"}
        </button>

        {isLoading && (
          <div className="flex items-center justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}
