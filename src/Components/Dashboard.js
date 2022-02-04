import React, {Component} from 'react';
import {ethers} from 'ethers';
import liquefifactory_abi from './liquefifactory_abi.json' ;        /////Import factory contract ABI
import liquefi_abi from './liquefi_abi.json';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

class Dashboard extends React.Component {
    componentDidMount(){
      this.getProviderandContract()          ///Call this function when component loads to get the Metamask wallet and contract instance

    }
//  constructor(props) {
    // super(props);

     state={
       contractAddress:'0x1922f92ADB14022465Fe28ABa31DA747F5D32AA3',
       ContractInstance:'',
       Signer:'',
       ArrayLiquefiContracts:[],
       ArrayUsersContracts:[],
       UserAddress:'',
       ArrayTokenAddress:[],
       StateArray:[],
       RateModeArray:[],
       PriceSetArray:[],
       MintedAmountArray:[],
       LendingPoolArray:[],
       LatestPriceArray:[],
       CurrentBalanceArray:[],
     };

//}



async getProviderandContract () {
  ////////////Connecting to User's account/////////////
  let Provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log('This is the Provider:', Provider);
  let UserWalletAddress = await Provider.send("eth_requestAccounts", []);
    console.log('This is your wallet address:', UserWalletAddress);
  await  this.setState({UserAddress:UserWalletAddress})
  let Signer = Provider.getSigner();
  this.setState({Signer:Signer})
    console.log('This is the Signer:', Signer);

/////////Getting an instance of the contract////////////
  let ContractInstance = new ethers.Contract((this.state.contractAddress), liquefifactory_abi, Signer);
    console.log('This is the ContractInstance:',ContractInstance);
  await this.setState({ContractInstance:ContractInstance});
    console.log(this.state.ContractInstance)

////////Retrieving the list of user's liquefi contracts//////////
  let viewusercontractsarray = await this.state.ContractInstance.viewusercontracts(this.state.UserAddress[0])
    console.log(viewusercontractsarray);
  this.setState({ArrayUsersContracts:viewusercontractsarray})
    console.log(this.state.ArrayUsersContracts)

        ///////Longest Loop ever/////////////////
  for (let IndividualContractAddress of this.state.ArrayUsersContracts){       //Use for...of loop instead of for..in loop
      let LiquefiContractInstance = new ethers.Contract(IndividualContractAddress, liquefi_abi, Signer);   //If for...in loop is used, this.state.ArrayUsersContracts[IndividualContractAddress]

      /////Getting token addresses/////////
      let GettokenAddress = await LiquefiContractInstance.tokenAddress()                                   //will be used instead
      console.log(GettokenAddress)
      let newTokenAddressArray=this.state.ArrayTokenAddress.concat(GettokenAddress)
      this.setState({ArrayTokenAddress:newTokenAddressArray})

      //////Getting State of contract///////
      let StateofContract = await LiquefiContractInstance.state()
      if (StateofContract==0) {
        StateofContract='Not Repaid';
      }
      else{
        StateofContract='Repaid';
      }
      console.log(StateofContract)
      let newStateArray=this.state.StateArray.concat(StateofContract)
      this.setState({StateArray:newStateArray})

      ///////Getting the Rate Mode////////////
      let RateMode = await LiquefiContractInstance.rateMode()
      console.log(RateMode.toString())
      let newRateModeArray=this.state.RateModeArray.concat(RateMode.toString())
      this.setState({RateModeArray:newRateModeArray})

      //////Getting the PriceSet////////////////
      let PriceSet = await LiquefiContractInstance.priceSet()
      console.log(PriceSet.toString())
      let newPriceSetArray=this.state.PriceSetArray.concat(PriceSet.toString())
      this.setState({PriceSetArray:newPriceSetArray})

      ///////Getting the minted amount///////////
      let mintedAmount = await LiquefiContractInstance.mintedAmount()
      let newMintedAmountArray=this.state.MintedAmountArray.concat(mintedAmount.toString())
      this.setState({MintedAmountArray:newMintedAmountArray})

      //////Geting lending pool address///////////
      let lendingpool = await LiquefiContractInstance.lendingPool()
      let newLendingPoolArray=this.state.LendingPoolArray.concat(lendingpool)
      this.setState({LendingPoolArray:newLendingPoolArray})

      /////Getting the latest price///////////////
      let LatestPrice = await LiquefiContractInstance.getLatestPrice()
      let newLatestPriceArray=this.state.LatestPriceArray.concat(LatestPrice.toString())
      this.setState({LatestPriceArray:newLatestPriceArray})

      /////Getting the Current Balance////////////
      let CurrentBalance = await LiquefiContractInstance.currentBalance()
      let newCurrentBalanceArray=this.state.CurrentBalanceArray.concat(CurrentBalance.toString())
      this.setState({CurrentBalanceArray:newCurrentBalanceArray})
  }
}

//////////Function Mapping//////////////////////
depositERC20 = async(event) => {                                                                     //User needs to approve the contract to take their ERC20s first
  try{
    event.preventDefault()
    let ContractInstance = new ethers.Contract(event.target.SelectedAddress.value, liquefi_abi, this.state.Signer)    //Getting contract instance based on which address they select in the dropdown
    let depositTokens = await ContractInstance.depositERC20(event.target.depositAmount.value)            //depositing the ERC20 into the contract, this depositAmount is in decimals.
    console.log(depositTokens)                                                                       //for actual number of tokens could use: event.target.depositAmount.value * 10**18
  }
  catch{
    alert('Approve token.')
  }
}

withdrawERC20 = async(event) => {
  try{
    event.preventDefault()
    let ContractInstance = new ethers.Contract(event.target.SelectedAddress.value, liquefi_abi, this.state.Signer)
    let withdrawTokens = await ContractInstance.withdrawERC20(event.target.withdrawAmount.value)
    console.log(withdrawTokens)
  }
  catch{
    alert('Insufficient balance to withdraw from.')
  }
}

farm = async(event) => {                             //This does not work because we can't actually farm our BUSD on Compound lending pool, cause they're different tokens
  try{
    event.preventDefault()
    let ContractInstance = new ethers.Contract(event.target.SelectedAddress.value, liquefi_abi, this.state.Signer)
    let farming = await ContractInstance.farm(event.target.farmAmount.value)
    console.log(farming)
  }
  catch{
    alert('Insufficient balance to farm.')
  }
}

redeemFromFarm = async(event) => {
  try{
    event.preventDefault()
    let ContractInstance = new ethers.Contract(event.target.SelectedAddress.value, liquefi_abi, this.state.Signer)
    let redeemingFromFarm = await ContractInstance.redeemFromFarm(event.target.redeemAmount.value)
    console.log(redeemingFromFarm)
  }
  catch{
    alert('Insufficient minted amount to redeem from.')
  }
}

repayLoanfromFarm = async(event) => {
  try{
    event.preventDefault()
    let ContractInstance = new ethers.Contract(event.target.SelectedAddress.value, liquefi_abi, this.state.Signer)
    let repayingfromfarm = await ContractInstance.repayLoanfromCurrentBalance()
    console.log(repayingfromfarm)
  }
  catch{
    alert('Set price has not been reached yet.')
  }
}

repayLoanfromCurrentBalance = async(event) => {
  try{
    event.preventDefault()
    let ContractInstance = new ethers.Contract(event.target.SelectedAddress.value, liquefi_abi, this.state.Signer)
    let repayingfromcurrentbalance = await ContractInstance.repayLoanfromCurrentBalance()
    console.log(repayingfromcurrentbalance)
  }
  catch{
    alert('Set price has not been reached yet.')
  }
}

setPrice = async(event) => {
  try{
    event.preventDefault()
    let ContractInstance = new ethers.Contract(event.target.SelectedAddress.value, liquefi_abi, this.state.Signer)
    let settingprice = await ContractInstance.setPrice(event.target.priceset.value)
    console.log(settingprice)
  }
  catch{
    alert('Incorrect input.')
  }
}


////////////////Front End///////////////////////
render(){
  return (
    <div>
      <h1>Dashboard</h1>
          <p><b>Your Address:</b> {this.state.UserAddress}</p>

          <p><b>Your LiqueFi contracts:</b>


              <Table striped hover>
                <thead>

                </thead>
                <tbody style={{'width': '1150px', 'overflow':'scroll', 'display': 'block'}}>

                  <tr>
                    <td>Contract Address</td>
                    {this.state.ArrayUsersContracts.map(x=><td>{x}

                      </td>)}
                  </tr>

                  <tr>
                  <td>Token Address</td>
                    {this.state.ArrayTokenAddress.map(y=><td>{y}</td>)}
                  </tr>

                  <tr>
                  <td>State of Contract</td>
                    {this.state.StateArray.map(z=><td>{z}</td>)}
                  </tr>

                  <tr>
                  <td>Rate Mode</td>
                    {this.state.RateModeArray.map(a=><td>{a}</td>)}
                  </tr>

                  <tr>
                  <td>Price Set</td>
                    {this.state.PriceSetArray.map(a=><td>{a}</td>)}
                  </tr>

                  <tr>
                  <td>Minted Amount</td>
                    {this.state.MintedAmountArray.map(a=><td>{a}</td>)}
                  </tr>

                  <tr>
                  <td>Lending Pool</td>
                    {this.state.LendingPoolArray.map(a=><td>{a}</td>)}
                  </tr>

                  <tr>
                  <td>Latest Price</td>
                    {this.state.LatestPriceArray.map(a=><td>{a}</td>)}
                  </tr>

                  <tr>
                  <td>Current Balance</td>
                    {this.state.CurrentBalanceArray.map(a=><td>{a}</td>)}
                  </tr>


                </tbody>
              </Table>
            </p>

            <p>
            <form onSubmit={this.depositERC20}>
              <Form.Select id='SelectedAddress'>
              {this.state.ArrayUsersContracts.map(x=><option>{x}</option>)}
              </Form.Select>
              <input id='depositAmount' type='text' placeholder='Amount...'/>
              <button type={'submit'}>Deposit ERC20!</button>
            </form>
            </p>

            <p>
            <form onSubmit={this.withdrawERC20}>
              <Form.Select id='SelectedAddress'>
              {this.state.ArrayUsersContracts.map(x=><option>{x}</option>)}
              </Form.Select>
              <input id='withdrawAmount' type='text' placeholder='Amount...'/>
              <button type={'submit'}>Withdraw ERC20!</button>
            </form>
            </p>

            <p>
            <form onSubmit={this.farm}>
              <Form.Select id='SelectedAddress'>
              {this.state.ArrayUsersContracts.map(x=><option>{x}</option>)}
              </Form.Select>
              <input id='farmAmount' type='text' placeholder='Amount...'/>
              <button type={'submit'}>Farm!</button>
            </form>
            </p>

            <p>
            <form onSubmit={this.redeemFromFarm}>
              <Form.Select id='SelectedAddress'>
              {this.state.ArrayUsersContracts.map(x=><option>{x}</option>)}
              </Form.Select>
              <input id='redeemAmount' type='text' placeholder='Amount...'/>
              <button type={'submit'}>Redeem from Farm!</button>
            </form>
            </p>

            <p>
            <form onSubmit={this.repayLoanfromFarm}>
              <Form.Select id='SelectedAddress'>
              {this.state.ArrayUsersContracts.map(x=><option>{x}</option>)}
              </Form.Select>
              <button type={'submit'}>Repay Loan from Farm!</button>
            </form>
            </p>

            <p>
            <form onSubmit={this.repayLoanfromCurrentBalance}>
              <Form.Select id='SelectedAddress'>
              {this.state.ArrayUsersContracts.map(x=><option>{x}</option>)}
              </Form.Select>
              <button type={'submit'}>Repay Loan from Current Balance!</button>
            </form>
            </p>

            <p>
            <form onSubmit={this.setPrice}>
              <Form.Select id='SelectedAddress'>
              {this.state.ArrayUsersContracts.map(x=><option>{x}</option>)}
              </Form.Select>
              <input id='priceset' type='text' placeholder='Price...'/>
              <button type={'submit'}>Set Price!</button>
            </form>
            </p>
    </div>
  );
}
}

export default Dashboard;
