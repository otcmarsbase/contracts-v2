const assert = require('assert/strict');
const BigNumber = require('bignumber.js');
const { expect } = require('chai');
const { ethers } = require('hardhat');
const {
  createOfferTokenToken,
  sensibleOfferDefaults,
} = require('../create-offer');
const {
  checkEvent,
  checkEventExists,
  checkEventDoesntExist,
} = require('../events');
const { mintAll, approveMany, expectBalances } = require('../token-utils');
const {
  prepareEnvironment,
  ZERO,
  getOfferIdFromTx,
  getOfferDataFromTx,
  skipTime,
  skipTimeTo,
  getLastBlockTime,
} = require('../utils');

describe('dynamic offers with deadlines', () => {
  it('should create an offer without deadline', async () => {
    let env = await prepareEnvironment();
    let { dex, mint, alice, bob, charlie, derek, bat, usdt, parseLogs } = env;

    await approveMany(
      env,
      await mintAll(env, {
        alice: {
          usdt: '100',
        },
        bob: {
          bat: '50',
        },
      })
    );

    let tx = await dex
      .connect(alice)
      .createOffer(usdt.address, [bat.address], '100', ['200'], {
        ...sensibleOfferDefaults(),
        deadline: '0',
      });
    await tx.wait();
    await expectBalances(env, {
      alice: {
        usdt: '0',
        bat: '0',
      },
      bob: {
        usdt: '0',
        bat: '50',
      },
    });
    let txBid = await dex.connect(bob).acceptOffer('0', bat.address, '50');
    await txBid.wait();

    await expectBalances(env, {
      alice: {
        usdt: '0',
        bat: '50',
      },
      bob: {
        usdt: '25',
        bat: '0',
      },
    });
  });
  it('should create an offer with deadline in the future', async () => {
    let env = await prepareEnvironment();
    let { dex, mint, alice, bob, charlie, derek, bat, usdt, parseLogs } = env;

    await approveMany(
      env,
      await mintAll(env, {
        alice: {
          usdt: '100',
        },
        bob: {
          bat: '50',
        },
      })
    );

    let deadline = (await getLastBlockTime()) + 5;

    let tx = await dex
      .connect(alice)
      .createOffer(usdt.address, [bat.address], '100', ['200'], {
        ...sensibleOfferDefaults(),
        deadline: deadline.toString(),
      });
    await tx.wait();
    await expectBalances(env, {
      alice: {
        usdt: '0',
        bat: '0',
      },
      bob: {
        usdt: '0',
        bat: '50',
      },
    });
    let txBid = await dex.connect(bob).acceptOffer('0', bat.address, '25');
    await txBid.wait();

    await skipTimeTo(deadline - 2);

    let txBid2 = await dex.connect(bob).acceptOffer('0', bat.address, '25');
    await txBid2.wait();

    await expectBalances(env, {
      alice: {
        usdt: '0',
        bat: '50',
      },
      bob: {
        usdt: '24',
        bat: '0',
      },
    });
  });
  it('should not create an offer with deadline in the past', async () => {
    let env = await prepareEnvironment();
    let { dex, mint, alice, bob, charlie, derek, bat, usdt, parseLogs } = env;

    await approveMany(
      env,
      await mintAll(env, {
        alice: {
          usdt: '100',
        },
        bob: {
          bat: '50',
        },
      })
    );

    let now = await getLastBlockTime();
    let deadline = now - 1;

    await expect(
      dex
        .connect(alice)
        .createOffer(usdt.address, [bat.address], '100', ['200'], {
          ...sensibleOfferDefaults(),
          deadline: deadline.toString(),
        })
    ).revertedWith('405-OD');
  });
  it('should not bid in an expired offer', async () => {
    let env = await prepareEnvironment();
    let { dex, mint, alice, bob, charlie, derek, bat, usdt, parseLogs } = env;

    await approveMany(
      env,
      await mintAll(env, {
        alice: {
          usdt: '100',
        },
        bob: {
          bat: '50',
        },
        charlie: {
          bat: '100',
        },
        derek: {
          bat: '50',
        },
      })
    );

    let deadline = (await getLastBlockTime()) + 10;
    let offer = await createOfferTokenToken(
      dex.connect(alice),
      usdt.address,
      '100',
      bat.address,
      '200',
      {
        feeAlice: '0',
        feeBob: '0',
        minimumSize: '75',
        deadline: deadline.toString(),
      }
    );
    await dex.connect(bob).acceptOffer(offer.id, bat.address, '25');
    await expectBalances(env, {
      alice: {
        usdt: '0',
        bat: '0',
      },
      bob: {
        usdt: '0',
        bat: '25',
      },
      charlie: {
        usdt: '0',
        bat: '100',
      },
    });

    await skipTimeTo(deadline - 5);

    await dex.connect(bob).acceptOffer(offer.id, bat.address, '25');

    await skipTimeTo(deadline + 1);

    await expect(
      dex.connect(bob).acceptOffer(offer.id, bat.address, '25')
    ).revertedWith('405-D');
  });
  it('should take out money from a successful expired offer as offermaker');
  it('should take out money from a successful expired offer as a bidder');
  it('should revert money from cancelled expired offer as offermaker');
  it('should revert money from cancelled expired offer as a bidder');
});
describe('static offers with deadlines', () => {
  it('should not bid in an expired offer');
  it('should take out money from a successful expired offer as offermaker');

  it('should take out money from a successful expired offer as a bidder', async () => {
    let env = await prepareEnvironment();
    let { dex, mint, alice, bob, charlie, derek, bat, usdt, parseLogs } = env;

    await approveMany(
      env,
      await mintAll(env, {
        alice: {
          usdt: '100',
        },
        bob: {
          bat: '50',
        },
      })
    );

    let deadline = (await getLastBlockTime()) + 5;

    let tx = await dex
      .connect(alice)
      .createOffer(usdt.address, [bat.address], '100', ['200'], {
        ...sensibleOfferDefaults(),
        holdTokens: true,
        deadline: deadline.toString(),
      });
    await tx.wait();
    await expectBalances(env, {
      alice: {
        usdt: '0',
        bat: '0',
      },
      bob: {
        usdt: '0',
        bat: '50',
      },
    });
    let txBid = await dex.connect(bob).acceptOffer('0', bat.address, '25');
    await txBid.wait();

    await skipTimeTo(deadline - 2);

    let txBid2 = await dex.connect(bob).acceptOffer('0', bat.address, '25');
    await txBid2.wait();

    await skipTimeTo(deadline + 1);

    await expectBalances(env, {
      alice: {
        usdt: '0',
        bat: '0',
      },
      bob: {
        usdt: '0',
        bat: '0',
      },
    });

    let txClose = await dex.connect(bob).closeExpiredOffer('0');
    await txClose.wait();

    await expectBalances(env, {
      alice: {
        usdt: '76',
        bat: '50',
      },
      bob: {
        usdt: '24',
        bat: '0',
      },
    });
  });
  it('should revert money from cancelled expired offer as offermaker');
  it('should revert money from cancelled expired offer as a bidder');
});
