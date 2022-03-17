/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();
const infuraId = fs.readFileSync(".infuraid").toString().trim();

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");
require('@typechain/hardhat');
require("hardhat-gas-reporter");
require('hardhat-contract-sizer');

module.exports = {
  solidity: {
    version: "0.8.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1
      }
    }
  },
  contractSizer: {
    disambiguatePaths: true,
    runOnCompile: true,
  },
  typechain: {
    outDir: 'types',
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
      accounts: {
        mnemonic: mnemonic,
      },
      url: `https://ropsten.infura.io/v3/` + infuraId,
      chainId: 3,       // Ropsten's id
      gas: "auto",        // Ropsten has a lower block limit than mainnet
    },
    rinkeby: {
      accounts: {
        mnemonic: mnemonic,
      },
      url: `https://rinkeby.infura.io/v3/` + infuraId,
      chainId: 4,       // Ropsten's id
      gas: "auto",        // Ropsten has a lower block limit than mainnet
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
