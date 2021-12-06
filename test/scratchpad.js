let accounts = await web3.eth.getAccounts();

let userAddress = accounts[0];

let dex = await MarsBaseExchange.new();
let testcoin = await TestToken.new();
let usdt = await USDTCoin.new();

let initialBalanceUser = await testcoin.balanceOf(userAddress);
console.log("User Token Balance before Offer Creation: " + initialBalanceUser.toString());

await testcoin.approve(dex.address, 100000 * 10 ** 10)
await usdt.approve(dex.address, 100000 * 10 ** 10)

await dex.createOffer(testcoin.address, usdt.address, 50 * 10 ** 10, 10 * 10 ** 10, userAddress, {gas: 1000000});

await dex.cancelOffer(0);

let payoutAddress = accounts[1];

await dex.createOffer(testcoin.address, usdt.address, 50 * 10 ** 10, 10 * 10 ** 10, payoutAddress, {gas: 1000000});

await dex.acceptOffer(1, 50 * 10 ** 10, 10 * 10 ** 10)

dexBalance = await testcoin.balanceOf(dex.address);
console.log("Token Balance (MarsBase Contract): " + dexBalance.toString());
let endBalanceUser = await testcoin.balanceOf(userAddress);
console.log("User Token Balance after Offer Creation: " + endBalanceUser.toString());

// Rinkeby/Ropsten Testnet
// Replace Contract Addresses with those deployed to the test network
let dex = await MarsBaseExchange.at("0x1609a7B3E0a009816f8BEe244c9b329986127773");
let testcoin = await TestToken.at("0x26259369134F375E672104Dd8a4661C550dAE79e");
let usdt = await USDTCoin.at("0x15fC559EbC880D0aA56069E9A230f9f0896A5D9b");

await testcoin.approve(dex.address, 100000 * 10 ** 10)
await usdt.approve(dex.address, 100000 * 10 ** 10)