// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

interface helo {
  function repayLoan() external;
}

contract SimpleStorage {
  address [] public lol=[0x153fB1B68587f76207e5288c5b439ff0bdbe8d0b,0xf7b46832bbD4907Fe064698512113F326DF90fCd];

  function motherrepayer1() public{
    helo(lol[0]).repayLoan();
  }
  function motherrepayer2() public{
    helo(lol[1]).repayLoan();
  }
function motherrepayer3() public{
    helo(lol[2]).repayLoan();
  }

}
