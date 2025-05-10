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
  const [walletAddress, setWalletAddress] = useState("");
  const [authError, setAuthError] = useState("");

  const loginWithAddress = async (address) => {
    if (!address) {
      setAuthError("Wallet address is required.");
      return;
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);

    const lastIndex = Object.keys(UserManagerABI.networks).length - 1;
    const networkId = Object.keys(UserManagerABI.networks)[lastIndex];

    const networkData = UserManagerABI.networks[networkId];
    if (!networkData || !networkData.address) {
      console.error(`Contract not deployed on network ${networkId}`);
      return;
    }

    const userManager = new ethers.Contract(
      networkData.address,
      UserManagerABI.abi,
      provider
    );

    let adminAddress;
    try {
      adminAddress = await userManager.admin();
    } catch (error) {
      console.error("Error fetching admin address:", error);
      setAuthError("Could not fetch admin address.");
      return;
    }

    if (address.toLowerCase() === adminAddress.toLowerCase()) {
      const dummyToken = "dummy-token";
      localStorage.setItem("lmstoken", JSON.stringify(dummyToken));
      localStorage.setItem("lmsuser", JSON.stringify(address));
      localStorage.setItem("type", JSON.stringify(4)); // Admin type

      dispatch(setToken(dummyToken));
      dispatch(setUser(address));
      dispatch(setType(4));

      navigate("/dashboard");
      return;
    }

    // Check user clearance
    let clearanceLevel;
    try {
      clearanceLevel = await userManager.getClearance(address);
      console.log("Clearance Level:", clearanceLevel);
    } catch (error) {
      console.error("Error fetching clearance level:", error);
      setAuthError("Failed to fetch clearance level.");
      return;
    }

    if (clearanceLevel === 0n) {
      setAuthError("User not registered. Please contact admin.");
      return;
    }

    const dummyToken = "dummy-token";
    localStorage.setItem("lmstoken", JSON.stringify(dummyToken));
    localStorage.setItem("lmsuser", JSON.stringify(address));
    localStorage.setItem("type", JSON.stringify(Number(clearanceLevel)));

    dispatch(setToken(dummyToken));
    dispatch(setUser(address));
    dispatch(setType(Number(clearanceLevel)));

    navigate("/dashboard");
  };

  const handleWalletLogin = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      await loginWithAddress(address);
    } catch (err) {
      console.error(err);
      setAuthError("MetaMask login failed.");
    }
  };

  const handleManualLogin = async () => {
    await loginWithAddress(walletAddress);
  };

  return (
    <div className="flex h-screen">
      <div className="w-full flex items-center justify-center bg-[#f9fafa]">
        <div className="lg:w-[500px] w-[400px]">
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold">Login</h1>
            <p className="text-gray-600">Connect your wallet to continue</p>
          </div>

          <div className="p-5 mt-10 bg-white shadow rounded-2xl">
            <div className="flex flex-col gap-4 mt-6">
              <label htmlFor="walletAddress" className="lable-class">
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

              {authError && <p className="text-red-500">{authError}</p>}

              <button
                type="button"
                onClick={handleManualLogin}
                className="px-6 py-3 rounded-xl text-white bg-[#4caf50]"
              >
                Login with Entered Address
              </button>

              <button
                type="button"
                onClick={handleWalletLogin}
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
