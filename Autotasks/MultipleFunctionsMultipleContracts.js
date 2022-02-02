const { ethers } = require("ethers");
const { DefenderRelaySigner, DefenderRelayProvider } = require('defender-relay-client/lib/ethers');


const ERC20_ABI =[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "z",
				"type": "uint256"
			}
		],
		"name": "setx",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "z",
				"type": "uint256"
			}
		],
		"name": "sety",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "x",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "y",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

var ContractAddressList=['0x1dA5a4f0885D678fE84e0f4Ea313D6ae99fBD2AB','0xAE193A35A118dF0FE5A3503d49EeE14D4AEf89bB'];     //List of contract address to be called
let hello=[];
//const ccc='0x1dA5a4f0885D678fE84e0f4Ea313D6ae99fBD2AB';
exports.handler =  function(credentials) {                                                                    //Get the credentials, don't need to touch this!
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' });              
  return exports.main(signer);
}

exports.main = async function(signer) {
  for (let x in ContractAddressList){                                                                       //Looping through the list of contract addresses
  const instance = new ethers.Contract(ContractAddressList[x], ERC20_ABI, signer);                              //Getting an instance of the contract for the specific x

 try{  const tx = await instance.sety('2333322'); 
     const lol = await instance.setx('1');                                                     //Use try and catch to handle contracts that give errors, continue the loop after catch
    hello.push(tx);
    }                  //Call a function of the contract
   
catch{}
	
}
//return hello;
}
