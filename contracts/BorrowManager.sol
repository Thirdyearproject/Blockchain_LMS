// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./UserManager.sol";
import "./BookManager.sol";

contract BorrowManager {
    struct Borrow {
        address user;
        uint bookId;
        uint borrowTime;
        uint returnTime;
        bool returned;
    }

    Borrow[] public borrows;
    mapping(address => mapping(uint => bool)) public hasBorrowed;

    UserManager public userManager;
    BookManager public bookManager;

    constructor(address _userManager, address _bookManager) {
        userManager = UserManager(_userManager);
        bookManager = BookManager(_bookManager);
    }

    function borrowBook(uint _bookId) external {
        BookManager.Book memory book = bookManager.getBook(_bookId);
        require(uint(userManager.getClearance(msg.sender)) >= book.requiredClearance, "Insufficient clearance");
        require(book.status == BookManager.Status.Approved, "Book not approved");
        require(!hasBorrowed[msg.sender][_bookId], "Already borrowed");

        borrows.push(Borrow({
            user: msg.sender,
            bookId: _bookId,
            borrowTime: block.timestamp,
            returnTime: 0,
            returned: false
        }));

        hasBorrowed[msg.sender][_bookId] = true;
    }

    function returnBook(uint _borrowId) external {
        require(_borrowId < borrows.length, "Invalid borrow ID");
        Borrow storage borrow = borrows[_borrowId];

        require(borrow.user == msg.sender, "Not your borrow record");
        require(!borrow.returned, "Already returned");

        borrow.returnTime = block.timestamp;
        borrow.returned = true;
        hasBorrowed[msg.sender][borrow.bookId] = false;
    }

    function getAllBorrows() external view returns (Borrow[] memory) {
        return borrows;
    }

    function getBorrowsCount() external view returns (uint) {
        return borrows.length;
    }
}
