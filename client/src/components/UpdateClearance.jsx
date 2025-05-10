import React, { useState } from "react";
import { ethers } from "ethers";
import UserManagerABI from "../build/contracts/UserManager.json";
import { RPC_URL } from "../services/apis";
import { useSelector, useDispatch } from "react-redux";
import { setRegisteredAccounts } from "../redux/Slices/authSlice";

function UpdateClearance({ privateKey }) {
  const dispatch = useDispatch();
  const signupData = useSelector((state) => state.auth.signupData); // Get signup data from Redux
  const [userAddress, setUserAddress] = useState("");
  const [newLevel, setNewLevel] = useState(1);
  const [message, setMessage] = useState("");

  const updateClearance = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(privateKey, provider);

      const lastIndex = Object.keys(UserManagerABI.networks).length - 1;
      const lastNetworkId = Object.keys(UserManagerABI.networks)[lastIndex];
      const networkData = UserManagerABI.networks[lastNetworkId];

      if (!networkData || !networkData.address) {
        setMessage(`Contract not deployed on network ${lastNetworkId}`);
        return;
      }

      const contract = new ethers.Contract(
        networkData.address,
        UserManagerABI.abi,
        wallet
      );

      const tx = await contract.setClearance(userAddress, Number(newLevel));
      await tx.wait();

      const clear = await contract.getClearance(userAddress);

      console.log(`✅ ${userAddress} updated with Clearance Level ${clear}`);

      setMessage("✅ Clearance level updated successfully!");
    } catch (error) {
      console.error(error);
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-lg shadow-xl">
      <h3 className="text-4xl font-semibold mb-6 text-center text-blue-600">
        Update Clearance Level
      </h3>

      <div className="mb-4">
        <label
          htmlFor="userAddress"
          className="block text-gray-700 text-sm font-medium mb-2"
        >
          User Address
        </label>
        <input
          id="userAddress"
          type="text"
          placeholder="0x..."
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          className="border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="clearanceLevel"
          className="block text-gray-700 text-sm font-medium mb-2"
        >
          New Clearance Level
        </label>
        <input
          id="clearanceLevel"
          type="number"
          min="0"
          max="3"
          value={newLevel}
          onChange={(e) => setNewLevel(e.target.value)}
          className="border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={updateClearance}
        className="bg-blue-600 text-white px-8 py-4 w-full rounded-lg transition duration-300 hover:bg-blue-700 focus:outline-none"
      >
        Update
      </button>

      {message && (
        <p
          className={`mt-4 text-center text-lg ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default UpdateClearance;
