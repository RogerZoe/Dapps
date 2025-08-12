// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery {
    address owner;
    address payable[] public Users;
    bool public isCompleted;
    bool public claimed;
    address public winner;

    constructor() {
        owner = msg.sender;
        isCompleted = false;
        claimed = false;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, " Your are not the owner");
        _;
    }

    function getManager() public view returns (address) {
        return owner;
    }

    function getWinner() public view returns (address) {
        return winner;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return Users;
    }

    function status() public view returns (bool) {
        return isCompleted;
    }

    function Join() public payable {
        require(msg.value > 0, "NOt enough eth");
        Users.push(payable(msg.sender));
    }

    function SelectWinner() public onlyOwner {
        require(Users.length > 0);
        require(!isCompleted);
        winner = Users[randomNumber() % Users.length];
        isCompleted = true;
    }

    function claimPrize() public {
        require(msg.sender == winner, "You are not the winner");
        require(isCompleted, "Winner not selected yet");
        require(!claimed, "Prize already claimed");

        payable(winner).transfer(address(this).balance);
        claimed = true;

        // ✅ Auto-reset after claim
        isCompleted = false;
        delete Users;
        winner = address(0);
    }

    function resetLottery() public onlyOwner {
        require(
            isCompleted && claimed,
            "Cannot reset: Winner hasn't claimed prize yet"
        );

        // Reset all state
        delete Users;
        isCompleted = false;
        claimed = false;
        winner = address(0);
    }

    function randomNumber() public view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        Users.length
                    )
                )
            );
    }
}
