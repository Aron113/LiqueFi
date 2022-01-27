// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Liquefi{
    
    constructor(address lendingPool) {
     lendingpool=lendingPool;
     user=msg.sender;
    
    }
    address public lendingpool;
    uint public currentBalance=0;
    address public user;
    uint public priceSet;
    uint public realPrice;

    function deposit() public payable{
        require(msg.sender==user);
        currentBalance=currentBalance + msg.value;
    }

    function withDraw(uint amountWithdraw) public {
        require(msg.sender==user,'Not a user!');
        require(amountWithdraw<=currentBalance);
        payable(msg.sender).call{value:amountWithdraw}('');
        currentBalance=currentBalance-amountWithdraw;
    }
    function setPrice(uint setprice) public {
        priceSet=setprice;
    }
  
}
