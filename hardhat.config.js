
// Import Hardhat Toolbox (includes ethers, waffle, chai, etc.)
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18", // You can adjust the compiler version if needed
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545", // Local Hardhat node
      chainId: 31337, // Default Hardhat chain ID
    },
  },
  paths: {
    sources: "./contracts",      // Smart contracts location
    tests: "./test",              // Test files location
    cache: "./cache",             // Cache location
    artifacts: "./artifacts",     // Compiled artifacts location

  },
};
