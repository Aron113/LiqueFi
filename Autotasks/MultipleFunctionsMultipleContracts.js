const { ethers } = require("ethers");
const { DefenderRelaySigner, DefenderRelayProvider } = require('defender-relay-client/lib/ethers');


const LIQUEFI_ABI =[
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "description",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint80",
				"name": "_roundId",
				"type": "uint80"
			}
		],
		"name": "getRoundData",
		"outputs": [
			{
				"internalType": "uint80",
				"name": "roundId",
				"type": "uint80"
			},
			{
				"internalType": "int256",
				"name": "answer",
				"type": "int256"
			},
			{
				"internalType": "uint256",
				"name": "startedAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "updatedAt",
				"type": "uint256"
			},
			{
				"internalType": "uint80",
				"name": "answeredInRound",
				"type": "uint80"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "latestRoundData",
		"outputs": [
			{
				"internalType": "uint80",
				"name": "roundId",
				"type": "uint80"
			},
			{
				"internalType": "int256",
				"name": "answer",
				"type": "int256"
			},
			{
				"internalType": "uint256",
				"name": "startedAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "updatedAt",
				"type": "uint256"
			},
			{
				"internalType": "uint80",
				"name": "answeredInRound",
				"type": "uint80"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "version",
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

var ContractAddressList=['0x18a5572f6617bb704606d76B2a22635c990c2BdC'];     //List of contract address to be called
//let hello=[];
//const ccc='0x1dA5a4f0885D678fE84e0f4Ea313D6ae99fBD2AB';
exports.handler =  function(credentials) {                                                                    //Get the credentials, don't need to touch this!
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' });              
  return exports.main(signer);
}

exports.main = async function(signer) {
  for (let x in ContractAddressList){                                                                       //Looping through the list of contract addresses
  const instance = new ethers.Contract(ContractAddressList[x], LIQUEFI_ABI, signer);                              //Getting an instance of the contract for the specific x

 try{  const tx = await instance.ContractList(); 
     const lol = await instance.repayLoanfromCurrentBalance();                                                     //Use try and catch to handle contracts that give errors, continue the loop after catch
    ContractAddressList.push(tx);
    }                  //Call a function of the contract
   
catch{}
	
}
return ContractAddressList;
}
