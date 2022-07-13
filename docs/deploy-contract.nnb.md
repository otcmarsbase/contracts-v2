# Deploy contract


### How to deploy
1. Make sure all `node_modules` dependencies are installed
2. Set env variables in the `.env` file
3. Cleanup previous builds if they exist
4. Build & test contracts locally
5. Deploy exchange contract with Hardhat
6. Verify exchange contract code on Etherscan
7. Set minimum fee
8. Done 😊

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

It's best to cleanup first, and to install with frozen lockfile:

```shell
rm -rf node_modules
yarn --frozen-lockfile
```

### 3. Cleanup previous builds if they exist

```shell
rm -rf ./artifacts ./cache
```

### 4. Build & test contracts locally

```shell
yarn test
```

### 5. Deploy Marsbase Exchange contract

```shell
yarn hardhat deploy-exchange --offerid 0 --network marsbase
```

### 6. Verify Marsbase Exchange source code on Etherscan

```shell
yarn hardhat verify --network mainnet <EXCHANGE_ADDRESS> <startOfferId>
```

### 7. Set minimum fee

```
yarn hardhat set-minimum-fee --exchange <EXCHANGE_ADDRESS> --fee 0.5% --network marsbase
```