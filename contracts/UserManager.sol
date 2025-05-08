// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract UserManager {
    address public admin;

    enum Clearance { None, Level1, Level2, Level3 }

    mapping(address => Clearance) public userClearance;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function setClearance(address _user, Clearance _level) external onlyAdmin {
        userClearance[_user] = _level;
    }

    function getClearance(address _user) external view returns (Clearance) {
        return userClearance[_user];
    }
}
