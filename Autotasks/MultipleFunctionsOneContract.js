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

    //List of contract address to be called

var ContractAddress='0x90981De63F0cc3cAF413CA1c3774E53658F0Cb98';
exports.handler =  function(credentials) {                                                                    //Get the credentials, don't need to touch this!
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' });              
  return exports.main(signer);
}

exports.main = async function(signer) {
                                                                         //Looping through the list of contract addresses
  const instance = new ethers.Contract(ContractAddress, ERC20_ABI, signer);                              //Getting an instance of the contract for the specific x


try{                                                           //Use try and catch to handle contracts that give errors, continue the loop after catch
    const tx = instance.setx('33');                        //Call a function of the contract
    const lolo = instance.sety('33');                        //Call a function of the contract
    
}
  catch{
    console.log('This function didnt work for');
}



}
