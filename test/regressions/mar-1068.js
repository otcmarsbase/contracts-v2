const assert = require('assert/strict');
const BigNumber = require('bignumber.js');
const { expect } = require('chai');
const { ethers } = require('hardhat');
const { prepareEnvironment, getLastBlockTime } = require('../utils');

const ETH = '0x0000000000000000000000000000000000000000';

describe('MAR-1068', () => {
  it('should make sure value is the same as amount alice when creating an offer in ETH', async () => {
    const { owner, alice, bob, usdt, bat, dex, parseLogs } =
      await prepareEnvironment();

    // console.log(99)

    const ethAmount = '100000000000000000000';
    const usdtAmount = '100000000000000000000';
    await usdt.transfer(bob.address, usdtAmount);

    // console.log(97)
    let tx = dex.connect(alice).createOffer(
      ETH,
      [usdt.address],
      ethAmount,
      [usdtAmount],
      {
        cancelEnabled: true,
        modifyEnabled: false,
        holdTokens: true,
        feeAlice: 5,
        feeBob: 5,
        smallestChunkSize: '0',
        deadline: (await getLastBlockTime()) + 86400,
        minimumSize: '1000000000000000000',
      },
      { value: '1000000' }
    );

    expect(tx).to.be.revertedWith('T1a');
  });

  it('should make sure value is not zero when creating an offer in ETH', async () => {
    const { owner, alice, bob, usdt, bat, dex, parseLogs } =
      await prepareEnvironment();

    // console.log(99)

    const ethAmount = '100000000000000000000';
    const usdtAmount = '100000000000000000000';
    await usdt.transfer(bob.address, usdtAmount);

    // console.log(97)
    let tx = dex.connect(alice).createOffer(
      ETH,
      [usdt.address],
      ethAmount,
      [usdtAmount],
      {
        cancelEnabled: true,
        modifyEnabled: false,
        holdTokens: true,
        feeAlice: 5,
        feeBob: 5,
        smallestChunkSize: '0',
        deadline: (await getLastBlockTime()) + 86400,
        minimumSize: '1000000000000000000',
      },
      { value: '0' }
    );

    expect(tx).to.be.revertedWith('M3');
  });
});
