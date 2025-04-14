// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ELibrary {
    struct User {
        uint8 clearanceLevel;
        bool isAdmin;
        bool isActive;
        mapping(bytes32 => bool) currentBorrows;
    }

    struct Book {
        string ipfsHash;
        string title;
        string author;
        uint8 requiredClearance;
        bool isAvailable;
        uint256 validationCount;
        FileType fileType;
    }

    struct BorrowRecord {
        address borrower;
        uint256 borrowTime;
        uint256 returnDeadline;
        bool isReturned;
    }

    enum FileType { PDF, EPUB, MOBI, TEXT, IMAGE, VIDEO }

    mapping(address => User) public users;
    mapping(bytes32 => Book) public books;
    mapping(bytes32 => BorrowRecord[]) public borrowRecords;

    event UserRegistered(address userAddress, uint8 clearanceLevel);
    event BookAdded(bytes32 bookId, string title, uint8 clearanceLevel);
    event BookBorrowed(bytes32 bookId, address borrower);
    event BookReturned(bytes32 bookId, address borrower);
}