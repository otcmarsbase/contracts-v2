const assert = require('assert/strict');
const BigNumber = require('bignumber.js');
const { expect } = require('chai');
const { ethers } = require('hardhat');
const { checkEventExists } = require('../events');
const { prepareEnvironment, getLastBlockTime } = require('../utils');

const ETH = '0x0000000000000000000000000000000000000000';

describe('MAR-975', () => {
  it('should emit an OfferAccepted event with actual fee amounts, not percents', async () => {
    const { owner, alice, bob, usdt, bat, dex, parseLogs } =
      await prepareEnvironment();

    // console.log(99)

    const batAmount = '100000000000000000000';
    const usdtAmount = '100000000000000000000';
    await bat.transfer(alice.address, batAmount);
    await usdt.transfer(bob.address, usdtAmount);

    // console.log(98)
    await bat.connect(alice).approve(dex.address, batAmount);

    // console.log(97)
    let tx = await dex
      .connect(alice)
      .createOffer(bat.address, [usdt.address], batAmount, [usdtAmount], {
        cancelEnabled: true,
        modifyEnabled: false,
        holdTokens: true,
        feeAlice: 5,
        feeBob: 5,
        smallestChunkSize: '0',
        deadline: (await getLastBlockTime()) + 86400,
        minimumSize: '10000000000000',
      });
    // console.log(96)
    let receipt = await tx.wait();
    // console.log(95)
    // console.log(receipt.events)
    // console.log(94)
    // console.log(`id: ${id}`)

    await usdt.connect(bob).approve(dex.address, usdtAmount);

    tx = await dex
      .connect(bob)
      .acceptOffer(0, usdt.address, '60000000000000000');

    receipt = await tx.wait();

    checkEventExists(
      parseLogs(receipt.logs),
      'OfferAccepted',
      {
        amountAliceReceived: '59700000000000000',
        amountBobReceived: '59700000000000000',
        feeAlice: '300000000000000',
        feeBob: '300000000000000',
        tokenAddressAlice: bat.address,
        tokenAddressBob: usdt.address,
      },
      { exhaustive: false }
    );
  });
});
