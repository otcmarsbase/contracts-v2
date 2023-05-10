const assert = require('assert/strict');
const BigNumber = require('bignumber.js');
const { expect } = require('chai');
const { ethers } = require('hardhat');
const {
  checkEvent,
  checkEventExists,
  checkEventDoesntExist,
} = require('../events');
const { mintAll, expectBalances, approveMany } = require('../token-utils');
const {
  prepareEnvironment,
  getLastBlockTime,
  getOfferIdFromTx,
  getLogsFromTx,
} = require('../utils');

describe('bestbid/basic', () => {
  it('should sell to a single bidder', async () => {
    /*
			Scenario 1 (basic single bidder):
			1. Alice creates an offer
			2. Bob creates a bid
			3. Alice accepts Bob's bid, everyone gets their tokens
		*/
    let env = await prepareEnvironment();
    let { bb, mint, alice, bob, charlie, derek, bat, usdt, tether, parseLogs } =
      env;

    await approveMany(
      env,
      await mintAll(env, {
        alice: {
          bat: '100',
        },
        bob: {
          usdt: '500',
        },
      }),
      bb.address
    );

    let offerTx = await bb.connect(alice).createOffer({
      tokenAlice: bat.address,
      amountAlice: '100',

      tokensBob: [usdt.address, tether.address],

      feeAlice: '0',
      feeBob: '0',
    });
    let offerId = (await getLogsFromTx(offerTx)).find(
      (x) => x.name == 'OfferCreated'
    ).args.id;
    expect(offerId).equal('0');

    await expectBalances(env, {
      alice: {
        bat: '0',
        usdt: '0',
      },
      bob: {
        bat: '0',
        usdt: '500',
      },
    });

    let bidTx = await bb.connect(bob).createBid(offerId, usdt.address, '250');
    let bidId = (await getLogsFromTx(bidTx)).find((x) => x.name == 'BidCreated')
      .args.bidIdx;
    expect(bidId).equal('0');

    await expectBalances(env, {
      alice: {
        bat: '0',
        usdt: '0',
      },
      bob: {
        bat: '0',
        usdt: '250',
      },
    });

    await bb.connect(alice).acceptBid(offerId, bidId);

    await expectBalances(env, {
      alice: {
        bat: '0',
        usdt: '250',
      },
      bob: {
        bat: '100',
        usdt: '250',
      },
    });
  });
  it('should sell to multiple bidders', async () => {
    /*
			Scenario 2 (basic multiple bidders):
			1. Alice creates an offer
			2. Bob creates a bid
			3. Charlie creates a bid
			4. Alice accepts Charlie's bid, Bob gets tokens back
		*/
    let env = await prepareEnvironment();
    let { bb, mint, alice, bob, charlie, derek, bat, usdt, tether, parseLogs } =
      env;

    await approveMany(
      env,
      await mintAll(env, {
        alice: {
          bat: '100',
        },
        bob: {
          usdt: '500',
        },
        charlie: {
          tether: '500',
        },
      }),
      bb.address
    );

    let offerTx = await bb.connect(alice).createOffer({
      tokenAlice: bat.address,
      amountAlice: '100',

      tokensBob: [usdt.address, tether.address],

      feeAlice: '0',
      feeBob: '0',
    });
    let offerId = (await getLogsFromTx(offerTx)).find(
      (x) => x.name == 'OfferCreated'
    ).args.id;
    expect(offerId).equal('0');

    await expectBalances(env, {
      alice: {
        bat: '0',
        usdt: '0',
        tether: '0',
      },
      bob: {
        bat: '0',
        usdt: '500',
        tether: '0',
      },
      charlie: {
        bat: '0',
        tether: '500',
      },
      bb: {
        bat: '100',
        usdt: '0',
        tether: '0',
      },
    });

    let bidTx = await bb.connect(bob).createBid(offerId, usdt.address, '250');
    let bidId = (await getLogsFromTx(bidTx)).find((x) => x.name == 'BidCreated')
      .args.bidIdx;
    expect(bidId).equal('0');

    await expectBalances(env, {
      alice: {
        bat: '0',
        usdt: '0',
        tether: '0',
      },
      bob: {
        bat: '0',
        usdt: '250',
        tether: '0',
      },
      charlie: {
        bat: '0',
        tether: '500',
      },
      bb: {
        bat: '100',
        usdt: '250',
        tether: '0',
      },
    });

    let bid2Tx = await bb
      .connect(charlie)
      .createBid(offerId, tether.address, '350');
    let bid2Id = (await getLogsFromTx(bid2Tx)).find(
      (x) => x.name == 'BidCreated'
    ).args.bidIdx;
    expect(bid2Id).equal('1');

    await expectBalances(env, {
      alice: {
        bat: '0',
        usdt: '0',
        tether: '0',
      },
      bob: {
        bat: '0',
        usdt: '250',
        tether: '0',
      },
      charlie: {
        bat: '0',
        tether: '150',
      },
      bb: {
        bat: '100',
        usdt: '250',
        tether: '350',
      },
    });

    await bb.connect(alice).acceptBid(offerId, bid2Id);

    await expectBalances(env, {
      alice: {
        bat: '0',
        usdt: '0',
        tether: '350',
      },
      bob: {
        bat: '0',
        usdt: '500',
        tether: '0',
      },
      charlie: {
        bat: '100',
        tether: '150',
      },
      bb: {
        bat: '0',
        usdt: '0',
        tether: '0',
      },
    });
  });
  it('should cancel offer before any bids', async () => {
    /*
			Scenario 3 (cancel offer before any bids):
			1. Alice creates an offer
			2. Alice cancels the offer and gets tokens back
		*/
    let env = await prepareEnvironment();
    let { bb, mint, alice, bob, charlie, derek, bat, usdt, tether, parseLogs } =
      env;

    await approveMany(
      env,
      await mintAll(env, {
        alice: {
          bat: '100',
        },
      }),
      bb.address
    );

    let offerTx = await bb.connect(alice).createOffer({
      tokenAlice: bat.address,
      amountAlice: '100',

      tokensBob: [usdt.address, tether.address],

      feeAlice: '0',
      feeBob: '0',
    });
    let offerId = (await getLogsFromTx(offerTx)).find(
      (x) => x.name == 'OfferCreated'
    ).args.id;
    expect(offerId).equal('0');

    await expectBalances(env, {
      alice: {
        bat: '0',
        usdt: '0',
      },
      bb: {
        bat: '100',
        usdt: '0',
      },
    });

    await bb.connect(alice).cancelOffer(offerId);

    await expectBalances(env, {
      alice: {
        bat: '100',
        usdt: '0',
      },
      bb: {
        bat: '0',
        usdt: '0',
      },
    });
  });
  it('should cancel offer after some bids', async () => {
    /*
			Scenario 4 (cancel offer with bids):
			1. Alice creates an offer
			2. Bob creates a bid
			3. Charlie creates a bid
			4. Alice cancels the offer, everyone gets money back
		*/
    let env = await prepareEnvironment();
    let { bb, mint, alice, bob, charlie, derek, bat, usdt, tether, parseLogs } =
      env;

    await approveMany(
      env,
      await mintAll(env, {
        alice: {
          bat: '100',
        },
        bob: {
          usdt: '500',
        },
        charlie: {
          tether: '500',
        },
      }),
      bb.address
    );

    let offerTx = await bb.connect(alice).createOffer({
      tokenAlice: bat.address,
      amountAlice: '100',

      tokensBob: [usdt.address, tether.address],

      feeAlice: '0',
      feeBob: '0',
    });
    let offerId = (await getLogsFromTx(offerTx)).find(
      (x) => x.name == 'OfferCreated'
    ).args.id;
    expect(offerId).equal('0');

    await expectBalances(env, {
      alice: {
        bat: '0',
        usdt: '0',
        tether: '0',
      },
      bob: {
        bat: '0',
        usdt: '500',
        tether: '0',
      },
      charlie: {
        bat: '0',
        tether: '500',
      },
      bb: {
        bat: '100',
        usdt: '0',
        tether: '0',
      },
    });

    let bidTx = await bb.connect(bob).createBid(offerId, usdt.address, '250');
    let bidId = (await getLogsFromTx(bidTx)).find((x) => x.name == 'BidCreated')
      .args.bidIdx;
    expect(bidId).equal('0');

    await expectBalances(env, {
      alice: {
        bat: '0',
        usdt: '0',
        tether: '0',
      },
      bob: {
        bat: '0',
        usdt: '250',
        tether: '0',
      },
      charlie: {
        bat: '0',
        tether: '500',
      },
      bb: {
        bat: '100',
        usdt: '250',
        tether: '0',
      },
    });

    let bid2Tx = await bb
      .connect(charlie)
      .createBid(offerId, tether.address, '350');
    let bid2Id = (await getLogsFromTx(bid2Tx)).find(
      (x) => x.name == 'BidCreated'
    ).args.bidIdx;
    expect(bid2Id).equal('1');

    await expectBalances(env, {
      alice: {
        bat: '0',
        usdt: '0',
        tether: '0',
      },
      bob: {
        bat: '0',
        usdt: '250',
        tether: '0',
      },
      charlie: {
        bat: '0',
        tether: '150',
      },
      bb: {
        bat: '100',
        usdt: '250',
        tether: '350',
      },
    });

    await bb.connect(alice).cancelOffer(offerId);

    await expectBalances(env, {
      alice: {
        bat: '100',
        usdt: '0',
        tether: '0',
      },
      bob: {
        bat: '0',
        usdt: '500',
        tether: '0',
      },
      charlie: {
        bat: '0',
        tether: '500',
      },
      bb: {
        bat: '0',
        usdt: '0',
        tether: '0',
      },
    });
  });
  it('should cancel bids', async () => {
    /*
			Scenario 5 (cancel bid):
			1. Alice creates an offer
			2. Bob creates a bid
			3. Charlie creates a bid
			4. Bob cancels his bid
			5. Alice accepts Charlie's bid
		*/
    let env = await prepareEnvironment();
    let { bb, mint, alice, bob, charlie, derek, bat, usdt, tether, parseLogs } =
      env;

    await approveMany(
      env,
      await mintAll(env, {
        alice: {
          bat: '100',
        },
        bob: {
          usdt: '500',
        },
        charlie: {
          tether: '500',
        },
      }),
      bb.address
    );

    let offerTx = await bb.connect(alice).createOffer({
      tokenAlice: bat.address,
      amountAlice: '100',

      tokensBob: [usdt.address, tether.address],

      feeAlice: '0',
      feeBob: '0',
    });
    let offerId = (await getLogsFromTx(offerTx)).find(
      (x) => x.name == 'OfferCreated'
    ).args.id;
    expect(offerId).equal('0');

    await expectBalances(env, {
      alice: {
        bat: '0',
        usdt: '0',
        tether: '0',
      },
      bob: {
        bat: '0',
        usdt: '500',
        tether: '0',
      },
      charlie: {
        bat: '0',
        tether: '500',
      },
      bb: {
        bat: '100',
        usdt: '0',
        tether: '0',
      },
    });

    let bidTx = await bb.connect(bob).createBid(offerId, usdt.address, '250');
    let bidId = (await getLogsFromTx(bidTx)).find((x) => x.name == 'BidCreated')
      .args.bidIdx;
    expect(bidId).equal('0');

    await expectBalances(env, {
      alice: {
        bat: '0',
        usdt: '0',
        tether: '0',
      },
      bob: {
        bat: '0',
        usdt: '250',
        tether: '0',
      },
      charlie: {
        bat: '0',
        tether: '500',
      },
      bb: {
        bat: '100',
        usdt: '250',
        tether: '0',
      },
    });

    let bid2Tx = await bb
      .connect(charlie)
      .createBid(offerId, tether.address, '350');
    let bid2Id = (await getLogsFromTx(bid2Tx)).find(
      (x) => x.name == 'BidCreated'
    ).args.bidIdx;
    expect(bid2Id).equal('1');

    await expectBalances(env, {
      alice: {
        bat: '0',
        usdt: '0',
        tether: '0',
      },
      bob: {
        bat: '0',
        usdt: '250',
        tether: '0',
      },
      charlie: {
        bat: '0',
        tether: '150',
      },
      bb: {
        bat: '100',
        usdt: '250',
        tether: '350',
      },
    });

    let cancelTx = await bb.connect(bob).cancelBid(offerId, bidId);

    await expectBalances(env, {
      alice: {
        bat: '0',
        usdt: '0',
        tether: '0',
      },
      bob: {
        bat: '0',
        usdt: '500',
        tether: '0',
      },
      charlie: {
        bat: '0',
        tether: '150',
      },
      bb: {
        bat: '100',
        usdt: '0',
        tether: '350',
      },
    });

    await bb.connect(alice).acceptBid(offerId, bid2Id);

    await expectBalances(env, {
      alice: {
        bat: '0',
        usdt: '0',
        tether: '350',
      },
      bob: {
        bat: '0',
        usdt: '500',
        tether: '0',
      },
      charlie: {
        bat: '100',
        tether: '150',
      },
      bb: {
        bat: '0',
        usdt: '0',
        tether: '0',
      },
    });
  });
  it('should fail if maximum bids count reached', async () => {
    let env = await prepareEnvironment();
    let { bb, alice, bob, charlie, derek, bat, usdt, tether } = env;
    await bb.setMaxBidsCount(2);

    expect(await bb.maxBidsCount()).equal('2');

    await approveMany(
      env,
      await mintAll(env, {
        alice: {
          bat: '100',
        },
        bob: {
          usdt: '500',
        },
        charlie: {
          tether: '500',
        },
        derek: {
          tether: '500',
        },
      }),
      bb.address
    );

    let offerTx = await bb.connect(alice).createOffer({
      tokenAlice: bat.address,
      amountAlice: '100',

      tokensBob: [usdt.address, tether.address],

      feeAlice: '0',
      feeBob: '0',
    });
    let offerId = (await getLogsFromTx(offerTx)).find(
      (x) => x.name == 'OfferCreated'
    ).args.id;
    expect(offerId).equal('0');

    // create bids
    let bidTx = await bb.connect(bob).createBid(offerId, usdt.address, '250');
    let bidId = (await getLogsFromTx(bidTx)).find((x) => x.name == 'BidCreated')
      .args.bidIdx;
    expect(bidId).equal('0');

    let bid2Tx = await bb
      .connect(charlie)
      .createBid(offerId, tether.address, '350');
    let bid2Id = (await getLogsFromTx(bid2Tx)).find(
      (x) => x.name == 'BidCreated'
    ).args.bidIdx;
    expect(bid2Id).equal('1');

    let bid3Tx = bb.connect(derek).createBid(offerId, tether.address, '450');
    expect(bid3Tx).to.be.revertedWith('406-MAXBCE');
  });
  it('should fail if use feeAlice and feeBob that are greater than the maximum fee', async () => {
    let env = await prepareEnvironment();
    let { bb, alice, bat, usdt, tether } = env;

    await approveMany(
      env,
      await mintAll(env, {
        alice: {
          bat: '100',
        },
      }),
      bb.address
    );

    let failedOffer = bb.connect(alice).createOffer({
      tokenAlice: bat.address,
      amountAlice: '100',

      tokensBob: [usdt.address, tether.address],

      feeAlice: '2000', // 2%
      feeBob: '0',
    });

    await expect(failedOffer).to.be.revertedWith('400-FI');
  });
  it('should fail if use feeAlice and feeBob that are smaller than the minimum fee', async () => {
    let env = await prepareEnvironment();
    let { bb, alice, bat, usdt, tether } = env;

    await bb.setMinimumFee(500); //0.5%

    await approveMany(
      env,
      await mintAll(env, {
        alice: {
          bat: '100',
        },
      }),
      bb.address
    );

    let failedOffer = bb.connect(alice).createOffer({
      tokenAlice: bat.address,
      amountAlice: '100',

      tokensBob: [usdt.address, tether.address],

      feeAlice: '200',
      feeBob: '200',
    });

    await expect(failedOffer).to.be.revertedWith('400-FI');
  });

  describe('setMaxBidsCount', () => {
    it('should allow owner to call', async () => {
      let env = await prepareEnvironment();
      let { bb } = env;
      await bb.setMaxBidsCount(100);
      expect(await bb.maxBidsCount()).equal('100');
    });
    it('should fail if attempt to set the value to 0', async () => {
      let env = await prepareEnvironment();
      let { bb } = env;
      await expect(bb.setMaxBidsCount(0)).to.be.revertedWith('400-IMAXBC');
    });
    it('should fail if a non-owner try to call', async () => {
      let env = await prepareEnvironment();
      let { bb, alice } = env;
      await expect(bb.connect(alice).setMaxBidsCount(100)).to.be.revertedWith(
        '403'
      );
    });
  });
});
