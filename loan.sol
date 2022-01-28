// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

 interface IlendingPool{                                  //Define lending pool's interface
        function repay(uint amount) external;             //Use lending pool's repay() function
    }
interface chainlink{                                                                                    //Define chainlink token's interface
    function approve(address spender, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);   //Use the transferFrom() function 
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
    string public Notyet='not yet';
    

    function setPrice(int setprice) public {                //Set repayment price
        require(msg.sender==user,'Not a user!');
        priceSet=setprice;
    }

    function repayLoan() public returns (string memory){     //Function to be called continuously by relayer                            
        if (priceSet>=getLatestPrice()){               //priceSet >= realPrice for our contract to call the lending pool's repay() function
        chainlink(0x01BE23585060835E02B77ef475b0Cc51aA1e0709).approve(lendingpool,currentBalance);
        IlendingPool(lendingpool).repay(currentBalance);
        currentBalance=0;}
        else{
            return Notyet;
        }
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

    function depositChain( uint256 amount) public{               //Deposit  Chainlink tokens into the smartcontract
        chainlink(0x01BE23585060835E02B77ef475b0Cc51aA1e0709).transferFrom(msg.sender,address(this),amount);   //Chainlink tokens transferred from user to the contract
         currentBalance=currentBalance + amount;                  //New currentBalance calculated
    }

    function withdrawChain (uint256 amount) public{
        require(msg.sender==user,'Not a user!');
        require(amount<=currentBalance);                  //Withdraw amount must be <= current Balance
        currentBalance=currentBalance-amount;              //New currentBalance calculated
        chainlink(0x01BE23585060835E02B77ef475b0Cc51aA1e0709).transfer(user,amount);    //Chainlink tokens withdrawn to user's account
    }
}
