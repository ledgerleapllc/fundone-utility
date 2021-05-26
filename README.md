# fundone-utility
Skyway FundOne Utility

### Setup
This project uses dotenv (.env) file for configuration. Please copy '.env.example' to '.env' and adjust configuration values to begin using. You will need an **Infura API key**, the fund's **send-from address**, and **secret key**. Like the following:

	INFURA_API_KEY=abc123
	CONTRACT_ADDRESS=0xa6301A5973b7FCb170BAD0042D642b8F18A825d5
	SEND_FROM_ADDRESS=0xsendfromaddress
	SEND_FROM_SECRETKEY=0xsendfromprivatekey

`
$ npm install
`

### Create a wallet

`
$ npm run -s create
`

### Send tokens
Specify the send-to address, then the amount.

`
$ npm run sendto <address> <amount>
`