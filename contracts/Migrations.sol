// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Migrations {
    address public owner = msg.sender;
    uint public last_completed_migration;

    function setCompleted(uint completed) public {
        require(msg.sender == owner, "Not authorized");
        last_completed_migration = completed;
    }
}
