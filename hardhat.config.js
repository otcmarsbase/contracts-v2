/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const { task } = require('hardhat/config');

require("dotenv").config()

const mnemonic = process.env.MNEMONIC
const infuraId = process.env.INFURA_ID
const etherscanKey = process.env.ETHERSCAN
const privateKey = process.env.PRIVATE_KEY

const accounts = mnemonic ? { mnemonic } : privateKey ? [ privateKey ] : undefined

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-etherscan");
require('@typechain/hardhat');
require("hardhat-gas-reporter");
require('hardhat-contract-sizer');

task("deploy", "Deploys the contract").setAction(async () => {
  const MarsBase = await await ethers.getContractFactory("MarsBase");

  console.log("Deploying Contract Library...")
  m = await MarsBase.deploy();

  const MarsBaseExchange = await ethers.getContractFactory("MarsBaseExchange", {
    libraries: {
      MarsBase: m.address
    }
  });

  console.log("Deploying Exchange Contract...")
  dex = await MarsBaseExchange.deploy();

  console.log("Address Marsbase Library: ", m.address);
  console.log("Address Marsbase Exchange: ", dex.address);
});

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
    apiKey: etherscanKey
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
