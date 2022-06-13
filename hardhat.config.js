/**
 * @type import('hardhat/config').HardhatUserConfig
 */
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
