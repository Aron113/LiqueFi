const { ethers } = require("ethers");
const { DefenderRelaySigner, DefenderRelayProvider } = require('defender-relay-client/lib/ethers');


const ERC20_ABI =[                     //INSERT ABI HERE: NOT NECESSARY TO COPY THE ENTIRE ABI, JUST THE FUNCTION BEING CALLED WILL DO ACTUALLY
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "lol",
				"type": "uint256"
			}
		],
		"name": "sett",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},	
];

const ContractAddressList={1:'0xa19a97B630c64E3910B8F4BF758e0aFb8AdB686B',2:'0x940A199811a2eF690B444A62362727E73726b7FE'};     //List of contract address to be called


exports.handler =  function(credentials) {                                                                    //Get the credentials, don't need to touch this!
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' });              
  return exports.main(signer);
}

exports.main = async function(signer) {
  for (let x in ContractAddressList){                                                                       //Looping through the list of contract addresses
  const instance = new ethers.Contract(ContractAddressList[x], ERC20_ABI, signer);                              //Getting an instance of the contract for the specific x


try{                                                           //Use try and catch to handle contracts that give errors, continue the loop after catch
    const tx = await instance.sett('78');                        //Call a function of the contract
    return tx;
}
  catch{
    console.log('This function didnt work for',list[x]);
}


}}
