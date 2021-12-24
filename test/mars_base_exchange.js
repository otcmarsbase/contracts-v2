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
    const amountAlice = 50 * 10 ** 10;
    const amountBob = [10 * 10 ** 10, 20 * 10 ** 10];
    const feeAlice = 10;
    const feeBob = 20;
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
    let tokensBob = [usdt.address, epicCoin.address];

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
    await dex.createOffer(testToken.address, tokensBob, amountAlice, amountBob, [feeAlice, feeBob], [smallestChunkSize, deadline]);

    // Get the updated balances, user should be less, dex should have the tokens deposited
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    let finalDexTestTokenBalance = await testToken.balanceOf(dex.address);

    // Get the offer and ensure it's all set correctly
    let offer = await dex.getOffer(0);

    assert.equal(offer.active, true);

    assert.equal(amountAlice.toString(), offer.amountAlice.toString());
    assert.equal(amountBob[0].toString(), offer.amountBob[0].toString());
    assert.equal(amountBob[1].toString(), offer.amountBob[1].toString());
    
    assert.equal(userAddress, offer.offerer);
    assert.equal(userAddress, offer.payoutAddress);

    assert.equal(testToken.address, offer.tokenAlice);
    assert.equal(usdt.address, offer.tokenBob[0]);
    assert.equal(epicCoin.address, offer.tokenBob[1]);

    // Finally validate that the user and dex balances are correct.

    assert.equal(finalUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountAlice).toLocaleString('fullwide', {useGrouping:false}));
    assert.equal(finalDexTestTokenBalance.toString(), amountAlice.toString());

    return;
  });

  it("is ownable and owned initially by contract deployer", async function () {
    // Get the user's address
    const userAddress = accounts[0];

    // Get Contract Alicestances
    let dex = await MarsBaseExchange.new();

    let owner = await dex.owner();

    assert.equal(owner,userAddress);
  });

  it("has offer deadlines", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountAlice = 50 * 10 ** 10;
    const amountBob = [10 * 10 ** 10];
    const feeAlice = 10;
    const feeBob = 20;
    const smallestChunkSize = 1 * 10 ** 10;
    const deadline = Date.now() + 10000;

    // Get the user's address
    const userAddress = accounts[0];

    // Get contract instances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensBob = [usdt.address];

    // Approve the contract to move our tokens
    await testToken.approve(dex.address, approvalAmount);
    await usdt.approve(dex.address, approvalAmount);

    // Create Offer
    await dex.createOffer(testToken.address, tokensBob, amountAlice, amountBob, [feeAlice, feeBob], [smallestChunkSize, deadline]);

    // Get the offer and ensure it's all set correctly
    let offer = await dex.getOffer(0);

    assert.equal(offer.offerType, '5');
    assert.equal(offer.active, true);
    assert.equal(deadline.toString(), offer.deadline);

    return;
  });

  it("can cancel all expired orders", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountAlice = 50 * 10 ** 10;
    const amountBob = [10 * 10 ** 10];
    const feeAlice = 10;
    const feeBob = 20;
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
    let tokensBob = [usdt.address];

    // Approve the contract to move our tokens
    await testToken.approve(dex.address, approvalAmount);
    await usdt.approve(dex.address, approvalAmount);

    // Create Offer
    await dex.createOffer(testToken.address, tokensBob, amountAlice, amountBob, [feeAlice, feeBob], [smallestChunkSize, deadline]);

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
    const amountAlice = 50 * 10 ** 10;
    const amountBob = [10 * 10 ** 10];
    const feeAlice = 10;
    const feeBob = 20;
    const smallestChunkSize = 1 * 10 ** 10;
    const deadline = 0;

    // Get the user's address
    const userAddress = accounts[0];

    // Get contract instances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensBob = [usdt.address];

    // Approve the contract to move our tokens
    await testToken.approve(dex.address, approvalAmount);
    await usdt.approve(dex.address, approvalAmount);

    // Create Offer
    await dex.createOffer(testToken.address, tokensBob, amountAlice, amountBob, [feeAlice, feeBob], [smallestChunkSize, deadline]);
    // Get the offer and ensure it's all set correctly
    let offer = await dex.getOffer(0);

    assert.equal(offer.offerType, '2');
    assert.equal(offer.active, true);
    assert.equal(deadline.toString(), offer.deadline);

    return;
  });

  it("should calculate a price where amountAlice is stronger", async function () {
    // Define Constants
    const amountAlice = 5 * 10 ** 10;
    const amountBob = 1 * 10 ** 10;
    const feeAlice = 10;
    const feeBob = 20;
    const buyAmount = 0.1 * 10 ** 10;
    const expectedAmount = (buyAmount * amountBob) / (amountAlice);
    
    // Get Contract Alicestances
    let dex = await MarsBaseExchange.new();

    let price = await dex.price(buyAmount, amountAlice, amountBob);

    assert.equal(price.toString(), expectedAmount.toString());
  });

  it("should calculate a price where amountAlice is weaker", async function () {
    // Define Constants
    const amountAlice = 1 * 10 ** 10;
    const amountBob = 5 * 10 ** 10;
    const feeAlice = 10;
    const feeBob = 20;
    const buyAmount = 0.1 * 10 ** 10;
    const expectedAmount = (buyAmount * amountBob) / amountAlice;
    
    // Get Contract Alicestances
    let dex = await MarsBaseExchange.new();

    let price = await dex.price(buyAmount, amountAlice, amountBob);

    assert.equal(price.toString(), expectedAmount.toString());
  });
  
  it("should allow owner to set if orders can be cancelled", async function () {
    // Get Contract Instances
    let dex = await MarsBaseExchange.new();

    let cancelAllowed = await dex.getOrderCancelAllowed();

    assert.equal(cancelAllowed, true);

    await dex.setOrderCancelAllowed(false);

    cancelAllowed = await dex.getOrderCancelAllowed();

    assert.equal(cancelAllowed, false);
  });

  it("should allow owner to set if order prices can be changed", async function () {
    // Get Contract Instances
    let dex = await MarsBaseExchange.new();

    let changeAllowed = await dex.getPriceChangeAllowed();

    assert.equal(changeAllowed, true);

    await dex.setPriceChangeAllowed(false);

    changeAllowed = await dex.getPriceChangeAllowed();

    assert.equal(changeAllowed, false);
  });

  it("should cancel an order", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountAlice = 50 * 10 ** 10;
    const amountBob = [10 * 10 ** 10];
    const feeAlice = 10;
    const feeBob = 20;
    const smallestChunkSize = 1 * 10 ** 10;
    const deadline = 0;

    // Get the user's address
    const userAddress = accounts[0];
    
    // Get Contract Alicestances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();

    let tokensBob = [usdt.address];

    // Approve token transfers
    await testToken.approve(dex.address, approvalAmount);
    await usdt.approve(dex.address, approvalAmount);

    // Get users balance and total supply of TestToken
    let initialUserTestTokenBalance = await testToken.balanceOf(userAddress);
    const testTokenTotalSupply = await testToken.totalSupply();
    
    // Check that it's all assigned to us
    assert.equal(initialUserTestTokenBalance.toString(), testTokenTotalSupply.toString());

    // Create the offer
    await dex.createOffer(testToken.address, tokensBob, amountAlice, amountBob, [feeAlice, feeBob], [smallestChunkSize, deadline]);
    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountAlice).toLocaleString('fullwide', {useGrouping:false}));

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
    assert.equal(cancelledOffer.amountAlice.toString(), "0");
    assert.equal(cancelledOffer.amountBob.length, 0);
    assert.equal(cancelledOffer.tokenAlice, "0x0000000000000000000000000000000000000000");
    assert.equal(cancelledOffer.tokenBob.length, 0);
    assert.equal(cancelledOffer.offerer, "0x0000000000000000000000000000000000000000");
    assert.equal(cancelledOffer.payoutAddress, "0x0000000000000000000000000000000000000000");

    // FAliceally make sure the tokens are returned to the user
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(finalUserTestTokenBalance.toString(), initialUserTestTokenBalance.toString());

    return;
    
  });

  it("should not cancel an order if its disabled", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountAlice = 50 * 10 ** 10;
    const amountBob = [10 * 10 ** 10];
    const feeAlice = 10;
    const feeBob = 20;
    const smallestChunkSize = 1 * 10 ** 10;
    const deadline = 0;

    // Get the user's address
    const userAddress = accounts[0];
    
    // Get Contract Alicestances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();

    let tokensBob = [usdt.address];

    // Approve token transfers
    await testToken.approve(dex.address, approvalAmount);
    await usdt.approve(dex.address, approvalAmount);

    // Get users balance and total supply of TestToken
    let initialUserTestTokenBalance = await testToken.balanceOf(userAddress);
    const testTokenTotalSupply = await testToken.totalSupply();
    
    // Check that it's all assigned to us
    assert.equal(initialUserTestTokenBalance.toString(), testTokenTotalSupply.toString());

    // Disable order cancellation
    await dex.setOrderCancelAllowed(false);
    cancelAllowed = await dex.getOrderCancelAllowed();
    assert.equal(cancelAllowed, false);

    // Create the offer
    await dex.createOffer(testToken.address, tokensBob, amountAlice, amountBob, [feeAlice, feeBob], [smallestChunkSize, deadline]);
    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountAlice).toLocaleString('fullwide', {useGrouping:false}));

    // Ensure the offer is active
    let offer = await dex.getOffer(0);
    assert.equal(offer.active, true);

    // Ensure the offerType has been correctly calculated
    // 2 is a chunked purchase
    assert.equal(offer.offerType, '2');

    // Cancel the offer, thus returning everything to its initial state
    assert.rejects(dex.cancelOffer(0));
    return;
    
  });

  it("should complete an order", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountAlice = 50 * 10 ** 10;
    const amountBob = [10 * 10 ** 10, 20 * 10 ** 10];
    const feeAlice = 10;
    const feeBob = 20;
    const smallestChunkSize = 0;
    const deadline = 0;
    const amountAfterFeeAlice = amountAlice * (1000 - feeAlice) / 1000;
    const amountAfterFeeBob = amountBob[1] * (1000 - feeBob) / 1000;

    // Get the user's address
    const userAddress = accounts[0];
    
    // Get Contract Alicestances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();
    let epicCoin = await EPICCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensBob = [usdt.address, epicCoin.address];

    // Approve token transfers
    await testToken.approve(dex.address, approvalAmount);
    await usdt.approve(dex.address, approvalAmount);
    await epicCoin.approve(dex.address, approvalAmount);

    // Get users balance and total supply of TestToken and USDT
    let initialUserTestTokenBalance = await testToken.balanceOf(userAddress);
    const testTokenTotalSupply = await testToken.totalSupply();

    let initialUserEpicCoinBalance = await epicCoin.balanceOf(userAddress);
    const epicCoinTotalSupply = await epicCoin.totalSupply();

    // Check that it's all assigned to us
    assert.equal(initialUserTestTokenBalance.toString(), testTokenTotalSupply.toString());
    assert.equal(initialUserEpicCoinBalance.toString(), epicCoinTotalSupply.toString());

    // Create the offer
    await dex.createOffer(testToken.address, tokensBob, amountAlice, amountBob, [feeAlice, feeBob], [smallestChunkSize, deadline]);
    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountAlice).toLocaleString('fullwide', {useGrouping:false}));

    // Get USDT balance and ensure it's unchanged
    let createdUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(createdUserUSDTBalance.toString(), initialUserEpicCoinBalance.toString());

    // Ensure the offer is active
    let offer = await dex.getOffer(0);
    assert.equal(offer.active, true);

    // Ensure the offerType has been correctly calculated
    // 0 is Full Purchase
    assert.equal(offer.offerType, '0');

    // Cancel the offer, thus returning everything to its initial state
    await dex.acceptOffer(0, tokensBob[1], amountBob[1]);

    // Get the offer again, this time after it's been cancelled.
    let acceptedOffer = await dex.getOffer(0);

    // Ensure it's no longer active and the amount in/out is 0
    assert.equal(acceptedOffer.active, false);
    assert.equal(acceptedOffer.amountAlice.toString(), "0");
    assert.equal(acceptedOffer.amountBob.length, 0);
    assert.equal(acceptedOffer.tokenAlice, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.tokenBob.length, 0);
    assert.equal(acceptedOffer.offerer, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.payoutAddress, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.deadline, deadline.toString());

    // FAliceally make sure the tokens are moved to their proper places
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(finalUserTestTokenBalance.toString(), (initialUserTestTokenBalance - (amountAlice - amountAfterFeeAlice)).toLocaleString('fullwide', {useGrouping:false}));

    let finalDexEpicCoinBalance = await epicCoin.balanceOf(dex.address);
    assert.equal(finalDexEpicCoinBalance.toString(), (amountBob[1] - amountAfterFeeBob).toLocaleString('fullwide', {useGrouping:false}));

    let finalUserEpicCoinBalance = await epicCoin.balanceOf(userAddress);
    assert.equal(finalUserEpicCoinBalance.toString(), (initialUserEpicCoinBalance - (amountBob[1] - amountAfterFeeBob)).toLocaleString('fullwide', {useGrouping:false}));

    return;
    
  });

  it("should not complete an order with the same address for both in and out", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountAlice = 50 * 10 ** 10;
    const amountBob = [10 * 10 ** 10, 20 * 10 ** 10];
    const feeAlice = 10;
    const feeBob = 20;
    const smallestChunkSize = 0;
    const deadline = 0;
    const amountAfterFeeAlice = amountAlice * (1000 - feeAlice) / 1000;
    const amountAfterFeeBob = amountBob[1] * (1000 - feeBob) / 1000;

    // Get the user's address
    const userAddress = accounts[0];
    
    // Get Contract Alicestances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();
    let epicCoin = await EPICCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensBob = [testToken.address];

    // Approve token transfers
    await testToken.approve(dex.address, approvalAmount);
    await usdt.approve(dex.address, approvalAmount);
    await epicCoin.approve(dex.address, approvalAmount);

    // Get users balance and total supply of TestToken and USDT
    let initialUserTestTokenBalance = await testToken.balanceOf(userAddress);
    const testTokenTotalSupply = await testToken.totalSupply();

    let initialUserEpicCoinBalance = await epicCoin.balanceOf(userAddress);
    const epicCoinTotalSupply = await epicCoin.totalSupply();

    // Check that it's all assigned to us
    assert.equal(initialUserTestTokenBalance.toString(), testTokenTotalSupply.toString());
    assert.equal(initialUserEpicCoinBalance.toString(), epicCoinTotalSupply.toString());

    // Create the offer
    await dex.createOffer(testToken.address, tokensBob, amountAlice, amountBob, [feeAlice, feeBob], [smallestChunkSize, deadline]);
    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountAlice).toLocaleString('fullwide', {useGrouping:false}));

    // Get USDT balance and ensure it's unchanged
    let createdUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(createdUserUSDTBalance.toString(), initialUserEpicCoinBalance.toString());

    // Ensure the offer is active
    let offer = await dex.getOffer(0);
    assert.equal(offer.active, true);

    // Ensure the offerType has been correctly calculated
    // 0 is Full Purchase
    assert.equal(offer.offerType, '0');

    // Cancel the offer, thus returning everything to its initial state
    assert.rejects(dex.acceptOffer(0, tokensBob[1], amountBob[1]));

    return;
    
  });

  it("should get all open orders", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountAlice = 50 * 10 ** 10;
    const amountBob = [10 * 10 ** 10, 20 * 10 ** 10];
    const feeAlice = 10;
    const feeBob = 20;
    const smallestChunkSize = 0;
    const deadline = 0;
    const amountAfterFeeAlice = amountAlice * (1000 - feeAlice) / 1000;
    const amountAfterFeeBob = amountBob[1] * (1000 - feeBob) / 1000;

    // Get the user's address
    const userAddress = accounts[0];
    
    // Get Contract Alicestances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();
    let epicCoin = await EPICCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensBob = [usdt.address, epicCoin.address];

    // Approve token transfers
    await testToken.approve(dex.address, approvalAmount);
    await usdt.approve(dex.address, approvalAmount);
    await epicCoin.approve(dex.address, approvalAmount);

    // Get users balance and total supply of TestToken and USDT
    let initialUserTestTokenBalance = await testToken.balanceOf(userAddress);
    const testTokenTotalSupply = await testToken.totalSupply();

    let initialUserEpicCoinBalance = await epicCoin.balanceOf(userAddress);
    const epicCoinTotalSupply = await epicCoin.totalSupply();

    // Check that it's all assigned to us
    assert.equal(initialUserTestTokenBalance.toString(), testTokenTotalSupply.toString());
    assert.equal(initialUserEpicCoinBalance.toString(), epicCoinTotalSupply.toString());

    // Create the offer
    await dex.createOffer(testToken.address, tokensBob, amountAlice, amountBob, [feeAlice, feeBob], [smallestChunkSize, deadline]);
    await dex.createOffer(testToken.address, tokensBob, amountAlice, amountBob, [feeAlice, feeBob], [smallestChunkSize, deadline]);

    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountAlice - amountAlice).toLocaleString('fullwide', {useGrouping:false}));

    // Get USDT balance and ensure it's unchanged
    let createdUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(createdUserUSDTBalance.toString(), initialUserEpicCoinBalance.toString());

    // Ensure the offer is active
    let offer = await dex.getOffer(0);
    assert.equal(offer.active, true);

    // Ensure the offerType has been correctly calculated
    // 0 is Full Purchase
    assert.equal(offer.offerType, '0');

    // Cancel the offer, thus returning everything to its initial state
    await dex.acceptOffer(0, tokensBob[1], amountBob[1]);

    // Get the offer again, this time after it's been cancelled.
    let acceptedOffer = await dex.getOffer(0);

    // Ensure it's no longer active and the amount in/out is 0
    assert.equal(acceptedOffer.active, false);
    assert.equal(acceptedOffer.amountAlice.toString(), "0");
    assert.equal(acceptedOffer.amountBob.length, 0);
    assert.equal(acceptedOffer.tokenAlice, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.tokenBob.length, 0);
    assert.equal(acceptedOffer.offerer, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.payoutAddress, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.deadline, deadline.toString());

    // FAliceally make sure the tokens are moved to their proper places
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(finalUserTestTokenBalance.toString(), (initialUserTestTokenBalance - (amountAlice - amountAfterFeeAlice) - amountAlice).toLocaleString('fullwide', {useGrouping:false}));

    let finalDexEpicCoinBalance = await epicCoin.balanceOf(dex.address);
    assert.equal(finalDexEpicCoinBalance.toString(), (amountBob[1] - amountAfterFeeBob).toLocaleString('fullwide', {useGrouping:false}));

    let finalUserEpicCoinBalance = await epicCoin.balanceOf(userAddress);
    assert.equal(finalUserEpicCoinBalance.toString(), (initialUserEpicCoinBalance - (amountBob[1] - amountAfterFeeBob)).toLocaleString('fullwide', {useGrouping:false}));

    // Ensure that only the second offer is open
    let offers = await dex.getAllOffers();
    assert.equal(offers.length, 2);
    assert.equal(offers[0].offerId, "0");
    assert.equal(offers[1].offerId, "1");
    assert.equal(offers[0].active, false);
    assert.equal(offers[1].active, true);

    return;
    
  });

  it("should reject order completion with a token with zero address", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountAlice = 50 * 10 ** 10;
    const amountBob = [10 * 10 ** 10, 20 * 10 ** 10];
    const feeAlice = 10;
    const feeBob = 20;
    const smallestChunkSize = 1 * 10 ** 10;
    const deadline = 0;
    const minimumSale = 0;
    
    // Get Contract Alicestances
    let dex = await MarsBaseExchange.new();
    let zeroToken = "0x0000000000000000000000000000000000000000";
    let epicCoin = await EPICCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensBob = [zeroToken, epicCoin.address];

    // Approve token transfers
    await epicCoin.approve(dex.address, approvalAmount);

    // Try and create the offer - should fail
    assert.rejects(dex.createOffer(zeroToken, tokensBob, amountAlice, amountBob, [feeAlice, feeBob], [smallestChunkSize, deadline, minimumSale]));

    // Ensure the offer is not active
    let offer = await dex.getOffer(0);
    assert.equal(offer.active, false);

    // Cancel the offer, thus returning everything to its initial state
    assert.rejects(dex.acceptOffer(0, tokensBob[1], amountAlice, amountBob[1]));

    // Get the offer again, it should still be inactive
    let acceptedOffer = await dex.getOffer(0);

    // Ensure it's inactive
    assert.equal(acceptedOffer.active, false);
    assert.equal(acceptedOffer.amountAlice.toString(), "0");
    assert.equal(acceptedOffer.amountBob.length, 0);
    assert.equal(acceptedOffer.tokenAlice, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.tokenBob.length, 0);
    assert.equal(acceptedOffer.offerer, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.payoutAddress, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.deadline, '0');

    return;
    
  });

  it("should reject partial order completion with a token with zero address", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountAlice = 50 * 10 ** 10;
    const amountBob = [10 * 10 ** 10, 20 * 10 ** 10];
    const feeAlice = 10;
    const feeBob = 20;
    const smallestChunkSize = 1 * 10 ** 10;
    const deadline = 0;
    const minimumSale = 0;
    
    // Get Contract Alicestances
    let dex = await MarsBaseExchange.new();
    let zeroToken = "0x0000000000000000000000000000000000000000";
    let epicCoin = await EPICCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensBob = [zeroToken, epicCoin.address];

    // Approve token transfers
    await epicCoin.approve(dex.address, approvalAmount);

    // Try and create the offer - should fail
    assert.rejects(dex.createOffer(zeroToken, tokensBob, amountAlice, amountBob, [feeAlice, feeBob], [smallestChunkSize, deadline, minimumSale]));

    // Ensure the offer is not active
    let offer = await dex.getOffer(0);
    assert.equal(offer.active, false);

    // Cancel the offer, thus returning everything to its initial state
    assert.rejects(dex.acceptOfferPart(0, tokensBob[1], smallestChunkSize));

    // Get the offer again, it should still be inactive
    let acceptedOffer = await dex.getOffer(0);

    // Ensure it's inactive
    assert.equal(acceptedOffer.active, false);
    assert.equal(acceptedOffer.amountAlice.toString(), "0");
    assert.equal(acceptedOffer.amountBob.length, 0);
    assert.equal(acceptedOffer.tokenAlice, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.tokenBob.length, 0);
    assert.equal(acceptedOffer.offerer, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.payoutAddress, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.deadline, '0');

    return;
    
  });

  it("should accept part of an order", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountAlice = 50 * 10 ** 10;
    const amountBob = [10 * 10 ** 10, 20 * 10 ** 10];
    const feeAlice = 10;
    const feeBob = 20;
    const smallestChunkSize = 1 * 10 ** 10;
    const deadline = 0;
    const conversionnRate = amountAlice / amountBob[0];
    const amountAfterFeeAlice = smallestChunkSize * (1000 - feeAlice) / 1000;
    const amountAfterFeeBob = smallestChunkSize * (1000 - feeBob) / 1000;

    // Get the user's address
    const userAddress = accounts[0];
    
    // Get Contract Alicestances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();
    let epicCoin = await EPICCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensBob = [usdt.address, epicCoin.address];

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
    await dex.createOffer(testToken.address, tokensBob, amountAlice, amountBob, [feeAlice, feeBob], [smallestChunkSize, deadline]);

    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountAlice).toLocaleString('fullwide', {useGrouping:false}));

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
    await dex.acceptOfferPart(0, tokensBob[0], smallestChunkSize);

    // Get the offer again, this time after it's been cancelled.
    let acceptedOffer = await dex.getOffer(0);

    // Ensure it's no longer active and the amount in/out is 0
    assert.equal(acceptedOffer.active, true);
    assert.equal(acceptedOffer.amountAlice.toString(), amountAlice.toString());
    assert.equal(acceptedOffer.amountRemaining.toString(), (amountAlice - (smallestChunkSize * conversionnRate)).toString());
    assert.equal(acceptedOffer.amountBob.length, 2);
    assert.equal(acceptedOffer.tokenAlice, testToken.address);
    assert.equal(acceptedOffer.tokenBob.length, 2);
    assert.equal(acceptedOffer.offerer, userAddress);
    assert.equal(acceptedOffer.payoutAddress, userAddress);
    assert.equal(acceptedOffer.deadline, '0');

    // Finally make sure the tokens are moved to their proper places
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(finalUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountAlice + (amountAfterFeeAlice * conversionnRate) + 10000000).toLocaleString('fullwide', {useGrouping:false}));

    let finalUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(finalUserUSDTBalance.toString(), (initialUserUSDTBalance - (smallestChunkSize - amountAfterFeeBob) + 10000000).toLocaleString('fullwide', {useGrouping:false}));

    return;
    
  });

  it("should allow price changes", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountAlice = 50 * 10 ** 10;
    const changedAmountsBob = [10 * 10 ** 10, 20 * 10 ** 10];
    const amountBob = [changedAmountsBob[0]];
    const feeAlice = 10;
    const feeBob = 20;
    const smallestChunkSize = 1 * 10 ** 10;
    const deadline = 0;
    const conversionnRate = amountAlice / amountBob[0];
    const amountAfterFeeAlice = smallestChunkSize * (1000 - feeAlice) / 1000;
    const amountAfterFeeBob = smallestChunkSize * (1000 - feeBob) / 1000;

    // Get the user's address
    const userAddress = accounts[0];
    
    // Get Contract Alicestances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();
    let epicCoin = await EPICCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensBob = [usdt.address];
    let changedTokensBob = [usdt.address, epicCoin.address];

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
    await dex.createOffer(testToken.address, tokensBob, amountAlice, amountBob, [feeAlice, feeBob], [smallestChunkSize, deadline]);

    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountAlice).toLocaleString('fullwide', {useGrouping:false}));

    // Get USDT balance and ensure it's unchanged
    let createdUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(createdUserUSDTBalance.toString(), initialUserUSDTBalance.toString());

    // Ensure the offer is active
    let offer = await dex.getOffer(0);
    assert.equal(offer.active, true);

    // Ensure the offerType has been correctly calculated
    // 0 is Full Purchase
    assert.equal(offer.offerType, '2');

    // Ensure it's got all the right info
    assert.equal(offer.active, true);
    assert.equal(offer.amountBob.length, 1);
    assert.equal(offer.tokenAlice, testToken.address);
    assert.equal(offer.tokenBob.length, 1);

    // Cancel the offer, thus returning everything to its initial state
    await dex.changeOfferPrice(0, changedTokensBob, changedAmountsBob);

    // Get the offer again, this time after it's been cancelled.
    let acceptedOffer = await dex.getOffer(0);

    // Ensure it's got all the right info
    assert.equal(acceptedOffer.active, true);
    assert.equal(acceptedOffer.amountAlice.toString(), amountAlice.toString());
    assert.equal(acceptedOffer.amountRemaining.toString(), amountAlice.toString());
    assert.equal(acceptedOffer.amountBob.length, 2);
    assert.equal(acceptedOffer.tokenAlice, testToken.address);
    assert.equal(acceptedOffer.tokenBob.length, 2);
    assert.equal(acceptedOffer.offerer, userAddress);
    assert.equal(acceptedOffer.payoutAddress, userAddress);
    assert.equal(acceptedOffer.deadline, '0');

    // Finally make sure the tokens are moved to their proper places
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(finalUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountAlice).toLocaleString('fullwide', {useGrouping:false}));

    let finalUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(finalUserUSDTBalance.toString(), (initialUserUSDTBalance ).toLocaleString('fullwide', {useGrouping:false}));

    return;
    
  });

  it("should allow minimum chunk size changes", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountAlice = 50 * 10 ** 10;
    const changedAmountsBob = [10 * 10 ** 10, 20 * 10 ** 10];
    const amountBob = [changedAmountsBob[0]];
    const feeAlice = 10;
    const feeBob = 20;
    const smallestChunkSize = 1 * 10 ** 10;
    const changedSmallestChunkSize = 1;
    const deadline = 0;
    const conversionnRate = amountAlice / amountBob[0];
    const amountAfterFeeAlice = smallestChunkSize * (1000 - feeAlice) / 1000;
    const amountAfterFeeBob = smallestChunkSize * (1000 - feeBob) / 1000;

    // Get the user's address
    const userAddress = accounts[0];
    
    // Get Contract Alicestances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();
    let epicCoin = await EPICCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensBob = [usdt.address];
    let changedTokensBob = [usdt.address, epicCoin.address];

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
    await dex.createOffer(testToken.address, tokensBob, amountAlice, amountBob, [feeAlice, feeBob], [smallestChunkSize, deadline]);

    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountAlice).toLocaleString('fullwide', {useGrouping:false}));

    // Get USDT balance and ensure it's unchanged
    let createdUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(createdUserUSDTBalance.toString(), initialUserUSDTBalance.toString());

    // Ensure the offer is active
    let offer = await dex.getOffer(0);
    assert.equal(offer.active, true);

    // Ensure the offerType has been correctly calculated
    // 0 is Full Purchase
    assert.equal(offer.offerType, '2');

    // Ensure it's got all the right info
    assert.equal(offer.active, true);
    assert.equal(offer.amountBob.length, 1);
    assert.equal(offer.tokenAlice, testToken.address);
    assert.equal(offer.tokenBob.length, 1);
    assert.equal(offer.smallestChunkSize, smallestChunkSize.toString());

    // Cancel the offer, thus returning everything to its initial state
    await dex.changeOfferPricePart(0, changedTokensBob, changedAmountsBob, changedSmallestChunkSize);

    // Get the offer again, this time after it's been cancelled.
    let acceptedOffer = await dex.getOffer(0);

    // Ensure it's got all the right info
    assert.equal(acceptedOffer.active, true);
    assert.equal(acceptedOffer.amountAlice.toString(), amountAlice.toString());
    assert.equal(acceptedOffer.amountRemaining.toString(), amountAlice.toString());
    assert.equal(acceptedOffer.amountBob.length, 2);
    assert.equal(acceptedOffer.tokenAlice, testToken.address);
    assert.equal(acceptedOffer.tokenBob.length, 2);
    assert.equal(acceptedOffer.smallestChunkSize, changedSmallestChunkSize.toString());
    assert.equal(acceptedOffer.offerer, userAddress);
    assert.equal(acceptedOffer.payoutAddress, userAddress);
    assert.equal(acceptedOffer.deadline, '0');

    // Finally make sure the tokens are moved to their proper places
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(finalUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountAlice).toLocaleString('fullwide', {useGrouping:false}));

    let finalUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(finalUserUSDTBalance.toString(), (initialUserUSDTBalance ).toLocaleString('fullwide', {useGrouping:false}));

    return;
    
  });

  it("should close the order if all of an order is requested for part of an order", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountAlice = 50 * 10 ** 10;
    const amountBob = [10 * 10 ** 10, 20 * 10 ** 10];
    const feeAlice = 10;
    const feeBob = 20;
    const smallestChunkSize = 1 * 10 ** 10;
    const deadline = 0;
    const conversionnRate = amountAlice / amountBob[0];
    const amountAfterFeeAlice = amountAlice * (1000 - feeAlice) / 1000;
    const amountAfterFeeBob = amountBob[0] * (1000 - feeBob) / 1000;

    // Get the user's address
    const userAddress = accounts[0];
    
    // Get Contract Alicestances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();
    let epicCoin = await EPICCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensBob = [usdt.address, epicCoin.address];

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
    await dex.createOffer(testToken.address, tokensBob, amountAlice, amountBob, [feeAlice, feeBob], [smallestChunkSize, deadline]);
    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountAlice).toLocaleString('fullwide', {useGrouping:false}));

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
    await dex.acceptOfferPart(0, tokensBob[0], amountBob[0]);

    // Get the offer again, this time after it's been cancelled.
    let acceptedOffer = await dex.getOffer(0);

    // Ensure it's no longer active and the amount in/out is 0
    assert.equal(acceptedOffer.active, false);
    assert.equal(acceptedOffer.amountAlice.toString(), "0");
    assert.equal(acceptedOffer.amountRemaining.toString(), "0");
    assert.equal(acceptedOffer.amountBob.length, 0);
    assert.equal(acceptedOffer.tokenAlice, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.tokenBob.length, 0);
    assert.equal(acceptedOffer.offerer, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.payoutAddress, "0x0000000000000000000000000000000000000000");
    assert.equal(acceptedOffer.deadline, deadline.toString());

    // Finally make sure the tokens are moved to their proper places
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(finalUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountAlice + (amountAfterFeeAlice)).toLocaleString('fullwide', {useGrouping:false}));

    let finalUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(finalUserUSDTBalance.toString(), (initialUserUSDTBalance - (amountBob[0] - amountAfterFeeBob)).toLocaleString('fullwide', {useGrouping:false}));

    return;
    
  });

  it("should hold tokens if the order minimum is not reached", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountAlice = 50 * 10 ** 10;
    const amountBob = [10 * 10 ** 10, 20 * 10 ** 10];
    const feeAlice = 10;
    const feeBob = 20;
    const smallestChunkSize = 1 * 10 ** 10;
    const minimumSale = 2 * 10 ** 10;
    const deadline = 0;
    const amountAfterFeeAlice = smallestChunkSize * (1000 - feeAlice) / 1000;
    const amountAfterFeeBob = amountBob[0] * (1000 - feeBob) / 1000;

    // Get the user's address
    const userAddress = accounts[0];
    
    // Get Contract Alicestances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();
    let epicCoin = await EPICCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensBob = [usdt.address, epicCoin.address];

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
    await dex.createOffer(testToken.address, tokensBob, amountAlice, amountBob, [feeAlice, feeBob], [smallestChunkSize, deadline, minimumSale]);
    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountAlice).toLocaleString('fullwide', {useGrouping:false}));

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
    await dex.acceptOfferPartWithMinimum(0, tokensBob[0], smallestChunkSize);

    // Get the offer again, this time after it's been cancelled.
    let acceptedOffer = await dex.getOffer(0);

    const conversionnRate = amountAlice / amountBob[0];

    // Ensure everything adds up
    assert.equal(acceptedOffer.active, true);
    assert.equal(acceptedOffer.amountAlice.toString(), amountAlice.toString());
    assert.equal(acceptedOffer.amountRemaining.toString(), (amountAlice - smallestChunkSize).toString());
    assert.equal(acceptedOffer.amountBob.length, 2);
    assert.equal(acceptedOffer.tokenAlice, testToken.address);
    assert.equal(acceptedOffer.tokenBob.length, 2);
    assert.equal(acceptedOffer.offerer, userAddress);
    assert.equal(acceptedOffer.payoutAddress, userAddress);
    assert.equal(acceptedOffer.deadline, '0');
    assert.equal(acceptedOffer.minimumOrderAddresses[0], userAddress);
    assert.equal(acceptedOffer.minimumOrderAmountsBob[0], smallestChunkSize.toString());
    assert.equal(acceptedOffer.minimumOrderAmountsAlice[0], (smallestChunkSize * conversionnRate).toString());
    assert.equal(acceptedOffer.minimumOrderTokens[0], tokensBob[0]);

    // FAliceally make sure the tokens are moved to their proper places
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(finalUserTestTokenBalance.toString(), (initialUserTestTokenBalance - (amountAlice)).toLocaleString('fullwide', {useGrouping:false}));

    let finalUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(finalUserUSDTBalance.toString(), (initialUserUSDTBalance - (smallestChunkSize)).toLocaleString('fullwide', {useGrouping:false}));

    return;
    
  });

  it("should send tokens if the order minimum is reached", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountAlice = 50 * 10 ** 10;
    const amountBob = [10 * 10 ** 10, 20 * 10 ** 10];
    const feeAlice = 10;
    const feeBob = 20;
    const smallestChunkSize = 1 * 10 ** 10;
    const minimumSale = 2 * 10 ** 10;
    const deadline = 0;
    const conversionnRate = amountAlice / amountBob[0];
    const amountAfterFeeAlice = minimumSale * (1000 - feeAlice) / 1000;
    const amountAfterFeeBob = minimumSale * (1000 - feeBob) / 1000;

    // Get the user's address
    const userAddress = accounts[0];
    
    // Get Contract Alicestances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();
    let epicCoin = await EPICCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensBob = [usdt.address, epicCoin.address];

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
    await dex.createOffer(testToken.address, tokensBob, amountAlice, amountBob, [feeAlice, feeBob], [smallestChunkSize, deadline, minimumSale]);

    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountAlice).toLocaleString('fullwide', {useGrouping:false}));

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
    await dex.acceptOfferPartWithMinimum(0, tokensBob[0], minimumSale);

    // Get the offer again, this time after it's been cancelled.
    let acceptedOffer = await dex.getOffer(0);

    // Ensure everything adds up
    assert.equal(acceptedOffer.active, true);
    assert.equal(acceptedOffer.amountAlice.toString(), amountAlice.toString());
    assert.equal(acceptedOffer.amountRemaining.toString(), (amountAlice - (minimumSale)).toString());
    assert.equal(acceptedOffer.amountBob.length, 2);
    assert.equal(acceptedOffer.tokenAlice, testToken.address);
    assert.equal(acceptedOffer.tokenBob.length, 2);
    assert.equal(acceptedOffer.offerer, userAddress);
    assert.equal(acceptedOffer.payoutAddress, userAddress);
    assert.equal(acceptedOffer.deadline, '0');
    assert.equal(acceptedOffer.minimumOrderAddresses.length, 0);
    assert.equal(acceptedOffer.minimumOrderAmountsBob.length, 0);
    assert.equal(acceptedOffer.minimumOrderAmountsAlice.length, 0);
    assert.equal(acceptedOffer.minimumOrderTokens.length, 0);

    // FAliceally make sure the tokens are moved to their proper places
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);

    // We add 10000000 to the output because of a JS numbers issue
    assert.equal(finalUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountAlice + (amountAfterFeeAlice * conversionnRate)).toLocaleString('fullwide', {useGrouping:false}));

    let finalUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(finalUserUSDTBalance.toString(), (initialUserUSDTBalance - minimumSale + amountAfterFeeBob + 10000000).toLocaleString('fullwide', {useGrouping:false}));

    return;
    
  });

  it("should return tokens if the order minimum is not reached and offer is cancelled", async function () {
    // Define Constants
    const approvalAmount = 100000 * 10 ** 10;
    const amountAlice = 50 * 10 ** 10;
    const amountBob = [10 * 10 ** 10, 20 * 10 ** 10];
    const feeAlice = 10;
    const feeBob = 20;
    const smallestChunkSize = 1 * 10 ** 10;
    const minimumSale = 2 * 10 ** 10;
    const deadline = 0;
    const amountAfterFeeAlice = smallestChunkSize * (1000 - feeAlice) / 1000;
    const amountAfterFeeBob = amountBob[0] * (1000 - feeBob) / 1000;

    // Get the user's address
    const userAddress = accounts[0];
    
    // Get Contract Alicestances
    let dex = await MarsBaseExchange.new();
    let testToken = await TestToken.new();
    let usdt = await USDTCoin.new();
    let epicCoin = await EPICCoin.new();

    // Make a list of tokens we are willing to accept
    let tokensBob = [usdt.address, epicCoin.address];

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
    await dex.createOffer(testToken.address, tokensBob, amountAlice, amountBob, [feeAlice, feeBob], [smallestChunkSize, deadline, minimumSale]);
    // Get balance and validate that the tokens have been moved to the dex
    let createdUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(createdUserTestTokenBalance.toString(), (initialUserTestTokenBalance - amountAlice).toLocaleString('fullwide', {useGrouping:false}));

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
    await dex.acceptOfferPartWithMinimum(0, tokensBob[0], smallestChunkSize);

    // Get the offer again, this time after it's been cancelled.
    let acceptedOffer = await dex.getOffer(0);

    const conversionnRate = amountAlice / amountBob[0];

    // Ensure everything adds up
    assert.equal(acceptedOffer.active, true);
    assert.equal(acceptedOffer.amountAlice.toString(), amountAlice.toString());
    assert.equal(acceptedOffer.amountRemaining.toString(), (amountAlice - smallestChunkSize).toString());
    assert.equal(acceptedOffer.amountBob.length, 2);
    assert.equal(acceptedOffer.tokenAlice, testToken.address);
    assert.equal(acceptedOffer.tokenBob.length, 2);
    assert.equal(acceptedOffer.offerer, userAddress);
    assert.equal(acceptedOffer.payoutAddress, userAddress);
    assert.equal(acceptedOffer.deadline, '0');
    assert.equal(acceptedOffer.minimumOrderAddresses[0], userAddress);
    assert.equal(acceptedOffer.minimumOrderAmountsBob[0], smallestChunkSize.toString());
    assert.equal(acceptedOffer.minimumOrderAmountsAlice[0], (smallestChunkSize * conversionnRate).toString());
    assert.equal(acceptedOffer.minimumOrderTokens[0], tokensBob[0]);

    // Make sure the tokens are moved to their proper places
    let finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(finalUserTestTokenBalance.toString(), (initialUserTestTokenBalance - (amountAlice)).toLocaleString('fullwide', {useGrouping:false}));

    let finalUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(finalUserUSDTBalance.toString(), (initialUserUSDTBalance - (smallestChunkSize)).toLocaleString('fullwide', {useGrouping:false}));

    await dex.cancelOffer(0);

    let cancelledOffer = await dex.getOffer(0);

    // Ensure it's no longer active and the amount in is 0
    assert.equal(cancelledOffer.active, false);
    assert.equal(cancelledOffer.amountAlice.toString(), "0");
    assert.equal(cancelledOffer.amountBob.length, 0);
    assert.equal(cancelledOffer.tokenAlice, "0x0000000000000000000000000000000000000000");
    assert.equal(cancelledOffer.tokenBob.length, 0);
    assert.equal(cancelledOffer.offerer, "0x0000000000000000000000000000000000000000");
    assert.equal(cancelledOffer.payoutAddress, "0x0000000000000000000000000000000000000000");

    // Make sure the tokens are moved to their proper places
    finalUserTestTokenBalance = await testToken.balanceOf(userAddress);
    assert.equal(finalUserTestTokenBalance.toString(), initialUserTestTokenBalance.toLocaleString('fullwide', {useGrouping:false}));

    finalUserUSDTBalance = await usdt.balanceOf(userAddress);
    assert.equal(finalUserUSDTBalance.toString(), initialUserUSDTBalance.toLocaleString('fullwide', {useGrouping:false}));

    return;
    
  });

});