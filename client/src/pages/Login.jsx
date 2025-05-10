import { useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken, setUser, setType } from "../redux/Slices/authSlice";
import { RPC_URL } from "../services/apis";
import UserManagerABI from "../build/contracts/UserManager.json";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to store wallet address and any authentication errors
  const [walletAddress, setWalletAddress] = useState("");
  const [authError, setAuthError] = useState("");

  // Function to handle login using the given address (manual or from MetaMask)
  const loginWithWalletAddress = async (address) => {
    if (!address) {
      setAuthError("Wallet address is required.");
      return;
    }

    // Connect to blockchain using RPC provider
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    // Find the latest deployed network details for UserManager contract
    const lastDeployedNetworkIndex =
      Object.keys(UserManagerABI.networks).length - 1;
    const latestNetworkId = Object.keys(UserManagerABI.networks)[
      lastDeployedNetworkIndex
    ];
    const latestNetworkData = UserManagerABI.networks[latestNetworkId];

    if (!latestNetworkData || !latestNetworkData.address) {
      console.error(`Contract not deployed on network ${latestNetworkId}`);
      return;
    }

    // Create instance of UserManager smart contract
    const userManagerContract = new ethers.Contract(
      latestNetworkData.address,
      UserManagerABI.abi,
      provider
    );

    let adminWalletAddress;
    try {
      adminWalletAddress = await userManagerContract.admin();
    } catch (error) {
      console.error("Error fetching admin address:", error);
      setAuthError("Could not fetch admin address.");
      return;
    }

    // Check if the logged-in address is admin
    if (address.toLowerCase() === adminWalletAddress.toLowerCase()) {
      const dummyToken = "dummy-token";

      // Save token and user info locally and in Redux store
      localStorage.setItem("lmstoken", JSON.stringify(dummyToken));
      localStorage.setItem("lmsuser", JSON.stringify(address));
      localStorage.setItem("type", JSON.stringify(4)); // 4 indicates Admin type

      dispatch(setToken(dummyToken));
      dispatch(setUser(address));
      dispatch(setType(4));

      navigate("/dashboard");
      return;
    }

    // If not admin, check user's clearance level
    let userClearanceLevel;
    try {
      userClearanceLevel = await userManagerContract.getClearance(address);
    } catch (error) {
      setAuthError("User not registered. Please contact admin.");
      return;
    }
    if (userClearanceLevel == 0) {
      setAuthError("User not registered. Please contact admin.");
      return;
    }

    const dummyToken = "dummy-token";

    // Save token and user info locally and in Redux store
    localStorage.setItem("lmstoken", JSON.stringify(dummyToken));
    localStorage.setItem("lmsuser", JSON.stringify(address));
    localStorage.setItem("type", JSON.stringify(Number(userClearanceLevel)));

    dispatch(setToken(dummyToken));
    dispatch(setUser(address));
    dispatch(setType(Number(userClearanceLevel)));

    navigate("/dashboard");
  };

  // Function to login with MetaMask wallet connection
  const handleMetaMaskLogin = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed.");
      return;
    }

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const connectedAddress = await signer.getAddress();
      setWalletAddress(connectedAddress);

      await loginWithWalletAddress(connectedAddress);
    } catch (error) {
      console.error(error);
      setAuthError("MetaMask login failed.");
    }
  };

  // Function to login manually using entered wallet address
  const handleManualWalletLogin = async () => {
    await loginWithWalletAddress(walletAddress);
  };

  return (
    <div className="flex h-screen">
      {/* Centered Login Form */}
      <div className="w-full flex items-center justify-center bg-[#f9fafa]">
        <div className="lg:w-[500px] w-[400px]">
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold">Login</h1>
            <p className="text-gray-600">Connect your wallet to continue</p>
          </div>

          <div className="p-5 mt-10 bg-white shadow rounded-2xl">
            <div className="flex flex-col gap-4 mt-6">
              <label htmlFor="walletAddress" className="label-class">
                Wallet Address
              </label>
              <input
                type="text"
                id="walletAddress"
                name="walletAddress"
                className="input-class"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter Wallet Address"
              />

              {/* Show authentication error if any */}
              {authError && <p className="text-red-500">{authError}</p>}

              {/* Manual login button */}
              <button
                type="button"
                onClick={handleManualWalletLogin}
                className="px-6 py-3 rounded-xl text-white bg-[#4caf50]"
              >
                Login with Entered Address
              </button>

              {/* MetaMask login button */}
              <button
                type="button"
                onClick={handleMetaMaskLogin}
                className="px-6 py-3 rounded-xl text-white bg-[#f7931a]"
              >
                {walletAddress
                  ? `Wallet Connected: ${walletAddress.slice(
                      0,
                      6
                    )}...${walletAddress.slice(-4)}`
                  : "Login with MetaMask"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
