async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);

  const ELibrary = await ethers.getContractFactory("ELibraryBorrowing");
  const library = await ELibrary.deploy();

  await library.deployed();

  console.log("ELibrary deployed to:", library.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });