# Deploy contract


### How to deploy
1. Make sure all `node_modules` dependencies are installed
2. Set env variables in the `.env` file
3. Deploy library contract with Hardhat
4. Deploy exchange contract with Hardhat
5. Verify library contract code on Etherscan
6. Verify exchange contract code on Etherscan
7. Done 😊

### Supported networks

- `local`
- `marsbase`
- `rinkeby`
- `mainnet`

## Deployment

### 1. Install deps

```shell
yarn
```

### 3. Deploy Marsbase Library contract

```shell
yarn hardhat deploy-lib --network marsbase
```

### 4. Deploy Marsbase Exchange contract

```shell
yarn hardhat deploy-exchange --library <LIBRARY_ADDRESS> --network marsbase
```

### (optional) Deploy both contracts in one line

```shell
yarn hardhat deploy-all --network marsbase
```

### 5. Verify Marsbase Library source code on Etherscan

```shell
yarn hardhat verify --contract contracts/MarsBase.sol:MarsBase --network mainnet <LIBRARY_ADDRESS>
```

### 6. Verify Marsbase Exchange source code on Etherscan

```shell
yarn hardhat verify --contract contracts/MarsBaseExchange.sol:MarsBaseExchange --network mainnet <EXCHANGE_ADDRESS> "<LIBRARY_ADDRESS>"
```