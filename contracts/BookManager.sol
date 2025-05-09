// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./UserManager.sol";

contract BookManager {
    enum Status { Proposed, Approved, Rejected }
    enum FileType { PDF, EPUB, MOBI, TEXT, IMAGE, VIDEO }

    struct Book {
        bytes32 bookId;
        string title;
        string author;
        string ipfsHash;
        uint requiredClearance;
        FileType fileType;
        Status status;
        address proposer;
        uint yesVotes;
        uint noVotes;
    }

    Book[] public books;
    UserManager public userManager;
    mapping(uint => mapping(address => bool)) public voted;

    constructor(address userManagerAddress) {
        userManager = UserManager(userManagerAddress);
    }

    function addBook(
        bytes32 _bookId,
        string memory _title,
        string memory _author,
        string memory _ipfsHash,
        uint _requiredClearance,
        uint _fileType
    ) external {
        require(uint(userManager.getClearance(msg.sender)) >= 2, "Not enough clearance to add books");
        books.push(Book(
            _bookId,
            _title,
            _author,
            _ipfsHash,
            _requiredClearance,
            FileType(_fileType),
            Status.Proposed,
            msg.sender,
            0,
            0
        ));
    }

    function voteOnBook(uint _bookId, bool _approve) external {
        require(uint(userManager.getClearance(msg.sender)) > 0, "Not enough clearance to vote");
        require(!voted[_bookId][msg.sender], "Already voted on this book");
        require(_bookId < books.length, "Invalid book ID");

        voted[_bookId][msg.sender] = true;

        if (_approve) {
            books[_bookId].yesVotes++;
            if (books[_bookId].yesVotes > books[_bookId].noVotes) {
                books[_bookId].status = Status.Approved;
            }
        } else {
            books[_bookId].noVotes++;
            if (books[_bookId].noVotes >= books[_bookId].yesVotes) {
                books[_bookId].status = Status.Rejected;
            }
        }
    }

    function getBook(uint _index) external view returns (Book memory) {
        require(_index < books.length, "Invalid index");
        return books[_index];
    }

    function getAllBooks() external view returns (Book[] memory) {
        return books;
    }

    function getBooksCount() external view returns (uint) {
        return books.length;
    }
}
