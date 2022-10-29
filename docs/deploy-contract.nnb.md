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

It's best to cleanup first, and to install with frozen lockfile:

```sh
rm -rf node_modules
yarn --frozen-lockfile
```

Or you can do a simple yarn install:

```sh
yarn
```

### 3. Cleanup previous builds if they exist

```sh
rm -rf ./artifacts ./cache
```

### 4. Build & test contracts locally

```sh
yarn test
```

### 5. Deploy Marsbase Exchange contract

```sh
export CONTRACT_NETWORK="marsbase"
export EXCHANGE_OFFER_ID="0"
yarn hardhat deploy-exchange --offerid $EXCHANGE_OFFER_ID --network $CONTRACT_NETWORK
```

### 6. Verify Marsbase Exchange source code on Etherscan

```sh
export EXCHANGE_ADDRESS="marsbase exchange address from previous step"
yarn hardhat verify --network $CONTRACT_NETWORK $EXCHANGE_ADDRESS $EXCHANGE_OFFER_ID
```

### 7. Set minimum fee

```sh
yarn hardhat set-minimum-fee --exchange $EXCHANGE_ADDRESS --fee 0.5% --network $CONTRACT_NETWORK
```