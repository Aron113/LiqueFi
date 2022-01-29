const { ethers } = require("ethers");
const { DefenderRelaySigner, DefenderRelayProvider } = require('defender-relay-client/lib/ethers');

// Inline ABI of the contract we'll be interacting with (check out the rollup example for a better way to handle this!)
const ERC20_ABI =[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "lol",
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
		"name": "motherrepayer1",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "motherrepayer2",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "motherrepayer3",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];


// Main function, exported separately for testing
exports.main = async function(signer, recipient, contractAddress) {
  // Create contract instance from the relayer signer
  const simple = new ethers.Contract(contractAddress, ERC20_ABI, signer);

  // Check relayer balance via the Defender network provider


  // Send funds to recipient if non zero

    const tx = await simple.motherrepayer1();
    console.log(`ssss`);
    return tx;

}
// Entrypoint for the Autotask
exports.handler = async function(credentials) {
  // Initialize defender relayer provider and signer
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' });
  const contractAddress = '0x3A9d305D7403EC523F1C472eC1C040623640BED2'; // LiqueFi contract address
  return exports.main(signer, await signer.getAddress(), contractAddress); 
}

// To run locally (this code will not be executed in Autotasks)
if (require.main === module) {
  require('dotenv').config();
  const { API_KEY: apiKey, API_SECRET: apiSecret } = process.env;
  exports.handler({ apiKey, apiSecret })
    .then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}
