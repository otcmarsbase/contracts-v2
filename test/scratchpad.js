let accounts = await web3.eth.getAccounts();

let userAddress = accounts[0];

let dex = await MarsBaseExchange.new();
let testcoin = await TestToken.new();
let usdt = await USDTCoin.new();

let initialBalanceUser = await testcoin.balanceOf(userAddress);
console.log("User Token Balance before Offer Creation: " + initialBalanceUser.toString());

await testcoin.approve(dex.address, 100000 * 10 ** 10)

await dex.createOffer(testcoin.address, usdt.address, 50 * 10 ** 10, 1, userAddress, {gas: 1000000});

dexBalance = await testcoin.balanceOf(dex.address);
console.log("Token Balance (MarsBase Contract): " + dexBalance.toString());
let endBalanceUser = await testcoin.balanceOf(userAddress);
console.log("User Token Balance after Offer Creation: " + endBalanceUser.toString());