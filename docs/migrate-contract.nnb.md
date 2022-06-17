# Migrate contract


### How to migrate
1. **`NEW`** [Deploy new contract](./deploy-contract.nnb)
2. **`NEW`** Configure minimum fee size on the new contract (same as old contract)
3. **`NEW`** Configure comission wallet on the new contract (same as old contract)
4. **`NEW`** Configure comission exchanger on the new contract (same as old contract)
5. *`OLD`* Stop all trading on the old contract
6. **`NEW`** Set next offer id on the new contract based on last offer id
7. *`OLD`* Check that no tokens are left on the old contract
8. Done 😊

## Migration

### 1. **`NEW`** Deploy new contract
See [deploy-contract.nnb](./deploy-contract.nnb.md)

### 2. **`NEW`** Configure minimum fee size on the new contract (same as old contract)

Check old contract fee
```
<<< TODO >>>
```

Set new contract fee
```
yarn hardhat set-minimum-fee --library <LIBRARY_ADDRESS> --exchange <EXCHANGE_ADDRESS> --fee 0.5% --network marsbase
```

### 3. **`NEW`** Configure comission wallet on the new contract (same as old contract)

```
<<< TODO >>>
```

### 4. **`NEW`** Configure comission exchanger on the new contract (same as old contract)

```
<<< TODO >>>
```

### 5. *`OLD`* Stop all trading on the old contract

```
yarn hardhat lock-contract --library <LIBRARY_ADDRESS> --exchange <EXCHANGE_ADDRESS> --network marsbase
```

### 6. **`NEW`** Set next offer id on the new contract based on last offer id

#### Get last offer id from the old contract

`getNextOfferId` on Etherscan/Bscscan

```
<<< TODO: script >>>
```

#### Set new offer id on the new contract

```
yarn hardhat set-next-offer-id \
	--library <LIBRARY_ADDRESS> \
	--exchange <EXCHANGE_ADDRESS> \
	--nextofferid <NEXT_OFFER_ID> \
	--network marsbase
```
yarn hardhat set-next-offer-id \
	--library 0x6175D87cfC246B70fEc59d219dc5D55364B8dB0e \
	--exchange 0x307db295E5A0D73df1Ed6D6b900899E983b77a58 \
	--nextofferid 19 \
	--network rinkeby

### 7. *`OLD`* Check that no tokens are left on the old contract

```
<<< TODO >>>
```

### 8. Done 😊