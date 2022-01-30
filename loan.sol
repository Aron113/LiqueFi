// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

 interface IlendingPool{                                                                                                        //Define lending pool's interface
     function repay(address asset, uint256 amount, uint256 rateMode, address onBehalfOf) external returns (uint256);             //Use lending pool's repay() function  
     }
    
interface ERC20{                                                                                    //Define ERC20's interface
    function approve(address spender, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);   //Use the transferFrom() function 
}
    
contract Liquefi{
   
    constructor(address lendingpool, address tokenaddress,uint ratemode) {                  //Enter in lending pool's address
     lendingPool=lendingpool;    
     tokenAddress=tokenaddress;
     rateMode=ratemode;
     user=msg.sender;                                    //Creator of contract
    }

    address public lendingPool;
    address public tokenAddress;
    uint public rateMode;
    uint public currentBalance=0;
    address public user;
    int public priceSet;
    

    function setPrice(int setprice) public {                //Set repayment price
        require(msg.sender==user,'Not a user!');
        priceSet=setprice;
    }

    function repayLoan() public {     //Function to be called continuously by relayer                            
        require(priceSet>=getLatestPrice());               //priceSet >= realPrice for our contract to call the lending pool's repay() function
        require(currentBalance!=0);
        ERC20(tokenAddress).approve(lendingpool,currentBalance);
        IlendingPool(lendingPool).repay(tokenAddress,currentBalance,rateMode,user);
        currentBalance=0;
       
    }

    function getLatestPrice() public view returns (int) {     //Get latest price from Chainlink data feed      
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) =  AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331).latestRoundData(); // ETH/USD PRICE FEED *SafeMath needed for BUSD/ETH
        return price/10*8; //8 decimals
    }

    function depositERC20( uint256 amount) public{               //Deposit ERC20 into the smartcontract
        ERC20(tokenAddress).transferFrom(msg.sender,address(this),amount);   //ERC20 transferred from user to the contract
         currentBalance=currentBalance + amount;                  //New currentBalance calculated
    }

    function withdrawERC20(uint256 amount) public{
        require(msg.sender==user,'Not a user!');
        require(amount<=currentBalance);                  //Withdraw amount must be <= current Balance
        currentBalance=currentBalance-amount;              //New currentBalance calculated
        ERC20(tokenAddress).transfer(user,amount);    //ERC20 tokens withdrawn to user's account
    }
}
