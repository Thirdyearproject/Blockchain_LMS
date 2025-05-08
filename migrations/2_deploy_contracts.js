const UserManager = artifacts.require("UserManager");
const BookManager = artifacts.require("BookManager");
const BorrowManager = artifacts.require("BorrowManager");

module.exports = async function (deployer) {
  await deployer.deploy(UserManager);
  const userManager = await UserManager.deployed();

  await deployer.deploy(BookManager, userManager.address);
  const bookManager = await BookManager.deployed();

  await deployer.deploy(BorrowManager, userManager.address, bookManager.address);
};
