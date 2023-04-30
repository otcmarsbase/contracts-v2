const assert = require('assert/strict');
const BigNumber = require('bignumber.js');
const { expect } = require('chai');
const { ethers } = require('hardhat');
const { createOfferTokenToken } = require('../create-offer');
const { approveMany, mintAll, expectBalances } = require('../token-utils');
const { prepareEnvironment, ZERO } = require('../utils');

describe('MAR-1358', () => {
  it('should correctly trade usdt', async () => {
    let env = await prepareEnvironment();
    let { dex, mint, alice, bob, charlie, bat, tether, parseLogs } = env;

    const balances = {
      alice: {
        tether: '100',
      },
      bob: {
        bat: '50',
      },
      charlie: {
        bat: '100',
      },
    };
    await mintAll(env, balances);
    await approveMany(env, balances);

    let offer = await createOfferTokenToken(
      dex.connect(alice),
      tether.address,
      '100',
      bat.address,
      '200',
      {
        feeAlice: '0',
        feeBob: '0',
        minimumSize: '75',
      }
    );

    await dex.connect(bob).acceptOffer(offer.id, bat.address, '50');
    await expectBalances(env, {
      alice: {
        tether: '0',
        bat: '0',
      },
      bob: {
        tether: '0',
        bat: '0',
      },
      charlie: {
        tether: '0',
        bat: '100',
      },
    });
  });
});
