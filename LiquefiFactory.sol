// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import './Liquefi.sol';


contract LiquefiFactory{
    Liquefi[] public liqueFiList;     //Array of Liquefi smart contract addresses

    function startLiqueFi(address lendingpool, address tokenaddress,uint ratemode) public {
        Liquefi newcontract = new Liquefi(lendingpool, tokenaddress, ratemode, address(this));
        liqueFiList.push(newcontract);
    }

    function viewLiquefiContracts()public view returns (Liquefi[] memory){     //View an array of all the contracts
        return liqueFiList;
    }
  
}
