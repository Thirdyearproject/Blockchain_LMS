// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ELibraryBooks.sol";

contract ELibraryBorrowing is ELibraryBooks {
    function borrowBook(bytes32 _bookId) 
        external 
        validUser 
        hasRequiredClearance(books[_bookId].requiredClearance) 
    {
        require(books[_bookId].isAvailable, "Book not available");
        require(!users[msg.sender].currentBorrows[_bookId], 
                "Already borrowed");

        books[_bookId].isAvailable = false;
        users[msg.sender].currentBorrows[_bookId] = true;

        borrowRecords[_bookId].push(BorrowRecord({
            borrower: msg.sender,
            borrowTime: block.timestamp,
            returnDeadline: block.timestamp + 14 days,
            isReturned: false
        }));

        emit BookBorrowed(_bookId, msg.sender);
    }

    function returnBook(bytes32 _bookId) 
        external 
        validUser 
    {
        require(users[msg.sender].currentBorrows[_bookId], 
                "Book not borrowed by user");

        books[_bookId].isAvailable = true;
        users[msg.sender].currentBorrows[_bookId] = false;

        uint256 lastIndex = borrowRecords[_bookId].length - 1;
        borrowRecords[_bookId][lastIndex].isReturned = true;

        emit BookReturned(_bookId, msg.sender);
    }
}