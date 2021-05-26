var http = require('http');
var Tx = require('ethereumjs-tx').Transaction;
var fs = require('fs');
var abifile = 'abi.json';
var dotenv = require('dotenv').config();
var appname = process.env.APP_NAME;
var apikey = process.env.INFURA_API_KEY;
var sendfromaddress = process.env.SEND_FROM_ADDRESS;
var sendfromkey = process.env.SEND_FROM_SECRETKEY;
var contract_address = process.env.CONTRACT_ADDRESS;
var Regex = require("regex");
var eth_regex = /^0x[a-fA-F0-9]{40}$/;
var ethsecret_regex1 = /^[a-fA-F0-9]{64}$/;
var ethsecret_regex2 = /^0x[a-fA-F0-9]{66}$/;
var ethereum = require('eth-crypto');
var Web3 = require('web3');
var web3 = new Web3(
	new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/" + apikey)
);

try {
	var abi = fs.readFileSync(abifile, 'utf8');
	var abijson = JSON.parse(abi);
} catch(err) {
	console.log(err);
	console.log("Could not find the contract ABI. Please make sure the file 'abi.json' exists and contains valid ABI JSON data in the root directory of this utility.");
	process.exit(1);
}

var argv = process.argv;
var command = argv[2] ? argv[2] : null;
var sendtoaddress = argv[3] ? argv[3] : null;
var amount = argv[4] ? argv[4] : null;

if(
	command === null ||
	command == 'createwallet'
) {
	console.log(ethereum.createIdentity());
	process.exit(0);
}

if(command == 'sendto') {
	send();
}

async function send() {
	if(
		!sendtoaddress ||
		!eth_regex.test(sendtoaddress)
	) {
		console.log("Please provide a valid Ethereum address to send Skyway tokens");
		process.exit(2);
	}

	if(
		!amount ||
		parseInt(amount) == 0
	) {
		console.log("Please provide an amount of Skyway tokens to send");
		process.exit(2);
	}

	amount = parseInt(amount);
	// amount = amount * Math.pow(10, 18);

	try {
		var SkywayContract = new web3.eth.Contract(abijson, contract_address);
		var privateKey = new Buffer.from(sendfromkey, 'hex');
		var nonce = await web3.eth.getTransactionCount(sendfromaddress);
		var gasPrice = await web3.eth.getGasPrice();
		
		var txParams = {
			nonce: web3.utils.toHex(nonce),
			gasPrice: web3.utils.toHex(gasPrice),
			gasLimit: web3.utils.toHex(400000),
			from: sendfromaddress,
			to: contract_address,
			value: '0x00',
			data: SkywayContract.methods.transfer(
				sendtoaddress, 
				amount
			).encodeABI(),
			chainId: '0x04'
		};

		var tx = new Tx(
			txParams,
			// { 
			// 	chain: 'rinkeby',
			// 	hardfork: 'petersburg'
			// }
		);

		// tx.v = Buffer.from(['0x04']);
		tx.sign(privateKey);
		var serializedTx = tx.serialize();

		var txhash = await web3.eth.sendSignedTransaction(
			'0x' + serializedTx.toString('hex')
		);

		console.log(txhash);
		process.exit(0);
		
	} catch(err) {
		console.log(err);
		process.exit(3);
	}
}
