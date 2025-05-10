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
    <div className="p-4">
      <h3 className="text-2xl font-semibold mb-4">Update Clearance Level</h3>

      <input
        type="text"
        placeholder="User Address"
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
        className="border p-2 mb-2 w-full"
      />

      <input
        type="number"
        min="0"
        max="3"
        value={newLevel}
        onChange={(e) => setNewLevel(e.target.value)}
        className="border p-2 mb-2 w-full"
      />

      <button
        onClick={updateClearance}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Update
      </button>

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}

export default UpdateClearance;
