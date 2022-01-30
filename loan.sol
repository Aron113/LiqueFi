// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

 interface IlendingPool{                                  //Define lending pool's interface
        function repay(uint amount) external;             //Use lending pool's repay() function
    }
interface BUSD{                                                                                    //Define Kovan BUSD's interface
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
    

    function setPrice(int setprice) public {                //Set repayment price
        require(msg.sender==user,'Not a user!');
        priceSet=setprice;
    }

    function repayLoan() public {     //Function to be called continuously by relayer                            
        require(priceSet>=getLatestPrice());               //priceSet >= realPrice for our contract to call the lending pool's repay() function
        require(currentBalance!=0);
        BUSD(0x4c6E1EFC12FDfD568186b7BAEc0A43fFfb4bCcCf).approve(lendingpool,currentBalance);
        IlendingPool(lendingpool).repay(currentBalance);
        currentBalance=0;
       
    }

    function getLatestPrice() public view returns (int) {     //Get latest price from Chainlink data feed      
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) =  AggregatorV3Interface(0xbF7A18ea5DE0501f7559144e702b29c55b055CcB).latestRoundData(); // BUSD/ETH PRICE FEED
        return 1/price/10**18; //18 decimals
    }

    function depositChain( uint256 amount) public{               //Deposit  Kovan BUSD into the smartcontract
        BUSD(0x4c6E1EFC12FDfD568186b7BAEc0A43fFfb4bCcCf).transferFrom(msg.sender,address(this),amount);   //Kovan BUSD transferred from user to the contract
         currentBalance=currentBalance + amount;                  //New currentBalance calculated
    }

    function withdrawChain (uint256 amount) public{
        require(msg.sender==user,'Not a user!');
        require(amount<=currentBalance);                  //Withdraw amount must be <= current Balance
        currentBalance=currentBalance-amount;              //New currentBalance calculated
        BUSD(0x4c6E1EFC12FDfD568186b7BAEc0A43fFfb4bCcCf).transfer(user,amount);    //Kovan BUSD tokens withdrawn to user's account
    }
}
