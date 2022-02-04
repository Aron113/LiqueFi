import React, {Component} from 'react';
import {ethers} from 'ethers';
import liquefifactory_abi from './liquefifactory_abi.json' ;        /////Import factory contract ABI
import liquefi_abi from './liquefi_abi.json';

class Factory extends React.Component {
    componentDidMount(){
      this.getProviderandContract() ;         ///Call this function when component loads to get the Metamask wallet and contract instance
    }
//  constructor(props) {
    // super(props);

     state={
       contractAddress:'0x1922f92ADB14022465Fe28ABa31DA747F5D32AA3',
       ContractInstance:'',
       ArrayLiquefiContracts:[],
       ArrayUsersContracts:[],
     };

//}



async getProviderandContract () {
  ////////////Connecting to User's account/////////////
  let Provider = new ethers.providers.Web3Provider(window.ethereum);
  await Provider.send("eth_requestAccounts", []);
    console.log('This is the Provider:', Provider);
  let Signer = Provider.getSigner();
    console.log('This is the Signer:', Signer);

/////////Getting an instance of the contract////////////
  let ContractInstance = new ethers.Contract((this.state.contractAddress), liquefifactory_abi, Signer);
    console.log('This is the ContractInstance:',ContractInstance);
  await this.setState({ContractInstance:ContractInstance});
    console.log(this.state.ContractInstance)

////////Retrieving the list of liquefi contracts//////////
    let ArrayofLiquefiContracts = await this.state.ContractInstance.viewLiquefiContracts();
     this.setState({ArrayLiquefiContracts:ArrayofLiquefiContracts})
}

//////////Function Mapping//////////////////////
viewLiquefiContracts = async()=> {
  let ArrayofLiquefiContracts = await this.state.ContractInstance.viewLiquefiContracts();
   this.setState({ArrayLiquefiContracts:ArrayofLiquefiContracts})
}

viewusercontracts = async(event)=> {
  try{
    event.preventDefault()
    let viewusercontractsarray = await this.state.ContractInstance.viewusercontracts(event.target.Address.value)
    await console.log(viewusercontractsarray);
    this.setState({ArrayUsersContracts:viewusercontractsarray})
  }
  catch{
    alert('Not a valid address.')
  }
}

startLiqueFi =async(event)=>{
  try{
    event.preventDefault()
    let start = await this.state.ContractInstance.startLiqueFi(event.target.LendingPoolAddress.value, event.target.TokenAddress.value, event.target.Ratemode.value)
  }
  catch{
  alert('Please enter correct inputs.')
  }
}

////////////////Front End///////////////////////
render(){
  return (
    <div>
      <h1>The Factory</h1>
      <button onClick={this.viewLiquefiContracts}>Get list of contracts</button>
        <ol>{this.state.ArrayLiquefiContracts.map(x=><li>{x}</li>)}</ol>
        <br/><br/>

            <p>
              <form onSubmit={this.viewusercontracts}>
                <input id='Address' type='text' placeholder='Address...'/>
                <button type={'submit'}>Find User's Contracts</button>
              </form>
              <ol>{this.state.ArrayUsersContracts.map(x=><li>{x}</li>)}</ol>
            </p>

                <br/><br/>
            <p><b>Create a LiqueFi contract below</b>
              <form onSubmit={this.startLiqueFi}>
              <ul>
              <li><input id='LendingPoolAddress' type='text' placeholder='LendingPoolAddress...'/></li>
                <li><input id='TokenAddress' type='text' placeholder='TokenAddress...'/></li>
                <li><input id='Ratemode' type='text' placeholder='Ratemode...'/></li>
                </ul>
                <button type={'submit'}>Start LiqueFi Contract!</button>
              </form>
            </p>
    </div>
  );
}
}

export default Factory;
