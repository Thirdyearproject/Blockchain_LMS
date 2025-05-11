import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSignup } from "../redux/Slices/authSlice";
import { ethers } from "ethers";
import UserManagerABI from "../build/contracts/UserManager.json";
import { RPC_URL, UserAddress } from "../services/apis";

export default function RegisterUser() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to determine clearance level
  const getClearanceLevel = (index) => {
    if (index === 0) return 4; // Admin
    if ([1, 2, 3].includes(index)) return 3; // Teacher
    if ([8, 9].includes(index)) return 1; // Guest
    return 2; // Student
  };

  const handleRegisterAll = async () => {
    setIsLoading(true);
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      // Connect to MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        UserAddress,
        UserManagerABI.abi,
        signer
      );

      let registeredAccounts = []; // Store registered accounts
      let currentNonce = await provider.getTransactionCount(
        await signer.getAddress()
      );

      for (let i = 0; i < accounts.length; i++) {
        const userAddr = accounts[i];
        const clearanceLevel = getClearanceLevel(i);

        try {
          const tx = await contract.setClearance(userAddr, clearanceLevel, {
            nonce: currentNonce,
          });
          currentNonce += 1;
          await tx.wait(); // Wait for transaction confirmation

          const clear = await contract.getClearance(userAddr);
          console.log(
            `✅ ${userAddr} registered with Clearance Level ${clear.toString()}`
          );

          registeredAccounts.push(userAddr); // Add registered address to the list
        } catch (txError) {
          console.error(`❌ Error registering ${userAddr}:`, txError);
        }
      }

      dispatch(setSignup(true));

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
