import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setSignup } from "../redux/Slices/authSlice";

import { ethers } from "ethers";
import UserManagerABI from "../build/contracts/UserManager.json";
import { RPC_URL } from "../services/apis";

export default function RegisterUser({ privateKey }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterAll = async () => {
    setIsLoading(true);
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(privateKey, provider);

      const lastIndex = Object.keys(UserManagerABI.networks).length - 1;
      const lastNetworkId = Object.keys(UserManagerABI.networks)[lastIndex];
      const networkData = UserManagerABI.networks[lastNetworkId];

      if (!networkData || !networkData.address) {
        console.error(`Contract not deployed on network ${lastNetworkId}`);
        alert(`Contract not deployed on network ${lastNetworkId}`);
        setIsLoading(false);
        return;
      }

      const contract = new ethers.Contract(
        networkData.address,
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
        currentNonce += 1; // Manually increment nonce
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
    <div className="flex bg-[#f9fafa] min-h-screen">
      <div className="w-full flex flex-col items-center justify-center">
        <div className="md:w-[60%] w-full p-4">
          <button
            onClick={handleRegisterAll}
            disabled={isLoading}
            className="mt-6 px-5 py-3 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            {isLoading ? "Registering…" : "Register All Accounts"}
          </button>

          {isLoading && <div className="mt-3 text-gray-600">Loading…</div>}
        </div>
      </div>
    </div>
  );
}
