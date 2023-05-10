const assert = require('assert/strict');
const BigNumber = require('bignumber.js');
const { expect } = require('chai');
const { ethers } = require('hardhat');
const { prepareEnvironment, getLastBlockTime } = require('../utils');

const ETH = '0x0000000000000000000000000000000000000000';

describe('MAR-1087', () => {
  it('should not allow static offers to have bids placed after the deadline is passed', async () => {
    const { owner, alice, bob, usdt, bat, dex, parseLogs } =
      await prepareEnvironment();

    // console.log(99)

    const batAmount = '100000000000000000000';
    const usdtAmount = '100000000000000000000';
    await bat.transfer(alice.address, batAmount);
    await usdt.transfer(bob.address, usdtAmount);

    // console.log(98)
    await bat.connect(alice).approve(dex.address, batAmount);

    let tx = await dex
      .connect(alice)
      .createOffer(bat.address, [usdt.address], batAmount, [usdtAmount], {
        cancelEnabled: true,
        modifyEnabled: false,
        holdTokens: true,
        feeAlice: 5,
        feeBob: 5,
        smallestChunkSize: '0',
        deadline: (await getLastBlockTime()) + 1000,
        minimumSize: '1000000000000000000',
      });
    // console.log(96)
    let receipt = await tx.wait();
    // console.log(95)
    // console.log(receipt.events)
    // console.log(94)
    // console.log(`id: ${id}`)

    await usdt.connect(bob).approve(dex.address, usdtAmount);

    await network.provider.send('evm_increaseTime', [3600]);
    await network.provider.send('evm_mine');

    await expect(
      dex.connect(bob).acceptOffer(0, usdt.address, '60000000000000000')
    ).to.be.revertedWith('405-D');
  });
});
