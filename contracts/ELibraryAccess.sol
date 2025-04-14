// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ELibrary.sol";

contract ELibraryAccess is ELibrary {
    modifier onlyAdmin() {
        require(users[msg.sender].isAdmin, "Not authorized: Admin only");
        require(users[msg.sender].isActive, "Account inactive");
        _;
    }

    modifier validUser() {
        require(users[msg.sender].isActive, "Account inactive");
        _;
    }

    modifier hasRequiredClearance(uint8 level) {
        require(users[msg.sender].clearanceLevel >= level, 
                "Insufficient clearance level");
        _;
    }

    function registerUser(address _user, uint8 _clearanceLevel) 
        external 
        onlyAdmin 
    {
        require(_clearanceLevel > 0 && _clearanceLevel <= 5, 
                "Invalid clearance level");
        require(!users[_user].isActive, "User already exists");

        users[_user].clearanceLevel = _clearanceLevel;
        users[_user].isActive = true;
        
        emit UserRegistered(_user, _clearanceLevel);
    }

    function updateClearanceLevel(address _user, uint8 _newLevel) 
        external 
        onlyAdmin 
    {
        require(users[_user].isActive, "User does not exist");
        users[_user].clearanceLevel = _newLevel;
    }
}