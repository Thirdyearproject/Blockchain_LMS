// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./UserManager.sol";

contract BookManager {
    enum Status { Proposed, Approved, Rejected }

    struct Book {
        string title;
        uint requiredClearance;
        Status status;
        address proposer;
        uint yesVotes;
        uint noVotes;
    }

    Book[] public books;
    UserManager public userManager;
    mapping(uint => mapping(address => bool)) public voted; // track who voted on which book

    constructor(address userManagerAddress) {
        userManager = UserManager(userManagerAddress);
    }

    function proposeBook(string memory _title, uint _requiredClearance) external {
        require(uint(userManager.getClearance(msg.sender)) > 2, "Not enough clearance to propose books");
        books.push(Book(_title, _requiredClearance, Status.Proposed, msg.sender, 0, 0));
    }

    function voteOnBook(uint _bookId, bool _approve) external {
        require(uint(userManager.getClearance(msg.sender)) > 0, "Not enough clearance to vote");
        require(!voted[_bookId][msg.sender], "Already voted");

        Book storage book = books[_bookId];
        require(book.status == Status.Proposed, "Book is not open for voting");

        voted[_bookId][msg.sender] = true;

        if (_approve) {
            book.yesVotes++;
        } else {
            book.noVotes++;
        }

        if (book.yesVotes >= 2) {
            book.status = Status.Approved;
        } else if (book.noVotes >= 2) {
            book.status = Status.Rejected;
        }
    }

    function getBook(uint _bookId) external view returns (Book memory) {
        return books[_bookId];
    }

    function getBooksCount() external view returns (uint) {
        return books.length;
    }
}
