// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import './Liquefi.sol';


contract LiquefiFactory{
    
    mapping(address=>userContracts) public UserContracts;             //Map each address(key) to a struct containing an array of their Liquefi contracts(value)
    Liquefi[] public liqueFiList;                                    //Array of Liquefi smart contract addresses
    
    struct userContracts{
        uint nil;                                                   //nil value
        address[] usercontracts;                                     //Array of the Liquefi contracts
    }


    function startLiqueFi(address lendingpool, address tokenaddress,uint ratemode) public {
        Liquefi newcontract = new Liquefi(lendingpool, tokenaddress, ratemode, address(this));
        liqueFiList.push(newcontract);
        UserContracts[msg.sender].usercontracts.push(address(newcontract));
    }

    function viewLiquefiContracts()public view returns (Liquefi[] memory){     //View an array of ALL the contracts
        return liqueFiList;
    }
    
    function viewusercontracts(address user)public view returns (address[] memory){         //View an array of a user's contracts
        return UserContracts[user].usercontracts;
    }
  
}
