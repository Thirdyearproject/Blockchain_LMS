const UserManager = artifacts.require("UserManager");
const BookManager = artifacts.require("BookManager");
const BorrowManager = artifacts.require("BorrowManager");

contract("E-Library Full System Test", (accounts) => {
    let userManager, bookManager, borrowManager;
    const [admin, alice, bob, charlie] = accounts;

    before(async () => {
        userManager = await UserManager.deployed();
        bookManager = await BookManager.deployed();
        borrowManager = await BorrowManager.deployed();
    });

    it("should assign clearance levels", async () => {
        // Assign clearance levels to users
        await userManager.setClearance(alice, 1, { from: admin });
        await userManager.setClearance(bob, 2, { from: admin });
        await userManager.setClearance(charlie, 3, { from: admin });

        // Check if the users' clearance levels are set correctly
        const aliceClearance = await userManager.getClearance(alice);
        const bobClearance = await userManager.getClearance(bob);
        const charlieClearance = await userManager.getClearance(charlie);

        assert.equal(aliceClearance.toString(), "1");
        assert.equal(bobClearance.toString(), "2");
        assert.equal(charlieClearance.toString(), "3");
    });

    it("should allow proposing, voting, borrowing, returning books", async () => {
        // Propose a new book
        await bookManager.proposeBook("Blockchain Book", 1, { from: bob });

        // Vote on the book (Bob and Charlie vote for approval)
        await bookManager.voteOnBook(0, true, { from: bob });
        await bookManager.voteOnBook(0, true, { from: charlie });

        // Get the book status (should be approved now)
        const book = await bookManager.getBook(0);
        assert.equal(book.status.toString(), "1"); // Approved

        // Borrow the book (Alice borrows the book)
        await borrowManager.borrowBook(0, { from: alice });

        // Get the borrow record for Alice
        const borrows = await borrowManager.getUserBorrows(alice);
        assert.equal(borrows.length, 1);
        assert.equal(borrows[0].bookId.toString(), "0");

        // Return the book (Alice returns the book)
        await borrowManager.returnBook(0, { from: alice });

        // Get the borrow record after returning the book
        const borrowsAfterReturn = await borrowManager.getUserBorrows(alice);

        // Check if returnTime is set (it should not be 0)
        assert(borrowsAfterReturn[0].returnTime > 0, "Book return time should be set");
    });
});
