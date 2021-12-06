# MarsBase Contracts

Solidity Contracts for MarsBase OTC Exchange

## Repo Setup

```sh
# Clone the repo
git clone https://github.com/otcmarsbase/contracts-v2

# Step into repo
cd contracts-v2

# Install Dependencies
npm i
```

## Local Development Workflow

```sh
# Open a local blockchain for testing
npx truffle develop

# Open a second terminal to compile and deploy the contracts
npx truffle deploy

# Run the unit tests
npx truffle test
```

## Rinkeby/Ropsten testnet Development Workflow
```sh
# Get the mnemonic phrase from the truffle console.
# This is saved to a file to be used by the network's wallet provider.
# Be sure to replace MNEMONIC with the phrase you get when starting the truffle develop command
echo MNEMONIC > .secret

# Add your infura project id to a file
# This is only needed for non-local interaction.
# Again, replace PROJECTID with your Infura project ID.
echo PROJECTID > .infuraid

# Compile and deploy the contracts.
# NETWORKNAME can be either rinkeby or ropsten for now.
npx truffle deploy --network NETWORKNAME
```

## Contract Usage from web3/truffle console
```js
// Get the accounts we have access to
let accounts = await web3.eth.getAccounts();
let userAddress = accounts[0];

// Get contract instances
// There are two ERC20 tokens that are included in the repo for testing
let dex = await MarsBaseExchange.new();
let testcoin = await TestToken.new();
let usdt = await USDTCoin.new();

// If we're using a non-local chain like Rinkeby/Ropsten, dont use the above commands.
// Instead, point the instances at the addresses already deployed.
let dex = await MarsBaseExchange.at("ADDRESS");
let testcoin = await TestToken.at("ADDRESS");
let usdt = await USDTCoin.at("ADDRESS");

// Approve the DEX contract to move our tokens
await testcoin.approve(dex.address, 100000 * 10 ** 10)
await usdt.approve(dex.address, 100000 * 10 ** 10)

// Create an offer
// This can be one of two ways:
// First, with just the coin and payment info
await dex.createOffer(testcoin.address, usdt.address, 50 * 10 ** 10, 10 * 10 ** 10, {gas: 1000000});

// Second, with an added payment address.
// The funds will be sent to this address when the offer is accepted.
let payoutAddress = accounts[1];
await dex.createOffer(testcoin.address, usdt.address, 50 * 10 ** 10, 10 * 10 ** 10, payoutAddress, {gas: 1000000});

// To accept the offer, give the offer ID and amounts in the offer.
await dex.acceptOffer(0, 50 * 10 ** 10, 10 * 10 ** 10);

// To cancel, we just need the offer ID
await dex.cancelOffer(0);
```
