const MarsBaseExchange = artifacts.require("MarsBaseExchange");
const USDTCoin = artifacts.require("USDTCoin");
const TestToken = artifacts.require("TestToken");
const EPICCoin = artifacts.require("EPICCoin");

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
    const amountOut = [10 * 10 ** 10, 20 * 10 ** 10];
    const smallestChunkSize = 1 * 10 ** 10;
    
    // Get the user's address
    const userAddress = accounts[0];

    // Get contract instances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();
    let epicCoin = await EPICCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensIn = [usdt.address, epicCoin.address];

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
    await epicCoin.approve(dex.address, approvalAmount);

    // Create Offer
    await dex.createOffer(testToken.address, tokensIn, amountIn, amountOut, smallestChunkSize);

    // Get the updated balances, user should be less, dex should have the tokens deposited
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    let finalDexTestTokenBalance = await testToken.balanceOf(dex.address);

    // Get the offer and ensure it's all set correctly
    let offer = await dex.getOffer(0);

    assert.isTrue(offer.active);
    console.log(offer);
    assert.equal(amountIn.toString(), offer.amountIn.toString());
    assert.equal(amountOut[0].toString(), offer.amountOut[0].toString());
    assert.equal(amountOut[1].toString(), offer.amountOut[1].toString());
    
    assert.equal(userAddress, offer.offerer);
    assert.equal(userAddress, offer.payoutAddress);

    assert.equal(testToken.address, offer.tokenIn);
    assert.equal(usdt.address, offer.tokenOut[0]);
    assert.equal(epicCoin.address, offer.tokenOut[1]);

    // Finally validate that the user and dex balances are correct.

    assert.equal(finalUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountIn).toLocaleString('fullwide', {useGrouping:false}));
    assert.equal(finalDexTestTokenBalance.toString(), amountIn.toString());

    return;
  });

  it("should calculate a fixed amount of tokens for a partial order", async function () {
    // Define Constants
    const amountIn = 5 * 10 ** 10;
    const amountOut = 1 * 10 ** 10;
    const chunkSize = 0.1 * 10 ** 10;
    const expectedTokensOut = amountIn / amountOut * chunkSize;
    
    // Get Contract Instances
    let dex = await MarsBaseExchange.new();

    let price = await dex.price(amountIn, amountOut, chunkSize);

    console.log(price.toString());
    assert.equal(price.toString(), expectedTokensOut.toString());
  });

  it("should calculate a fixed amount of tokens for a full order", async function () {
    // Define Constants
    const amountIn = 5 * 10 ** 10;
    const amountOut = 1 * 10 ** 10;
    const chunkSize = 1 * 10 ** 10;
    const expectedTokensOut = amountIn / amountOut * chunkSize;
    
    // Get Contract Instances
    let dex = await MarsBaseExchange.new();

    let price = await dex.price(amountIn, amountOut, chunkSize);

    console.log(price.toString());
    assert.equal(price.toString(), expectedTokensOut.toString());
  });




  it("should cancel an order", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountIn = 50 * 10 ** 10;
    const amountOut = [10 * 10 ** 10];
    const smallestChunkSize = 1 * 10 ** 10;

    // Get the user's address
    const userAddress = accounts[0];
    
    // Get Contract Instances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();

    let tokensOut = [usdt.address];

    // Approve token transfers
    await testToken.approve(dex.address, approvalAmount);
    await usdt.approve(dex.address, approvalAmount);

    // Get users balance and total supply of TestToken
    let initialUserTestTokenBalance = await testToken.balanceOf(userAddress);
    const testTokenTotalSupply = await testToken.totalSupply();
    
    // Check that it's all assigned to us
    assert.equal(initialUserTestTokenBalance.toString(), testTokenTotalSupply.toString());

    // Create the offer
    await dex.createOffer(testToken.address, tokensOut, amountIn, amountOut, smallestChunkSize);

    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountIn).toLocaleString('fullwide', {useGrouping:false}));

    // Ensure the offer is active
    let offer = await dex.getOffer(0);
    assert.isTrue(offer.active);

    // Cancel the offer, thus returning everything to its initial state
    await dex.cancelOffer(0);

    // Get the offer again, this time after it's been cancelled.
    let cancelledOffer = await dex.getOffer(0);

    // Ensure it's no longer active and the amount in is 0
    assert.isFalse(cancelledOffer.active);
    assert.equal(cancelledOffer.amountIn.toString(), "0");
    assert.equal(cancelledOffer.amountOut.length, 0);
    assert.equal(cancelledOffer.tokenIn, "0x0000000000000000000000000000000000000000");
    assert.equal(cancelledOffer.tokenOut.length, 0);
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
    const amountOut = [10 * 10 ** 10, 20 * 10 ** 10];
    const smallestChunkSize = 1 * 10 ** 10;

    // Get the user's address
    const userAddress = accounts[0];
    
    // Get Contract Instances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();
    let epicCoin = await EPICCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensOut = [usdt.address, epicCoin.address];

    // Approve token transfers
    await testToken.approve(dex.address, approvalAmount);
    await usdt.approve(dex.address, approvalAmount);
    await epicCoin.approve(dex.address, approvalAmount);

    // Get users balance and total supply of TestToken and USDT
    let initialUserTestTokenBalance = await testToken.balanceOf(userAddress);
    const testTokenTotalSupply = await testToken.totalSupply();

    let initialUserUSDTBalance = await usdt.balanceOf(userAddress);
    const usdtTotalSupply = await usdt.totalSupply();

    // Check that it's all assigned to us
    assert.equal(initialUserTestTokenBalance.toString(), testTokenTotalSupply.toString());
    assert.equal(initialUserUSDTBalance.toString(), usdtTotalSupply.toString());

    // Create the offer
    await dex.createOffer(testToken.address, tokensOut, amountIn, amountOut, smallestChunkSize);

    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountIn).toLocaleString('fullwide', {useGrouping:false}));

    // Get USDT balance and ensure it's unchanged
    let createdUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(createdUserUSDTBalance.toString(), initialUserUSDTBalance.toString());

    // Ensure the offer is active
    let offer = await dex.getOffer(0);
    assert.isTrue(offer.active);

    // Cancel the offer, thus returning everything to its initial state
    await dex.acceptOffer(0, tokensOut[1], amountIn, amountOut[1]);

    // Get the offer again, this time after it's been cancelled.
    let acceptedOffer = await dex.getOffer(0);

    // Ensure it's no longer active and the amount in/out is 0
    assert.isFalse(acceptedOffer.active);
    assert.equal(acceptedOffer.amountIn.toString(), "0");
    assert.equal(acceptedOffer.amountOut.length, 0);
    assert.equal(acceptedOffer.tokenIn, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.tokenOut.length, 0);
    assert.equal(acceptedOffer.offerer, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.payoutAddress, "0x0000000000000000000000000000000000000000");

    // FInally make sure the tokens are moved to their proper places
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(finalUserTestTokenBalance.toString(), initialUserTestTokenBalance.toString());

    let finalUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(finalUserUSDTBalance.toString(), initialUserUSDTBalance.toString());

    return;
    
  });

  it("should accept part of an order", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountIn = 50 * 10 ** 10;
    const amountOut = [10 * 10 ** 10, 20 * 10 ** 10];
    const smallestChunkSize = 1 * 10 ** 10;

    // Get the user's address
    const userAddress = accounts[0];
    
    // Get Contract Instances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();
    let epicCoin = await EPICCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensOut = [usdt.address, epicCoin.address];

    // Approve token transfers
    await testToken.approve(dex.address, approvalAmount);
    await usdt.approve(dex.address, approvalAmount);
    await epicCoin.approve(dex.address, approvalAmount);

    // Get users balance and total supply of TestToken and USDT
    let initialUserTestTokenBalance = await testToken.balanceOf(userAddress);
    const testTokenTotalSupply = await testToken.totalSupply();

    let initialUserUSDTBalance = await usdt.balanceOf(userAddress);
    const usdtTotalSupply = await usdt.totalSupply();

    // Check that it's all assigned to us
    assert.equal(initialUserTestTokenBalance.toString(), testTokenTotalSupply.toString());
    assert.equal(initialUserUSDTBalance.toString(), usdtTotalSupply.toString());

    // Create the offer
    await dex.createOffer(testToken.address, tokensOut, amountIn, amountOut, smallestChunkSize);

    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountIn).toLocaleString('fullwide', {useGrouping:false}));

    // Get USDT balance and ensure it's unchanged
    let createdUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(createdUserUSDTBalance.toString(), initialUserUSDTBalance.toString());

    // Ensure the offer is active
    let offer = await dex.getOffer(0);
    assert.isTrue(offer.active);

    // Cancel the offer, thus returning everything to its initial state
    await dex.acceptOfferPart(0, tokensOut[0], smallestChunkSize);

    // Get the offer again, this time after it's been cancelled.
    let acceptedOffer = await dex.getOffer(0);

    console.log(acceptedOffer);

    const conversionnRate = amountIn / amountOut[0];

    // Ensure it's no longer active and the amount in/out is 0
    assert.isTrue(acceptedOffer.active);
    assert.equal(acceptedOffer.amountIn.toString(), amountIn);
    assert.equal(acceptedOffer.amountRemaining.toString(), amountIn - (smallestChunkSize * conversionnRate));
    assert.equal(acceptedOffer.amountOut.length, 2);
    assert.equal(acceptedOffer.tokenIn, testToken.address);
    assert.equal(acceptedOffer.tokenOut.length, 2);
    assert.equal(acceptedOffer.offerer, userAddress);
    assert.equal(acceptedOffer.payoutAddress, userAddress);

    // FInally make sure the tokens are moved to their proper places
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(finalUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountIn + (smallestChunkSize * conversionnRate)).toLocaleString('fullwide', {useGrouping:false}));

    let finalUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(finalUserUSDTBalance.toString(), initialUserUSDTBalance.toString());

    return;
    
  });

  it("should close the order if all of an order is requested for part of an order", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountIn = 50 * 10 ** 10;
    const amountOut = [10 * 10 ** 10, 20 * 10 ** 10];
    const smallestChunkSize = 1 * 10 ** 10;

    // Get the user's address
    const userAddress = accounts[0];
    
    // Get Contract Instances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();
    let epicCoin = await EPICCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensOut = [usdt.address, epicCoin.address];

    // Approve token transfers
    await testToken.approve(dex.address, approvalAmount);
    await usdt.approve(dex.address, approvalAmount);
    await epicCoin.approve(dex.address, approvalAmount);

    // Get users balance and total supply of TestToken and USDT
    let initialUserTestTokenBalance = await testToken.balanceOf(userAddress);
    const testTokenTotalSupply = await testToken.totalSupply();

    let initialUserUSDTBalance = await usdt.balanceOf(userAddress);
    const usdtTotalSupply = await usdt.totalSupply();

    // Check that it's all assigned to us
    assert.equal(initialUserTestTokenBalance.toString(), testTokenTotalSupply.toString());
    assert.equal(initialUserUSDTBalance.toString(), usdtTotalSupply.toString());

    // Create the offer
    await dex.createOffer(testToken.address, tokensOut, amountIn, amountOut, smallestChunkSize);

    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountIn).toLocaleString('fullwide', {useGrouping:false}));

    // Get USDT balance and ensure it's unchanged
    let createdUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(createdUserUSDTBalance.toString(), initialUserUSDTBalance.toString());

    // Ensure the offer is active
    let offer = await dex.getOffer(0);
    assert.isTrue(offer.active);

    // Cancel the offer, thus returning everything to its initial state
    await dex.acceptOfferPart(0, tokensOut[0], amountOut[0]);

    // Get the offer again, this time after it's been cancelled.
    let acceptedOffer = await dex.getOffer(0);

    console.log(acceptedOffer);

    const conversionnRate = amountIn / amountOut[0];

    // Ensure it's no longer active and the amount in/out is 0
    assert.isFalse(acceptedOffer.active);
    assert.equal(acceptedOffer.amountIn.toString(), "0");
    assert.equal(acceptedOffer.amountRemaining.toString(), "0");
    assert.equal(acceptedOffer.amountOut.length, 0);
    assert.equal(acceptedOffer.tokenIn, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.tokenOut.length, 0);
    assert.equal(acceptedOffer.offerer, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.payoutAddress, "0x0000000000000000000000000000000000000000");

    // FInally make sure the tokens are moved to their proper places
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(finalUserTestTokenBalance.toString(), (initialUserTestTokenBalance.toString()));

    let finalUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(finalUserUSDTBalance.toString(), initialUserUSDTBalance.toString());

    return;
    
  });
});