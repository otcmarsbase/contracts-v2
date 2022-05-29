# Deploy contract


### How to deploy
1. Make sure all `node_modules` dependencies are installed
2. Set env variables in the `.env` file
3. Deploy library contract with Hardhat
4. Deploy exchange contract with Hardhat
5. Done 😊

### Supported networks

- `local`
- `marsbase`
- `rinkeby`
- `mainnet`

## Deployment

### Install deps

```shell
yarn
```

### Deploy Marsbase Library contract

```shell
yarn hardhat deploy-lib --network marsbase
```

### Deploy Marsbase Exchange contract

```shell
yarn hardhat deploy-exchange --library <LIBRARY_ADDRESS> --network marsbase
```

### (optional) Deploy both contracts in one line

```shell
yarn hardhat deploy-all --network marsbase
```