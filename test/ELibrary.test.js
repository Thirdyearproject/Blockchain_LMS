const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("E-Library Smart Contracts", function () {
    let ELibrary;
    let library;
    let owner;
    let admin;
    let user1;
    let user2;

    beforeEach(async function () {
        // Deploy the contract
        ELibrary = await ethers.getContractFactory("ELibraryBorrowing");
        [owner, admin, user1, user2] = await ethers.getSigners();
        library = await ELibrary.deploy();
        await library.deployed();

        // Register admin
        await library.connect(owner).registerUser(admin.address, 5);
        await library.connect(admin).updateClearanceLevel(admin.address, 5);
    });

    describe("User Management", function () {
        it("Should register a new user", async function () {
            await library.connect(admin).registerUser(user1.address, 2);
            const user = await library.users(user1.address);
            expect(user.clearanceLevel).to.equal(2);
            expect(user.isActive).to.be.true;
        });

        it("Should fail to register a user by non-admin", async function () {
            await expect(
                library.connect(user1).registerUser(user2.address, 2)
            ).to.be.revertedWith("Not authorized: Admin only");
        });

        it("Should update user clearance level", async function () {
            await library.connect(admin).registerUser(user1.address, 2);
            await library.connect(admin).updateClearanceLevel(user1.address, 3);
            const user = await library.users(user1.address);
            expect(user.clearanceLevel).to.equal(3);
        });
    });

    describe("Book Management", function () {
        const bookId = ethers.utils.id("test-book");
        const bookMetadata = {
            title: "Test Book",
            author: "Test Author",
            ipfsHash: "QmTest...",
            requiredClearance: 2,
            fileType: 0 // PDF
        };

        beforeEach(async function () {
            await library.connect(admin).registerUser(user1.address, 2);
        });

        it("Should add a new book", async function () {
            await library.connect(admin).addBook(
                bookId,
                bookMetadata.title,
                bookMetadata.author,
                bookMetadata.ipfsHash,
                bookMetadata.requiredClearance,
                bookMetadata.fileType
            );

            const book = await library.books(bookId);
            expect(book.title).to.equal(bookMetadata.title);
            expect(book.isAvailable).to.be.true;
        });

        it("Should validate a book", async function () {
            await library.connect(admin).addBook(
                bookId,
                bookMetadata.title,
                bookMetadata.author,
                bookMetadata.ipfsHash,
                bookMetadata.requiredClearance,
                bookMetadata.fileType
            );

            await library.connect(user1).validateBook(bookId);
            const book = await library.books(bookId);
            expect(book.validationCount).to.equal(1);
        });
    });

    describe("Borrowing System", function () {
        const bookId = ethers.utils.id("test-book");

        beforeEach(async function () {
            await library.connect(admin).registerUser(user1.address, 2);
            await library.connect(admin).addBook(
                bookId,
                "Test Book",
                "Test Author",
                "QmTest...",
                2,
                0
            );
        });

        it("Should borrow a book", async function () {
            await library.connect(user1).borrowBook(bookId);
            const book = await library.books(bookId);
            expect(book.isAvailable).to.be.false;
        });

        it("Should return a book", async function () {
            await library.connect(user1).borrowBook(bookId);
            await library.connect(user1).returnBook(bookId);
            const book = await library.books(bookId);
            expect(book.isAvailable).to.be.true;
        });

        it("Should fail to borrow a book without sufficient clearance", async function () {
            await library.connect(admin).registerUser(user2.address, 1);
            await expect(
                library.connect(user2).borrowBook(bookId)
            ).to.be.revertedWith("Insufficient clearance level");
        });
    });
});