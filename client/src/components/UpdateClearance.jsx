import React, { useState } from "react";
import { ethers } from "ethers";
import UserManagerABI from "../build/contracts/UserManager.json";
import { RPC_URL } from "../services/apis";
import { useSelector, useDispatch } from "react-redux";

function UpdateClearance({ privateKey }) {
  const dispatch = useDispatch();
  const signupData = useSelector((state) => state.auth.signupData);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 px-4 py-10">
      <div className="p-8 max-w-md w-full bg-white rounded-3xl shadow-2xl hover:shadow-indigo-300 transition-shadow duration-300">
        <h3 className="text-4xl font-extrabold text-center text-indigo-600 mb-8">
          Update Clearance
        </h3>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="userAddress"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              User Address
            </label>
            <input
              id="userAddress"
              type="text"
              placeholder="Enter wallet address (0x...)"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label
              htmlFor="clearanceLevel"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              New Clearance Level
            </label>
            <input
              id="clearanceLevel"
              type="number"
              min="0"
              max="4"
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <button
            onClick={updateClearance}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Update
          </button>

          {message && (
            <div
              className={`text-center mt-6 text-md font-semibold ${
                message.includes("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateClearance;
