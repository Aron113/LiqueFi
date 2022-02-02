// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

interface chainlink{                                                                                    //Define chainlink token's interface
    function approve(address spender, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);   //Use the transferFrom() function 
}
contract testreal {

    function repay(uint amount) external {
        chainlink(0x01BE23585060835E02B77ef475b0Cc51aA1e0709).transferFrom(msg.sender, address(this), amount);
        
    }
  
}
