// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./UserManager.sol";
import "./BookManager.sol";

contract BorrowManager {
    struct BorrowInfo {
        uint bookId;
        uint borrowTime;
        uint returnTime;
        address borrower;
    }

    BorrowInfo[] public borrows;
    UserManager public userManager;
    BookManager public bookManager;

    constructor(address userManagerAddress, address bookManagerAddress) {
        userManager = UserManager(userManagerAddress);
        bookManager = BookManager(bookManagerAddress);
    }

    function borrowBook(uint _bookId) external {
        BookManager.Book memory book = bookManager.getBook(_bookId);

        require(book.status == BookManager.Status.Approved, "Book not approved");
        require(uint(userManager.getClearance(msg.sender)) >= book.requiredClearance, "Not enough clearance to borrow");

        borrows.push(BorrowInfo(_bookId, block.timestamp, 0, msg.sender));
    }

    function returnBook(uint _borrowId) external {
        BorrowInfo storage borrowInfo = borrows[_borrowId];

        require(borrowInfo.borrower == msg.sender, "Not your borrow record");
        require(borrowInfo.returnTime == 0, "Already returned");

        borrowInfo.returnTime = block.timestamp;
    }

    function getUserBorrows(address _user) external view returns (BorrowInfo[] memory) {
        uint count = 0;
        for (uint i = 0; i < borrows.length; i++) {
            if (borrows[i].borrower == _user) {
                count++;
            }
        }

        BorrowInfo[] memory result = new BorrowInfo[](count);
        uint index = 0;
        for (uint i = 0; i < borrows.length; i++) {
            if (borrows[i].borrower == _user) {
                result[index] = borrows[i];
                index++;
            }
        }
        return result;
    }
}
