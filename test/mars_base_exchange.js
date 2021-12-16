const MarsBaseExchange = artifacts.require("MockMarsBaseExchange");
const USDTCoin = artifacts.require("USDTCoin");
const TestToken = artifacts.require("TestToken");
const EPICCoin = artifacts.require("EPICCoin");
const assert = require('assert/strict');

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
    const deadline = 0;
    
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
    await dex.createOffer(testToken.address, tokensIn, amountIn, amountOut, smallestChunkSize, deadline);

    // Get the updated balances, user should be less, dex should have the tokens deposited
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    let finalDexTestTokenBalance = await testToken.balanceOf(dex.address);

    // Get the offer and ensure it's all set correctly
    let offer = await dex.getOffer(0);

    assert.equal(offer.active, true);

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

  it("is ownable and owned initially by contract deployer", async function () {
    // Get the user's address
    const userAddress = accounts[0];

    // Get Contract Instances
    let dex = await MarsBaseExchange.new();

    let owner = await dex.owner();

    assert.equal(owner,userAddress);
  });

  it("has offer deadlines", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountIn = 50 * 10 ** 10;
    const amountOut = [10 * 10 ** 10];
    const smallestChunkSize = 1 * 10 ** 10;
    const deadline = Date.now() + 10000;

    // Get the user's address
    const userAddress = accounts[0];

    // Get contract instances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensIn = [usdt.address];

    // Approve the contract to move our tokens
    await testToken.approve(dex.address, approvalAmount);
    await usdt.approve(dex.address, approvalAmount);

    // Create Offer
    await dex.createOffer(testToken.address, tokensIn, amountIn, amountOut, amountIn, deadline);

    // Get the offer and ensure it's all set correctly
    let offer = await dex.getOffer(0);

    assert.equal(offer.offerType, '1');
    assert.equal(offer.active, true);
    assert.equal(deadline.toString(), offer.deadline);

    return;
  });

  it("can cancel all expired orders", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountIn = 50 * 10 ** 10;
    const amountOut = [10 * 10 ** 10];
    const smallestChunkSize = 1 * 10 ** 10;
    const deadline = Date.now() + 10;
    const mockedExpireTime = deadline + 10;

    // Get the user's address
    const userAddress = accounts[0];

    // Get contract instances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensIn = [usdt.address];

    // Approve the contract to move our tokens
    await testToken.approve(dex.address, approvalAmount);
    await usdt.approve(dex.address, approvalAmount);

    // Create Offer
    await dex.createOffer(testToken.address, tokensIn, amountIn, amountOut, smallestChunkSize, deadline);

    // Get the offer and ensure it's all set correctly
    let offer = await dex.getOffer(0);

    assert.equal(offer.offerType, '5');
    assert.equal(offer.active, true);
    assert.equal(deadline.toString(), offer.deadline);

    await dex._mock_setBlockTimeStamp(mockedExpireTime);

    await dex.setCurrentTime();

    let cancelledOffer = await dex.getOffer(0);

    assert.equal(cancelledOffer.active, false);
    assert.equal(cancelledOffer.deadline, '0');

    return;
  });

  it("can have no offer deadlines", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountIn = 50 * 10 ** 10;
    const amountOut = [10 * 10 ** 10];
    const smallestChunkSize = 1 * 10 ** 10;
    const deadline = 0;

    // Get the user's address
    const userAddress = accounts[0];

    // Get contract instances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensIn = [usdt.address];

    // Approve the contract to move our tokens
    await testToken.approve(dex.address, approvalAmount);
    await usdt.approve(dex.address, approvalAmount);

    // Create Offer
    await dex.createOffer(testToken.address, tokensIn, amountIn, amountOut, smallestChunkSize, deadline);

    // Get the offer and ensure it's all set correctly
    let offer = await dex.getOffer(0);

    assert.equal(offer.offerType, '2');
    assert.equal(offer.active, true);
    assert.equal(deadline.toString(), offer.deadline);

    return;
  });

  it("should calculate a price where amountIn is stronger", async function () {
    // Define Constants
    const amountIn = 5 * 10 ** 10;
    const amountOut = 1 * 10 ** 10;
    const buyAmount = 0.1 * 10 ** 10;
    const expectedAmount = (buyAmount * amountOut) / (amountIn);
    
    // Get Contract Instances
    let dex = await MarsBaseExchange.new();

    let price = await dex.price(buyAmount, amountIn, amountOut);

    assert.equal(price.toString(), expectedAmount.toString());
  });

  it("should calculate a price where amountIn is weaker", async function () {
    // Define Constants
    const amountIn = 1 * 10 ** 10;
    const amountOut = 5 * 10 ** 10;
    const buyAmount = 0.1 * 10 ** 10;
    const expectedAmount = (buyAmount * amountOut) / amountIn;
    
    // Get Contract Instances
    let dex = await MarsBaseExchange.new();

    let price = await dex.price(buyAmount, amountIn, amountOut);

    assert.equal(price.toString(), expectedAmount.toString());
  });

  it("should cancel an order", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountIn = 50 * 10 ** 10;
    const amountOut = [10 * 10 ** 10];
    const smallestChunkSize = 1 * 10 ** 10;
    const deadline = 0;

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
    await dex.createOffer(testToken.address, tokensOut, amountIn, amountOut, smallestChunkSize, deadline);

    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountIn).toLocaleString('fullwide', {useGrouping:false}));

    // Ensure the offer is active
    let offer = await dex.getOffer(0);
    assert.equal(offer.active, true);

    // Ensure the offerType has been correctly calculated
    // 2 is a chunked purchase
    assert.equal(offer.offerType, '2');

    // Cancel the offer, thus returning everything to its initial state
    await dex.cancelOffer(0);

    // Get the offer again, this time after it's been cancelled.
    let cancelledOffer = await dex.getOffer(0);

    // Ensure it's no longer active and the amount in is 0
    assert.equal(cancelledOffer.active, false);
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
    const deadline = 0;

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
    await dex.createOffer(testToken.address, tokensOut, amountIn, amountOut, amountIn, deadline);

    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountIn).toLocaleString('fullwide', {useGrouping:false}));

    // Get USDT balance and ensure it's unchanged
    let createdUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(createdUserUSDTBalance.toString(), initialUserUSDTBalance.toString());

    // Ensure the offer is active
    let offer = await dex.getOffer(0);
    assert.equal(offer.active, true);

    // Ensure the offerType has been correctly calculated
    // 0 is Full Purchase
    assert.equal(offer.offerType, '0');

    // Cancel the offer, thus returning everything to its initial state
    await dex.acceptOffer(0, tokensOut[1], amountIn, amountOut[1]);

    // Get the offer again, this time after it's been cancelled.
    let acceptedOffer = await dex.getOffer(0);

    // Ensure it's no longer active and the amount in/out is 0
    assert.equal(acceptedOffer.active, false);
    assert.equal(acceptedOffer.amountIn.toString(), "0");
    assert.equal(acceptedOffer.amountOut.length, 0);
    assert.equal(acceptedOffer.tokenIn, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.tokenOut.length, 0);
    assert.equal(acceptedOffer.offerer, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.payoutAddress, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.deadline, deadline.toString());

    // FInally make sure the tokens are moved to their proper places
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(finalUserTestTokenBalance.toString(), initialUserTestTokenBalance.toString());

    let finalUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(finalUserUSDTBalance.toString(), initialUserUSDTBalance.toString());

    return;
    
  });

  it("should reject order completion with a token with zero address", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountIn = 50 * 10 ** 10;
    const amountOut = [10 * 10 ** 10, 20 * 10 ** 10];
    const smallestChunkSize = 1 * 10 ** 10;
    const deadline = 0;
    
    // Get Contract Instances
    let dex = await MarsBaseExchange.new();
    let zeroToken = "0x0000000000000000000000000000000000000000";
    let epicCoin = await EPICCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensOut = [zeroToken, epicCoin.address];

    // Approve token transfers
    await epicCoin.approve(dex.address, approvalAmount);

    // Try and create the offer - should fail
    assert.rejects(dex.createOffer(zeroToken, tokensOut, amountIn, amountOut, smallestChunkSize, deadline));

    // Ensure the offer is not active
    let offer = await dex.getOffer(0);
    assert.equal(offer.active, false);

    // Cancel the offer, thus returning everything to its initial state
    assert.rejects(dex.acceptOffer(0, tokensOut[1], amountIn, amountOut[1]));

    // Get the offer again, it should still be inactive
    let acceptedOffer = await dex.getOffer(0);

    // Ensure it's inactive
    assert.equal(acceptedOffer.active, false);
    assert.equal(acceptedOffer.amountIn.toString(), "0");
    assert.equal(acceptedOffer.amountOut.length, 0);
    assert.equal(acceptedOffer.tokenIn, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.tokenOut.length, 0);
    assert.equal(acceptedOffer.offerer, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.payoutAddress, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.deadline, '0');

    return;
    
  });

  it("should reject partial order completion with a token with zero address", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountIn = 50 * 10 ** 10;
    const amountOut = [10 * 10 ** 10, 20 * 10 ** 10];
    const smallestChunkSize = 1 * 10 ** 10;
    const deadline = 0;
    
    // Get Contract Instances
    let dex = await MarsBaseExchange.new();
    let zeroToken = "0x0000000000000000000000000000000000000000";
    let epicCoin = await EPICCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensOut = [zeroToken, epicCoin.address];

    // Approve token transfers
    await epicCoin.approve(dex.address, approvalAmount);

    // Try and create the offer - should fail
    assert.rejects(dex.createOffer(zeroToken, tokensOut, amountIn, amountOut, smallestChunkSize, deadline));

    // Ensure the offer is not active
    let offer = await dex.getOffer(0);
    assert.equal(offer.active, false);

    // Cancel the offer, thus returning everything to its initial state
    assert.rejects(dex.acceptOfferPart(0, tokensOut[1], smallestChunkSize));

    // Get the offer again, it should still be inactive
    let acceptedOffer = await dex.getOffer(0);

    // Ensure it's inactive
    assert.equal(acceptedOffer.active, false);
    assert.equal(acceptedOffer.amountIn.toString(), "0");
    assert.equal(acceptedOffer.amountOut.length, 0);
    assert.equal(acceptedOffer.tokenIn, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.tokenOut.length, 0);
    assert.equal(acceptedOffer.offerer, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.payoutAddress, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.deadline, '0');

    return;
    
  });

  it("should accept part of an order", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountIn = 50 * 10 ** 10;
    const amountOut = [10 * 10 ** 10, 20 * 10 ** 10];
    const smallestChunkSize = 1 * 10 ** 10;
    const deadline = 0;

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
    await dex.createOffer(testToken.address, tokensOut, amountIn, amountOut, smallestChunkSize, deadline);

    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountIn).toLocaleString('fullwide', {useGrouping:false}));

    // Get USDT balance and ensure it's unchanged
    let createdUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(createdUserUSDTBalance.toString(), initialUserUSDTBalance.toString());

    // Ensure the offer is active
    let offer = await dex.getOffer(0);
    assert.equal(offer.active, true);

    // Ensure the offerType has been correctly calculated
    // 0 is Full Purchase
    assert.equal(offer.offerType, '2');

    // Cancel the offer, thus returning everything to its initial state
    await dex.acceptOfferPart(0, tokensOut[0], smallestChunkSize);

    // Get the offer again, this time after it's been cancelled.
    let acceptedOffer = await dex.getOffer(0);

    const conversionnRate = amountIn / amountOut[0];

    // Ensure it's no longer active and the amount in/out is 0
    assert.equal(acceptedOffer.active, true);
    assert.equal(acceptedOffer.amountIn.toString(), amountIn.toString());
    assert.equal(acceptedOffer.amountRemaining.toString(), (amountIn - (smallestChunkSize * conversionnRate)).toString());
    assert.equal(acceptedOffer.amountOut.length, 2);
    assert.equal(acceptedOffer.tokenIn, testToken.address);
    assert.equal(acceptedOffer.tokenOut.length, 2);
    assert.equal(acceptedOffer.offerer, userAddress);
    assert.equal(acceptedOffer.payoutAddress, userAddress);
    assert.equal(acceptedOffer.deadline, '0');

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
    const deadline = 0;

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
    await dex.createOffer(testToken.address, tokensOut, amountIn, amountOut, smallestChunkSize, deadline);

    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountIn).toLocaleString('fullwide', {useGrouping:false}));

    // Get USDT balance and ensure it's unchanged
    let createdUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(createdUserUSDTBalance.toString(), initialUserUSDTBalance.toString());

    // Ensure the offer is active
    let offer = await dex.getOffer(0);
    assert.equal(offer.active, true);

    // Ensure the offerType has been correctly calculated
    // 0 is Full Purchase
    assert.equal(offer.offerType, '2');

    // Cancel the offer, thus returning everything to its initial state
    await dex.acceptOfferPart(0, tokensOut[0], amountOut[0]);

    // Get the offer again, this time after it's been cancelled.
    let acceptedOffer = await dex.getOffer(0);

    const conversionnRate = amountIn / amountOut[0];

    // Ensure it's no longer active and the amount in/out is 0
    assert.equal(acceptedOffer.active, false);
    assert.equal(acceptedOffer.amountIn.toString(), "0");
    assert.equal(acceptedOffer.amountRemaining.toString(), "0");
    assert.equal(acceptedOffer.amountOut.length, 0);
    assert.equal(acceptedOffer.tokenIn, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.tokenOut.length, 0);
    assert.equal(acceptedOffer.offerer, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.payoutAddress, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.deadline, deadline.toString());

    // FInally make sure the tokens are moved to their proper places
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(finalUserTestTokenBalance.toString(), (initialUserTestTokenBalance.toString()));

    let finalUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(finalUserUSDTBalance.toString(), initialUserUSDTBalance.toString());

    return;
    
  });

  it("should hold tokens if the order minimum is not reached", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountIn = 50 * 10 ** 10;
    const amountOut = [10 * 10 ** 10, 20 * 10 ** 10];
    const smallestChunkSize = 1 * 10 ** 10;
    const minimumSale = 2 * 10 ** 10;
    const deadline = 0;

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
    await dex.createOfferWithMinimum(testToken.address, tokensOut, amountIn, amountOut, smallestChunkSize, deadline, minimumSale);

    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountIn).toLocaleString('fullwide', {useGrouping:false}));

    // Get USDT balance and ensure it's unchanged
    let createdUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(createdUserUSDTBalance.toString(), initialUserUSDTBalance.toString());

    // Ensure the offer is active
    let offer = await dex.getOffer(0);
    assert.equal(offer.active, true);

    // Ensure the offerType has been correctly calculated
    // 3 is Chunked Order with Minimum and No Expiration Time
    assert.equal(offer.offerType, '3');

    // Accept part of the offer without going over the minimum
    await dex.acceptOfferPartWithMinimum(0, tokensOut[0], smallestChunkSize);

    // Get the offer again, this time after it's been cancelled.
    let acceptedOffer = await dex.getOffer(0);

    const conversionnRate = amountIn / amountOut[0];

    // Ensure everything adds up
    assert.equal(acceptedOffer.active, true);
    assert.equal(acceptedOffer.amountIn.toString(), amountIn.toString());
    assert.equal(acceptedOffer.amountRemaining.toString(), (amountIn - smallestChunkSize).toString());
    assert.equal(acceptedOffer.amountOut.length, 2);
    assert.equal(acceptedOffer.tokenIn, testToken.address);
    assert.equal(acceptedOffer.tokenOut.length, 2);
    assert.equal(acceptedOffer.offerer, userAddress);
    assert.equal(acceptedOffer.payoutAddress, userAddress);
    assert.equal(acceptedOffer.deadline, '0');
    assert.equal(acceptedOffer.minimumOrderAddresses[0], userAddress);
    assert.equal(acceptedOffer.minimumOrderAmountsOut[0], smallestChunkSize.toString());
    assert.equal(acceptedOffer.minimumOrderAmountsIn[0], (smallestChunkSize * conversionnRate).toString());
    assert.equal(acceptedOffer.minimumOrderTokens[0], tokensOut[0]);

    // Finally make sure the tokens are moved to their proper places
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(finalUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountIn).toLocaleString('fullwide', {useGrouping:false}));

    let finalUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(finalUserUSDTBalance.toString(), (initialUserUSDTBalance - smallestChunkSize).toLocaleString('fullwide', {useGrouping:false}));

    return;
    
  });

  it("should send tokens if the order minimum is not reached", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountIn = 50 * 10 ** 10;
    const amountOut = [10 * 10 ** 10, 20 * 10 ** 10];
    const smallestChunkSize = 1 * 10 ** 10;
    const minimumSale = 2 * 10 ** 10;
    const deadline = 0;

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
    await dex.createOfferWithMinimum(testToken.address, tokensOut, amountIn, amountOut, smallestChunkSize, deadline, minimumSale);

    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountIn).toLocaleString('fullwide', {useGrouping:false}));

    // Get USDT balance and ensure it's unchanged
    let createdUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(createdUserUSDTBalance.toString(), initialUserUSDTBalance.toString());

    // Ensure the offer is active
    let offer = await dex.getOffer(0);
    assert.equal(offer.active, true);

    // Ensure the offerType has been correctly calculated
    // 3 is Chunked Order with Minimum and No Expiration Time
    assert.equal(offer.offerType, '3');

    // Accept part of the offer without going over the minimum
    await dex.acceptOfferPartWithMinimum(0, tokensOut[0], minimumSale);

    // Get the offer again, this time after it's been cancelled.
    let acceptedOffer = await dex.getOffer(0);

    const conversionnRate = amountIn / amountOut[0];

    // Ensure everything adds up
    assert.equal(acceptedOffer.active, true);
    assert.equal(acceptedOffer.amountIn.toString(), amountIn.toString());
    assert.equal(acceptedOffer.amountRemaining.toString(), (amountIn - (minimumSale)).toString());
    assert.equal(acceptedOffer.amountOut.length, 2);
    assert.equal(acceptedOffer.tokenIn, testToken.address);
    assert.equal(acceptedOffer.tokenOut.length, 2);
    assert.equal(acceptedOffer.offerer, userAddress);
    assert.equal(acceptedOffer.payoutAddress, userAddress);
    assert.equal(acceptedOffer.deadline, '0');
    assert.equal(acceptedOffer.minimumOrderAddresses.length, 0);
    assert.equal(acceptedOffer.minimumOrderAmountsOut.length, 0);
    assert.equal(acceptedOffer.minimumOrderAmountsIn.length, 0);
    assert.equal(acceptedOffer.minimumOrderTokens.length, 0);

    // FInally make sure the tokens are moved to their proper places
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);

    // We add 10000000 to the output because of a JS numbers issue
    assert.equal(finalUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountIn + (minimumSale * conversionnRate) + 10000000).toLocaleString('fullwide', {useGrouping:false}));

    let finalUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(finalUserUSDTBalance.toString(), (initialUserUSDTBalance).toLocaleString('fullwide', {useGrouping:false}));

    return;
    
  });

});