import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Navbar from "../Dashboard/Navbar";
import Display from "../Display";
import Upload from "../../artifacts/contracts/Upload.sol/upload.json";
function GuestDashboard() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const loadContract = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(
          process.env.REACT_APP_RPC_URL
        );
        const contractAddress = contractAddress;
        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          provider
        );

        setProvider(provider);
        setContract(contract);
      } catch (error) {
        console.error("GuestDashboard loadContract error:", error);
      }
    };

    loadContract();
  }, []);

  return (
    <div className="flex flex-col bg-gray-100 w-full p-4">
      <Navbar name="Guest Dashboard" />

      <div className="w-full flex flex-col gap-6 mx-auto">
        {contract ? (
          <Display
            contract={contract}
            account={account} // empty string is fine for guest
            provider={provider}
            selectedAccount={{ account_name: "Guest" }}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default GuestDashboard;
