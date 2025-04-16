import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ethers } from "ethers";
import Navbar from "../Dashboard/Navbar";
import FileUpload from "../FileUpload";
import Display from "../Display";
import { setUser } from "../../redux/Slices/authSlice";
import { WalletLogin } from "../../services/operations/authApi";
import Upload from "../../artifacts/contracts/Upload.sol/upload.json";
import { toast } from "react-toastify";

function StudentDashboard() {
  const { user, type } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Parse accounts from user data
  const accounts = user && user.length > 0 ? user : [];

  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Function to initialize wallet with private key
  const initializeWallet = async (privateKey) => {
    const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; //ELibrary deployed address
    const contract = new ethers.Contract(contractAddress, Upload.abi, wallet);
    const address = await wallet.getAddress();
    return { contract, address };
  };

  // Handle account selection from Redux store
  const handleAccountSelect = async (acc) => {
    try {
      setErrorMessage("");
      console.log("Selecting account:", acc.account_name);

      const { contract, address } = await initializeWallet(acc.privateKey);

      setSelectedAccount(acc);

      setAccount(address);
      setContract(contract);

      console.log("Account selected successfully");
    } catch (error) {
      console.error("Account selection error:", error);
      setErrorMessage(error.message);
    }
  };

  // Connect with MetaMask
  const connectWithMetaMask = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it to continue.");
      return;
    }

    try {
      setErrorMessage("");
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Generate a timestamp for the message
      const timestamp = Date.now();
      const message = `Sign this message to verify login: ${timestamp}`;

      const signature = await signer.signMessage(message);

      const result = await WalletLogin({ address, signature, timestamp });

      if (result?.token && result?.user) {
        dispatch(setUser(result.user));

        // Set the account details
        setAccount(address);
        setProvider(provider);
        setContract(null);
        setSelectedAccount({ account_name: "MetaMask Account" });
      } else {
        throw new Error("Wallet authentication failed.");
      }
    } catch (error) {
      console.error("MetaMask connection error:", error);
      setErrorMessage(error.message);
    }
  };

  // Auto-select account on component mount if only one account
  useEffect(() => {
    const autoSelectAccount = async () => {
      try {
        if (accounts.length === 1) {
          await handleAccountSelect(accounts[0]);
        }
      } catch (error) {
        console.error("Auto account selection error:", error);
      }
    };

    autoSelectAccount();
  }, [accounts]);

  // Render error message
  const renderErrorMessage = () => {
    if (errorMessage) {
      return (
        <div className="error-banner">
          {errorMessage}
          <button onClick={() => setErrorMessage("")}>✕</button>
        </div>
      );
    }
    return null;
  };

  // Render account selection
  const renderAccountSelection = () => {
    if (!selectedAccount) {
      return (
        <div className="account-selection">
          <h2>Select an Account</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            {accounts.map((acc, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "10px 15px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <span style={{ fontWeight: "500" }}>{acc.account_name}</span>
                <button
                  onClick={() => handleAccountSelect(acc)}
                  style={{
                    marginLeft: "10px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Select
                </button>
              </div>
            ))}

            <button
              onClick={connectWithMetaMask}
              style={{
                backgroundColor: "#f6851b",
                color: "white",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "16px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Connect with MetaMask
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  // Render main dashboard content
  const renderDashboardContent = () => {
    if (selectedAccount && (account || contract)) {
      return (
        <div>
          <FileUpload
            account={account}
            provider={provider}
            contract={contract}
          />

          <hr className="black-line" />

          <Display
            contract={contract}
            account={account}
            provider={provider}
            selectedAccount={selectedAccount}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col bg-gray-100 w-full p-4">
      <div className="w-full">
        <Navbar name="My Dashboard" />
      </div>

      {renderErrorMessage()}

      <div className="w-full flex lg:flex-nowrap flex-wrap gap-6 mx-auto h-fit">
        {/* Account display */}
        <div className="header">
          {account && <p style={{ color: "black" }}>Account: {account}</p>}
          <hr className="black-line" />
        </div>

        {renderAccountSelection()}
        {renderDashboardContent()}
      </div>
    </div>
  );
}

export default StudentDashboard;
