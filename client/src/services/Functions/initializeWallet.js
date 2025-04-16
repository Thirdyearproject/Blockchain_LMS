import { ethers } from "ethers";
import Upload from "../../artifacts/contracts/Upload.sol/upload.json";

const CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

export const initializeWallet = async (privateKey) => {
  const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_APP_RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, Upload.abi, wallet);
  const address = await wallet.getAddress();
  return { contract, address };
};
