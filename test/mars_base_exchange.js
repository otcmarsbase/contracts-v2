const MarsBaseExchange = artifacts.require("MarsBaseExchange");
const USDTCoin = artifacts.require("USDTCoin");
const TestToken = artifacts.require("TestToken");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("MarsBaseExchange", async function (accounts) {
  it("should create an offer", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountIn = 50 * 10 ** 10;
    const amountOut = 10 * 10 ** 10;
    
    // Get the user's address
    const userAddress = accounts[0];

    // Get contract instances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();

    // Get Balances of TestToken for both the user and dex contract
    let initialUserTestTokenBalance = await testToken.balanceOf(userAddress);
    let initialDexTestTokenBalance = await testToken.balanceOf(dex.address);

    // Get the total supply and make sure that we have it on  the user account and that the dex doesnt have any balance.
    const testTokenTotalSupply = await testToken.totalSupply();
    assert.equal(initialUserTestTokenBalance.toString(), testTokenTotalSupply.toString());
    assert.equal(initialDexTestTokenBalance.toString(), "0");
    
    // Approve the contract to move our tokens
    await testToken.approve(dex.address, approvalAmount);
    await usdt.approve(dex.address, approvalAmount);

    // Create Offer
    await dex.createOffer(testToken.address, usdt.address, amountIn, amountOut);

    // Get the updated balances, user should be less, dex should have the tokens deposited
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    let finalDexTestTokenBalance = await testToken.balanceOf(dex.address);


    // Get the offer and ensure it's all set correctly
    let offer = await dex.offers(0);

    assert.isTrue(offer.active);
    
    assert.equal(amountIn.toString(), offer.amountIn.toString());
    assert.equal(amountOut.toString(), offer.amountOut.toString());
    
    assert.equal(userAddress, offer.offerer);
    assert.equal(userAddress, offer.payoutAddress);

    assert.equal(testToken.address, offer.tokenIn);
    assert.equal(usdt.address, offer.tokenOut);

    // Finally validate that the user and dex balances are correct.

    assert.equal(finalUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountIn).toLocaleString('fullwide', {useGrouping:false}));
    assert.equal(finalDexTestTokenBalance.toString(), amountIn.toString());

    return;
  });

  it("should cancel an order", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountIn = 50 * 10 ** 10;
    const amountOut = 10 * 10 ** 10;

    // Get the user's address
    const userAddress = accounts[0];
    
    // Get Contract Instances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();

    // Approve token transfers
    await testToken.approve(dex.address, approvalAmount);
    await usdt.approve(dex.address, approvalAmount);

    // Get users balance and total supply of TestToken
    let initialUserTestTokenBalance = await testToken.balanceOf(userAddress);
    const testTokenTotalSupply = await testToken.totalSupply();
    
    // Check that it's all assigned to us
    assert.equal(initialUserTestTokenBalance.toString(), testTokenTotalSupply.toString());

    // Create the offer
    await dex.createOffer(testToken.address, usdt.address, amountIn, amountOut);

    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountIn).toLocaleString('fullwide', {useGrouping:false}));

    // Ensure the offer is active
    let offer = await dex.offers(0);
    assert.isTrue(offer.active);

    // Cancel the offer, thus returning everything to its initial state
    await dex.cancelOffer(0);

    // Get the offer again, this time after it's been cancelled.
    let cancelledOffer = await dex.offers(0);

    // Ensure it's no longer active and the amount in is 0
    assert.isFalse(cancelledOffer.active);
    assert.equal(cancelledOffer.amountIn.toString(), "0");
    assert.equal(cancelledOffer.amountOut.toString(), "0");
    assert.equal(cancelledOffer.tokenIn, "0x0000000000000000000000000000000000000000");
    assert.equal(cancelledOffer.tokenOut, "0x0000000000000000000000000000000000000000");
    assert.equal(cancelledOffer.offerer, "0x0000000000000000000000000000000000000000");
    assert.equal(cancelledOffer.payoutAddress, "0x0000000000000000000000000000000000000000");

    // FInally make sure the tokens are returned to the user
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(finalUserTestTokenBalance.toString(), initialUserTestTokenBalance.toString());

    return;
    
  });

  it("should complete an order", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountIn = 50 * 10 ** 10;
    const amountOut = 10 * 10 ** 10;

    // Get the user's address
    const userAddress = accounts[0];
    
    // Get Contract Instances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();

    // Approve token transfers
    await testToken.approve(dex.address, approvalAmount);
    await usdt.approve(dex.address, approvalAmount);

    // Get users balance and total supply of TestToken and USDT
    let initialUserTestTokenBalance = await testToken.balanceOf(userAddress);
    const testTokenTotalSupply = await testToken.totalSupply();

    let initialUserUSDTBalance = await usdt.balanceOf(userAddress);
    const usdtTotalSupply = await usdt.totalSupply();

    // Check that it's all assigned to us
    assert.equal(initialUserTestTokenBalance.toString(), testTokenTotalSupply.toString());
    assert.equal(initialUserUSDTBalance.toString(), usdtTotalSupply.toString());

    // Create the offer
    await dex.createOffer(testToken.address, usdt.address, amountIn, amountOut);

    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountIn).toLocaleString('fullwide', {useGrouping:false}));

    // Get USDT balance and ensure it's unchanged
    let createdUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(createdUserUSDTBalance.toString(), initialUserUSDTBalance.toString());

    // Ensure the offer is active
    let offer = await dex.offers(0);
    assert.isTrue(offer.active);

    // Cancel the offer, thus returning everything to its initial state
    await dex.acceptOffer(0, amountIn, amountOut);

    // Get the offer again, this time after it's been cancelled.
    let acceptedOffer = await dex.offers(0);

    // Ensure it's no longer active and the amount in/out is 0
    assert.isFalse(acceptedOffer.active);
    assert.equal(acceptedOffer.amountIn.toString(), "0");
    assert.equal(acceptedOffer.amountOut.toString(), "0");
    assert.equal(acceptedOffer.tokenIn, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.tokenOut, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.offerer, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.payoutAddress, "0x0000000000000000000000000000000000000000");

    // FInally make sure the tokens are moved to their proper places
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(finalUserTestTokenBalance.toString(), initialUserTestTokenBalance.toString());

    let finalUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(finalUserUSDTBalance.toString(), initialUserUSDTBalance.toString());

    return;
    
  });
});