// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

 interface IlendingPool{                                  //Define lending pool's interface
        function repay(uint amount) payable external;     //Use lending pool's repay() function
    }
    
contract Liquefi{
   
    constructor(address lendingPool) {                  //Enter in lending pool's address
     lendingpool=lendingPool;                   
     user=msg.sender;                                    //Creator of contract
     
    
    }
    address public lendingpool;
    uint public currentBalance=0;
    address public user;
    int public priceSet;
    
    function deposit() public payable{                      //Deposit funds into contract
        require(msg.sender==user);
        currentBalance=currentBalance + msg.value;
    }

    function withDraw(uint amountWithdraw) public {         //Withdraw balance      
        require(msg.sender==user,'Not a user!');
        require(amountWithdraw<=currentBalance);            //Withdraw amount must be <= current Balance
        payable(msg.sender).call{value:amountWithdraw}('');
        currentBalance=currentBalance-amountWithdraw;
    }

    function setPrice(int setprice) public {                //Set repayment price
        require(msg.sender==user,'Not a user!');
        priceSet=setprice;
    }

    function repayLoan() public{                            //Function to be called continuously by relayer
        require(priceSet>=getLatestPrice());                //priceSet >= realPrice for our contract to call the lending pool's repay() function
        IlendingPool(lendingpool).repay(currentBalance);
        //current balance=0?
    
    }

    function getLatestPrice() public view returns (int) {     //Get latest price from Chainlink data feed      
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) =  AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e).latestRoundData(); // ETH/USD PRICE FEED
        return price/10**8; //8 decimals
    }
}
