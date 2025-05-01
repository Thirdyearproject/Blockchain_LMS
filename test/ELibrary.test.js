const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("E-Library Contracts", function () {
  let owner, addr1, elibraryAccess;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const ELibraryAccess = await ethers.getContractFactory("ELibraryAccess");
    elibraryAccess = await ELibraryAccess.deploy();
    await elibraryAccess.waitForDeployment();
  });

  it("should allow admin to register a new user", async function () {
    await elibraryAccess.connect(owner).registerUser(addr1.address, 1);
    const user = await elibraryAccess.users(addr1.address);
    expect(user.clearanceLevel).to.equal(1);
  });
});
