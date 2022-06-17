/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const { expect } = require('chai');
const { task } = require('hardhat/config');

require("dotenv").config()

const mnemonic = process.env.MNEMONIC
const infuraId = process.env.INFURA_ID
const etherscanKey = process.env.ETHERSCAN
const bscscanKey = process.env.BSCSCAN_API_KEY
const privateKey = process.env.PRIVATE_KEY

const accounts = mnemonic ? { mnemonic } : privateKey ? [ privateKey ] : undefined

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-etherscan");
require('@typechain/hardhat');
require("hardhat-gas-reporter");
require('hardhat-contract-sizer');

async function lockContract(libraryAddress, exchangeAddress) {
  const Library = await ethers.getContractFactory("MarsBase");
  let library = Library.attach(libraryAddress);
  const MarsBaseExchange = await ethers.getContractFactory("MarsBaseExchange", {
		libraries: {
			MarsBase: library.address
		}
	});

  const exchange = await MarsBaseExchange.attach(exchangeAddress);

  console.log(`Locking Contract at address ${exchange.address}`);

  let tx = await exchange.migrateContract();
  await tx.wait();

  console.log("Commission disabled!");
}

async function configureNewContract(libraryAddress, exchangeAddress, nextOfferId) {
  console.log(`configureNewContract\n\tlibraryAddress=${libraryAddress}\n\texchangeAddress=${exchangeAddress}\n\tnextOfferId=${nextOfferId}`)
  const Library = await ethers.getContractFactory("MarsBase");
  let library = Library.attach(libraryAddress);
  const MarsBaseExchange = await ethers.getContractFactory("MarsBaseExchange", {
		libraries: {
			MarsBase: library.address
		}
	});

  const exchange = await MarsBaseExchange.attach(exchangeAddress);

  console.log(`Setting last offer ID to ${nextOfferId} on address ${exchange.address}`);

  let tx = await exchange.setNextOfferId(nextOfferId);
  await tx.wait();

  console.log("Contract Configured!");
}


async function disableCommission(libraryAddress, exchangeAddress) {
  const Library = await ethers.getContractFactory("MarsBase");
  let library = Library.attach(libraryAddress);
  const MarsBaseExchange = await ethers.getContractFactory("MarsBaseExchange", {
		libraries: {
			MarsBase: library.address
		}
	});

  const exchange = await MarsBaseExchange.attach(exchangeAddress);

  console.log(`Disabling commission for address ${exchange.address}`);

  let tx = await exchange.setCommissionAddress(ethers.constants.AddressZero);
  await tx.wait();

  console.log("Commission disabled!");
}
async function setMinimumFee(libraryAddress, exchangeAddress, amountInTenthsOfPercent) {
  console.log(`setMinimumFee\nlibrary = ${libraryAddress}\nexchangeAddress = ${exchangeAddress}\nfeeTenths = ${amountInTenthsOfPercent}`)

  expect(libraryAddress?.startsWith("0x"))
  expect(exchangeAddress?.startsWith("0x"))

  const Library = await ethers.getContractFactory("MarsBase");
  let library = Library.attach(libraryAddress);
  const MarsBaseExchange = await ethers.getContractFactory("MarsBaseExchange", {
		libraries: {
			MarsBase: library.address
		}
	});

  const exchange = await MarsBaseExchange.attach(exchangeAddress);

  let fee = parseInt(amountInTenthsOfPercent)/10
  expect(fee).to.be.greaterThanOrEqual(0)
  console.log(`Setting fee ${fee} for address ${exchange.address}`);

  let tx = await exchange.setMinimumFee(amountInTenthsOfPercent);
  await tx.wait();

  console.log(`Fee set to ${fee}!`);
}

async function deployTestTokens(deployer, libraryAddress)
{
  const LOOKS = await ethers.getContractFactory("LOOKS");
  const USDC = await ethers.getContractFactory("USDC");
  const USDT = await ethers.getContractFactory("USDT");

  console.log("Deploying Test Tokens...")
  
  let looks = await LOOKS.deploy();
  let usdc = await USDC.deploy();
  let usdt = await USDT.deploy();

  console.log(`LOOKS Token address: ${looks.address}`);
  console.log(`USDC Token address: ${usdc.address}`);
  console.log(`USDT Token address: ${usdt.address}`);

  await looks.deployed();
  await usdc.deployed();
  await usdt.deployed();

  return [looks.address, usdc.address, usdt.address];
}

async function sendTestTokensToAccount(tokenAddress, account, amount)
{
  // Looks is used, but any ERC20 token would work
  const TOKEN = await ethers.getContractFactory("LOOKS");
  let token = TOKEN.attach(tokenAddress); 
  
  const tx = await token.transfer(account, amount);

  return tx;
}

async function deployLibrary()
{
	const MarsBase = await ethers.getContractFactory("MarsBase")

	console.log("Deploying Contract Library...")
	let m = await MarsBase.deploy()
	console.log(`Marsbase Library address: ${m.address}`)
	return {
		contract: m,
		address: m.address,
	}
}
async function deployExchange(libraryAddress)
{
	const MarsBaseExchange = await ethers.getContractFactory("MarsBaseExchange", {
		libraries: {
			MarsBase: libraryAddress
		}
	});

	console.log("Deploying Exchange Contract...")
	let dex = await MarsBaseExchange.deploy()
	console.log(`Marsbase Exchange address: ${dex.address}`)
	return {
		contract: dex,
		address: dex.address,
	}
}

const weiToEth = (wei) => ethers.utils.formatEther(wei)

const printDeployerInfo = async (print = true) =>
{
	const [deployer] = await ethers.getSigners()
	const getEthBalance = async () => await deployer.getBalance()
	const printEthBalance = async () => console.log(`Account balance: ${weiToEth(await getEthBalance())} ETH (on ${deployer.address})`)
	if (print)
	{
		console.log(`Deploying with the account: ${deployer.address}`)
		await printEthBalance()
	}
	return {
		deployer,
		getEthBalance,
		printEthBalance,
		balance: await getEthBalance(),
	}
}

task("lock-contract", "Lock a deployed contract")
  .addParam("library", "Library Address")
  .addParam("exchange", "Exchange Address")
  .setAction(async (params) => {
    await lockContract(params.library, params.exchange);
  });

task("set-next-offer-id", "Set Next Offer ID for new contract")
  .addParam("library", "Library Address")
  .addParam("exchange", "Exchange Address")
  .addParam("nextofferid", "Next Offer ID")
  .setAction(async (params) => {
	expect(typeof params.nextofferid == "string")
	expect(parseInt(params.nextofferid) + "").equal(params.nextofferid)
    await configureNewContract(params.library, params.exchange, params.nextofferid);
  });

task("disable-commission", "Disable the commission on the exchange contract")
  .addParam("library", "Library Address")
  .addParam("exchange", "Exchange Address")
  .setAction(async (params) => {
    await disableCommission(params.library, params.exchange);
  });

task("set-minimum-fee", "Set minimum fee size on the MarsbaseExchange contract")
  .addParam("library", "Marsbase library contract address")
  .addParam("exchange", "MarsbaseExchange contract address")
  .addParam("fee", "Fee in percent (e.g. '0.5%')")
  .setAction(async (params) => {
	expect(typeof params.fee == "string")
	expect(params.fee.endsWith("%"))

	let feeStr = params.fee.split('%')[0]
	let fee = parseFloat(feeStr)
	expect(fee + "").equal(feeStr)
	expect(fee).to.not.be.NaN
	expect(fee).greaterThanOrEqual(0)
	expect(fee).lessThan(100)
	let feeInTenths = (fee * 10).toFixed(0)

    await setMinimumFee(params.library, params.exchange, feeInTenths);
  });

task("deploy-all", "Deploys both contracts").setAction(async () => {
	const { printEthBalance, balance, getEthBalance } = await printDeployerInfo()
	const { contract: library, address: libraryAddress } = await deployLibrary()
	const { contract: exchange, address: exchangeAddress } = await deployExchange(libraryAddress)
	await library.deployed()
	await exchange.deployed()
	await printEthBalance()
	console.log(`gas spent: ${weiToEth(balance.sub(await getEthBalance()))}`)
});

task("deploy-test-tokens", "Deploys Test Tokens").setAction(async () =>
{
  await deployTestTokens();
  console.log("Test Tokens deployed!");
})

task('send-test-tokens', 'Sends test tokens to account')
  .addParam("tokenAddress", "Token Address")
  .addParam("to", "Address to send tokens to")
  .addParam("amount", "Amount of tokens to send")
  .setAction(async (params) => {

    let tx = await sendTestTokensToAccount(params.tokenAddress, params.to, params.amount);
    console.log("Test Tokens sent! Transaction hash: ", tx.hash);

  });

task("deploy-lib", "Deploys Marsbase Library contract").setAction(async () =>
{
	const { printEthBalance, balance, getEthBalance } = await printDeployerInfo()
	const { contract: library, address: libraryAddress } = await deployLibrary()
	await library.deployed()
	await printEthBalance()
	console.log(`gas spent: ${weiToEth(balance.sub(await getEthBalance()))}`)
})

task("deploy-exchange", "Deploys Marsbase Exchange contract")
	.addParam("library", "Marsbase Library contract")
	.setAction(async params =>
	{
		let libraryAddress = web3.utils.toChecksumAddress(params.library)
		console.log("deploying exchange with library: " + libraryAddress)
		const { printEthBalance, balance, getEthBalance } = await printDeployerInfo()
		const { contract: exchange, address: exchangeAddress } = await deployExchange(libraryAddress)
		await exchange.deployed()
		await printEthBalance()
		console.log(`gas spent: ${weiToEth(balance.sub(await getEthBalance()))}`)
	})

module.exports = {
  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1
      }
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
		mainnet: etherscanKey,
		rinkeby: etherscanKey,
		ropsten: etherscanKey,
		bsc: bscscanKey,
		bscTestnet: bscscanKey,
	}
  },
  contractSizer: {
    disambiguatePaths: true,
    runOnCompile: true,
  },
  typechain: {
    outDir: 'types',
    target: 'web3-v1'
  },
  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    hardhat: {},
    local: {
      url: "http://127.0.0.1:8110",     // Localhost (default: none)
      chainId: 1337,       // Any network (default: none)
      gas: "auto"
    },
    marsbase: {
      accounts,
      url: "http://142.93.160.132:8110",     // Localhost (default: none)
      chainId: 1337,       // Any network (default: none)
      gas: "auto"
    },
    // Another network with more advanced options...
    // advanced: {
    // port: 8777,             // Custom port
    // network_id: 1342,       // Custom network
    // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    // from: <address>,        // Account to send txs from (default: accounts[0])
    // websocket: true        // Enable EventEmitter interface for web3 (default: false)
    // },
    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    ropsten: {
      accounts,
      url: `https://ropsten.infura.io/v3/` + infuraId,
      chainId: 3,       // Ropsten's id
      gas: "auto",        // Ropsten has a lower block limit than mainnet
    },
    rinkeby: {
      accounts,
      url: `https://rinkeby.infura.io/v3/` + infuraId,
      chainId: 4,       // Ropsten's id
      gas: "auto",        // Ropsten has a lower block limit than mainnet
    },
    mainnet: {
      accounts,
      url: `https://mainnet.infura.io/v3/` + infuraId,
      gas: "auto"
    },
	binance: {
		accounts,
		url: `https://rpc.ankr.com/bsc`,
		chainId: 56,
		gas: "auto",
	}
    // Useful for private networks
    // private: {
    // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    // network_id: 2111,   // This network is yours, in the cloud.
    // production: true    // Treats this network as if it was a public net. (default: false)
    // }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  }
};
