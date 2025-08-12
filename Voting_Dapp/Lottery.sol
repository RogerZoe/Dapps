// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// contract Lottery {
//     address owner;
//     address payable[] public Users;
//     bool public isCompleted; 
//     bool public claimed;
//     address public winner;

//     constructor() {
//         owner = msg.sender;
//         isCompleted = false;
//         claimed = false;
//     }

//     modifier onlyOwner() {
//         require(owner == msg.sender, " Your are not the owner");
//         _;
//     }

//     function Join() public payable {
//         require(msg.value > 0, "NOt enough eth");
//         Users.push(payable(msg.sender));
//     }

//     function SelectWinner() public onlyOwner{
//         require(Users.length >0 );
//         require(!isCompleted);
//         winner=Users[randomNumber() % Users.length];
//         claimed=true;

//     }

//     function randomNumber() public  view returns(uint){
//         return uint(keccak256(abi.encodePacked(block.timestamp,block.prevrandao,Users.length)));
//     }

    
// }
