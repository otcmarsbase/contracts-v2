const assert = require('assert/strict');
const BigNumber = require('bignumber.js');
const { expect } = require('chai');
const { ethers } = require('hardhat');
const { createOfferTokenToken } = require('../create-offer');
const {
  checkEvent,
  checkEventExists,
  checkEventDoesntExist,
} = require('../events');
const { mintAll, expectBalances, approveMany } = require('../token-utils');
const {
  prepareEnvironment,
  ZERO,
  getOfferIdFromTx,
  getOfferDataFromTx,
} = require('../utils');

describe('missing/migrate', () => {
  it('should lock contract');
  it('should not lock contract for non-owner');
  it('should prevent locked contract from creating offers');
  it('should prevent locked contract from creating bids');
  it('should not prevent locked contract from cancelling offers');
  it('should not prevent locked contract from closing offers after deadline');

  it('should cancel offers in the locked contract');

  it('should return all bids to respective owners after cancel', async () => {
    let env = await prepareEnvironment();
    let { dex, mint, alice, bob, charlie, bat, usdt, parseLogs } = env;

    const balances = {
      alice: {
        usdt: '100000000000000000',
      },
      bob: {
        bat: '100000000000000000',
      },
      charlie: {
        usdt: '100000000000000000',
        bat: '100000000000000000',
      },
    };
    const BN_BALANCES = {
      alice: {
        usdt: new BigNumber(balances.alice.usdt),
        bat: new BigNumber(0),
      },
      bob: {
        usdt: new BigNumber(0),
        bat: new BigNumber(balances.bob.bat),
      },
      charlie: {
        usdt: new BigNumber(balances.charlie.usdt),
        bat: new BigNumber(balances.charlie.bat),
      },
    };
    await mintAll(env, balances);
    await approveMany(env, balances);

    async function createOffer(amountAlice, amountBob, params) {
      // await mintAll(env, {
      // 	alice: {
      // 		usdt: amountAlice
      // 	}
      // })
      // await usdt.connect(alice).approve(dex.address, amountAlice)
      return await createOfferTokenToken(
        dex.connect(alice),
        usdt.address,
        amountAlice,
        bat.address,
        amountBob,
        {
          feeAlice: '0',
          feeBob: '0',
          ...params,
        }
      );
    }
    async function createBid(offerId, bidder, amount) {
      return dex.connect(bidder).acceptOffer(offerId, bat.address, amount);
    }
    function exchange(BN_BALANCES, a, b) {
      let [name1, token1, amount1] = a.split('.');
      let [name2, token2, amount2] = b.split('.');

      BN_BALANCES[name1][token1] = BN_BALANCES[name1][token1].minus(amount1);
      BN_BALANCES[name2][token1] = BN_BALANCES[name2][token1].plus(amount1);

      BN_BALANCES[name2][token2] = BN_BALANCES[name2][token2].minus(amount2);
      BN_BALANCES[name1][token2] = BN_BALANCES[name1][token2].plus(amount2);
    }

    // dynamic bought part
    let offer0 = await createOffer('100', '200', {});
    await createBid(offer0.id, bob, '50');
    exchange(BN_BALANCES, 'alice.usdt.25', 'bob.bat.50');

    // dynamic bought all
    let offer1 = await createOffer('200', '100', {});
    await createBid(offer1.id, bob, '100');
    exchange(BN_BALANCES, 'alice.usdt.200', 'bob.bat.100');

    // dynamic two bidders, not bought out completely
    let offer2 = await createOffer('100', '200', {});
    await createBid(offer2.id, bob, '50');
    await createBid(offer2.id, charlie, '100');
    exchange(BN_BALANCES, 'alice.usdt.25', 'bob.bat.50');
    exchange(BN_BALANCES, 'alice.usdt.50', 'charlie.bat.100');

    // dynamic two bidders, bought out completely
    let offer3 = await createOffer('100', '200', {});
    await createBid(offer3.id, bob, '100');
    exchange(BN_BALANCES, 'alice.usdt.50', 'bob.bat.100');
    await createBid(offer3.id, charlie, '100');
    exchange(BN_BALANCES, 'alice.usdt.50', 'charlie.bat.100');

    // dynamic minimum size not bought out completely
    let offer4 = await createOffer('100', '200', { minimumSize: '75' });
    await createBid(offer4.id, bob, '50');
    await createBid(offer4.id, charlie, '50');

    // dynamic minimum size bought out more than min size
    let offer4a = await createOffer('100', '200', { minimumSize: '75' });
    await createBid(offer4a.id, bob, '50');
    exchange(BN_BALANCES, 'alice.usdt.25', 'bob.bat.50');
    await createBid(offer4a.id, charlie, '100');
    exchange(BN_BALANCES, 'alice.usdt.50', 'charlie.bat.100');

    // dynamic no bids
    let offer5 = await createOffer('100', '200', {});

    // dynamic no bids minimum size
    let offer5a = await createOffer('100', '200', {
      minimumSize: '100',
    });

    // dynamic cancelDisabled
    let offer6 = await createOffer('100', '200', {
      cancelEnabled: false,
      modifyEnabled: false,
    });

    // static no bids
    let offer7 = await createOffer('100', '200', {
      cancelEnabled: false,
      modifyEnabled: false,
      holdTokens: true,
    });

    // static no bids minimum size
    let offer8 = await createOffer('100', '200', {
      cancelEnabled: false,
      modifyEnabled: false,
      holdTokens: true,
      minimumSize: '100',
    });

    // static two bidders
    let offer9 = await createOffer('100', '200', {
      cancelEnabled: false,
      modifyEnabled: false,
      holdTokens: true,
    });
    await createBid(offer9.id, bob, '50');
    exchange(BN_BALANCES, 'alice.usdt.25', 'bob.bat.50');
    await createBid(offer9.id, charlie, '100');
    exchange(BN_BALANCES, 'alice.usdt.50', 'charlie.bat.100');

    // static two bidders min size
    let offer10 = await createOffer('100', '200', {
      cancelEnabled: false,
      modifyEnabled: false,
      holdTokens: true,
      minimumSize: '80',
    });
    await createBid(offer10.id, bob, '50');
    // exchange(BN_BALANCES, "alice.usdt.25", "bob.bat.50")
    await createBid(offer10.id, charlie, '100');
    // exchange(BN_BALANCES, "alice.usdt.50", "charlie.bat.100")

    let txMigrate = await dex.migrateContract();
    await txMigrate.wait();

    await expectBalances(env, BN_BALANCES);
  });
});
