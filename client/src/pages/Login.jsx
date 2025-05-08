import { useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser, setType } from "../redux/Slices/authSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signupData = useSelector((state) => state.auth.signupData);
  const [walletAddress, setWalletAddress] = useState("");
  const [authError, setAuthError] = useState("");

  const loginWithAddress = async (address) => {
    if (!address) {
      setAuthError("Wallet address is required.");
      return;
    }

    if (!signupData || !Array.isArray(signupData)) {
      setAuthError("No registered accounts found. Please sign up first.");
      return;
    }

    const user = signupData.find((u) => u.userAddr.address === address);

    if (user) {
      const dummyToken = "dummy-token"; // simple dummy token
      localStorage.setItem("lmstoken", JSON.stringify(dummyToken));
      localStorage.setItem("lmsuser", JSON.stringify(user.userAddr.address));
      localStorage.setItem("type", JSON.stringify(user.clearanceLevel));

      dispatch(setToken(dummyToken));
      dispatch(setUser(user.userAddr.address));
      dispatch(setType(user.clearanceLevel));

      navigate("/dashboard");
    } else {
      setAuthError("Wallet address not registered. Please sign up first.");
    }
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

            <div className="flex justify-between items-center mt-6">
              <p className="font-semibold text-[14px] text-gray-500">
                Don't have an account?
              </p>
              <button
                onClick={() => navigate("/signup")}
                className="underline text-sm text-[#22a7f1] font-bold"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
