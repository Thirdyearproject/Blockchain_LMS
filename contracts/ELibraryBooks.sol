// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ELibraryAccess.sol";

contract ELibraryBooks is ELibraryAccess {
    function addBook(
        bytes32 _bookId,
        string memory _title,
        string memory _author,
        string memory _ipfsHash,
        uint8 _requiredClearance,
        FileType _fileType
    ) 
        external 
        onlyAdmin 
    {
        require(_requiredClearance > 0 && _requiredClearance <= 5, 
                "Invalid clearance level");
        require(books[_bookId].requiredClearance == 0, "Book already exists");

        books[_bookId] = Book({
            ipfsHash: _ipfsHash,
            title: _title,
            author: _author,
            requiredClearance: _requiredClearance,
            isAvailable: true,
            validationCount: 0,
            fileType: _fileType
        });

        emit BookAdded(_bookId, _title, _requiredClearance);
    }

    function validateBook(bytes32 _bookId) 
        external 
        validUser 
        hasRequiredClearance(books[_bookId].requiredClearance) 
    {
        books[_bookId].validationCount++;
    }
}