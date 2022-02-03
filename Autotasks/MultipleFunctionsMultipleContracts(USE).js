const { ethers } = require("ethers");
const { DefenderRelaySigner, DefenderRelayProvider } = require('defender-relay-client/lib/ethers');


const LIQUEFI_ABI =[            //Contract ABI
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "lendingpool",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenaddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "ratemode",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "factoryaddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "ContractList",
		"outputs": [
			{
				"internalType": "contract Liquefi[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "Factoryaddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "currentBalance",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "depositERC20",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "mintAmount",
				"type": "uint256"
			}
		],
		"name": "farm",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLatestPrice",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lendingPool",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "mintedAmount",
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
		"name": "priceSet",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "rateMode",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "redeemAmount",
				"type": "uint256"
			}
		],
		"name": "redeemFromFarm",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "repayLoanfromCurrentBalance",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "repayLoanfromFarm",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "setprice",
				"type": "int256"
			}
		],
		"name": "setPrice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "state",
		"outputs": [
			{
				"internalType": "enum Liquefi.State",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "user",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdrawERC20",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

var ContractAddressList=['0x1f244B8FcEbA8d14C2F40f7E3D816C9C9a3FA489'];     //Array of contract address to be called, NEED TO HAVE AT LEAST 1 EXISTING CONTRACT ALREADY DEPLOYED FOR THE RELAYER TO WORK

exports.handler =  function(credentials) {                                                                    //Get the credentials, don't need to touch this!
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' });              
  return exports.main(signer);
}

exports.main = async function(signer) {
  for (let x in ContractAddressList){                                                                       //Looping through the list of contract addresses
  	const instance = new ethers.Contract(ContractAddressList[x], LIQUEFI_ABI, signer);                 //Getting an instance of the contract for the specific x

 	try{  const newarray = await instance.ContractList();  					 //Getting array of contracts
      	      await ContractAddressList.push(...newarray);					//Concatenating existing array with the obtained array of contracts
       	      const repayFromCurrentBalance = await instance.repayLoanfromCurrentBalance();     //Calling the repay from current balance function                                             
   	      const repayFromFarm = await instance.repayLoanfromFarm();				//Calling the repay from farm function
       }                  
  
	catch{console.log('not working')
       }
	
  }
return ContractAddressList;	 //See the latest array of contract addresses
}
