const assert = require('assert/strict');
const BigNumber = require('bignumber.js');
const { expect } = require('chai');
const { ethers } = require('hardhat');
const {
  checkEvent,
  checkEventExists,
  checkEventDoesntExist,
} = require('../events');
const {
  prepareEnvironment,
  ZERO,
  getOfferIdFromTx,
  getOfferDataFromTx,
} = require('../utils');

const dd = (n) => '0'.repeat(n);

const nth = (arr, n) => (n >= 0 ? arr[n] : arr[arr.length + n]);
const removeByIdxs = (arr, ...idxs) => arr.filter((_, i) => !idxs.includes(i));

const emptyDefaults = (extra = {}) => ({
  modifyEnabled: false,
  cancelEnabled: false,
  holdTokens: false,
  feeAlice: '0',
  feeBob: '0',
  minimumSize: '0',
  smallestChunkSize: '0',
  deadline: 0,
  ...extra,
});

const INSUFFICIENT_ALLOWANCE = 'ERC20: insufficient allowance';
const INSUFFICIENT_BALANCE = 'ERC20: transfer amount exceeds balance';

const OfferCloseReason = {
  Success: 0,
  CancelledBySeller: 1,
  DeadlinePassed: 2,
};

describe('missing/dynamic-offer', () => {
  describe('create offer', () => {
    it('should fail to create offer with insufficient allowance', async () => {
      let { dex, owner, alice, bob, charlie, usdt, bat, mint } =
        await prepareEnvironment();

      let amountAlice = '1';

      await mint.usdt(alice.address, amountAlice);

      let tx = dex
        .connect(alice)
        .createOffer(
          usdt.address,
          [bat.address],
          amountAlice,
          ['1'],
          emptyDefaults()
        );
      await expect(tx).revertedWith(INSUFFICIENT_ALLOWANCE);
    });
    it('should fail to create offer with insufficient tokens but enough allowance', async () => {
      let { dex, owner, alice, bob, charlie, usdt, bat, mint } =
        await prepareEnvironment();

      let amountAlice = '1';

      await usdt.connect(alice).approve(dex.address, amountAlice);

      let tx = dex
        .connect(alice)
        .createOffer(
          usdt.address,
          [bat.address],
          amountAlice,
          ['1'],
          emptyDefaults()
        );
      await expect(tx).revertedWith(INSUFFICIENT_BALANCE);
    });

    it('should create a simple dynamic offer token-to-token no cancel no modify no hold no minimum', async () => {
      let { dex, owner, alice, bob, charlie, usdt, bat, mint, parseLogs } =
        await prepareEnvironment();

      const amountAlice = '123' + dd(6);
      const amountBob = '456' + dd(18);

      await mint.usdt(alice.address, amountAlice);
      await usdt.connect(alice).approve(dex.address, amountAlice);

      let txCreate = await dex
        .connect(alice)
        .createOffer(
          usdt.address,
          [bat.address],
          amountAlice,
          [amountBob],
          emptyDefaults()
        );
      let receipt = await txCreate.wait();
      let logs = parseLogs(receipt.logs);

      expect(logs).length(3);

      checkEvent(logs[0], 'Approval', {
        owner: alice.address,
        spender: dex.address,
        value: '0',
      });

      checkEvent(logs[1], 'Transfer', {
        from: alice.address,
        to: dex.address,
        value: amountAlice,
      });

      checkEvent(
        logs[2],
        'OfferCreated',
        {
          offerId: '0',
          sender: alice.address,
        },
        { exhaustive: false }
      );

      let eventOfferData = logs[2].args.offer;
      expect(eventOfferData.active).eq(true);
      expect(eventOfferData.minimumMet).eq(false);
      expect(eventOfferData.offerId).eq('0');
      expect(eventOfferData.amountAlice).eq(amountAlice);
      expect(eventOfferData.feeAlice).eq('0');
      expect(eventOfferData.feeBob).eq('0');
      expect(eventOfferData.smallestChunkSize).eq('0');
      expect(eventOfferData.minimumSize).eq('0');
      expect(eventOfferData.deadline).eq('0');
      expect(eventOfferData.amountRemaining).eq(amountAlice);
      expect(eventOfferData.offerer).eq(alice.address);
      expect(eventOfferData.payoutAddress).eq(alice.address);
      expect(eventOfferData.tokenAlice).eq(usdt.address);

      expect(eventOfferData.capabilities).eql([false, false, false]);

      expect(eventOfferData.amountBob).length(1);
      expect(eventOfferData.amountBob[0]).eq(amountBob);

      expect(eventOfferData.minimumOrderAmountsAlice).length(0);
      expect(eventOfferData.minimumOrderAmountsBob).length(0);
      expect(eventOfferData.minimumOrderAddresses).length(0);
      expect(eventOfferData.minimumOrderTokens).length(0);

      expect(eventOfferData.tokenBob).length(1);
      expect(eventOfferData.tokenBob[0]).eq(bat.address);

      let nextOfferId = await dex.getNextOfferId();
      expect(nextOfferId).eq('1');
      let offer = await dex.getOffer('0');
      expect(offer).eql(eventOfferData);
      let offers = await dex.getAllOffers();
      expect(offers).length(1);
      expect(offers[0]).eql(eventOfferData);
    });
  });
  describe('make a bid', () => {
    it('should not make a bid if tokens are not approved', async () => {
      let { dex, owner, alice, bob, charlie, usdt, bat, mint } =
        await prepareEnvironment();

      const amountAlice = '100' + dd(6);
      const amountBob = '200' + dd(18);

      await mint.usdt(alice.address, amountAlice);
      await usdt.connect(alice).approve(dex.address, amountAlice);

      let txCreate = await dex
        .connect(alice)
        .createOffer(
          usdt.address,
          [bat.address],
          amountAlice,
          [amountBob],
          emptyDefaults()
        );
      let offerId = await getOfferIdFromTx(txCreate);

      await mint.bat(bob.address, amountBob);
      let txBid = dex.connect(bob).acceptOffer(offerId, bat.address, amountBob);
      await expect(txBid).revertedWith(INSUFFICIENT_ALLOWANCE);
    });
    it('should not make a bid if not enough tokens are available', async () => {
      let { dex, owner, alice, bob, charlie, usdt, bat, mint } =
        await prepareEnvironment();

      const amountAlice = '100' + dd(6);
      const amountBob = '200' + dd(18);

      await mint.usdt(alice.address, amountAlice);
      await usdt.connect(alice).approve(dex.address, amountAlice);

      let txCreate = await dex
        .connect(alice)
        .createOffer(
          usdt.address,
          [bat.address],
          amountAlice,
          [amountBob],
          emptyDefaults()
        );
      let offerId = await getOfferIdFromTx(txCreate);

      await usdt.connect(bob).approve(dex.address, amountBob);
      let txBid2 = dex
        .connect(bob)
        .acceptOffer(offerId, bat.address, amountBob);
      await expect(txBid2).reverted;
    });
    it('should make a bid for 100% tokens', async () => {
      let { dex, owner, alice, bob, charlie, usdt, bat, mint, parseLogs } =
        await prepareEnvironment();

      const amountAlice = '100' + dd(6);
      const amountBob = '200' + dd(18);

      await mint.usdt(alice.address, amountAlice);
      await usdt.connect(alice).approve(dex.address, amountAlice);

      let txCreate = await dex
        .connect(alice)
        .createOffer(
          usdt.address,
          [bat.address],
          amountAlice,
          [amountBob],
          emptyDefaults()
        );
      let offerEvent = await getOfferDataFromTx(txCreate);

      await mint.bat(bob.address, amountBob);
      await bat.connect(bob).approve(dex.address, amountBob);

      let txBid = await dex
        .connect(bob)
        .acceptOffer(offerEvent.offerId, bat.address, amountBob);
      let receipt = await txBid.wait();
      let logs = parseLogs(receipt.logs);

      checkEventExists(logs, 'Approval', (x) => x.owner == bob.address, {
        owner: bob.address,
        spender: dex.address,
        value: '0',
      });
      checkEventExists(logs, 'Transfer', (x) => x.to == bob.address, {
        from: dex.address,
        to: bob.address,
        value: amountAlice,
      });
      checkEventExists(logs, 'Transfer', (x) => x.to == alice.address, {
        from: bob.address,
        to: alice.address,
        value: amountBob,
      });

      checkEventExists(
        logs,
        'OfferAccepted',
        {
          offerId: offerEvent.offerId,
          sender: bob.address,
          amountAliceReceived: amountAlice,
          amountBobReceived: amountBob,
          tokenAddressAlice: usdt.address,
          tokenAddressBob: bat.address,
          offerType: offerEvent.offer.offerType,
          feeAlice: '0',
          feeBob: '0',
        },
        { exhaustive: false }
      );

      checkEventExists(
        logs,
        'OfferClosed',
        {
          offerId: offerEvent.offerId,
          reason: OfferCloseReason.Success,
        },
        { exhaustive: false }
      );
    });
    it('should make a bid for 50% tokens', async () => {
      let { dex, owner, alice, bob, charlie, usdt, bat, mint, parseLogs } =
        await prepareEnvironment();

      const amountAlice = '100' + dd(6);
      const amountBob = '200' + dd(18);

      const halfAmountAlice = '50' + dd(6);
      const halfAmountBob = '100' + dd(18);

      await mint.usdt(alice.address, amountAlice);
      await usdt.connect(alice).approve(dex.address, amountAlice);

      let txCreate = await dex
        .connect(alice)
        .createOffer(
          usdt.address,
          [bat.address],
          amountAlice,
          [amountBob],
          emptyDefaults()
        );
      let offerEvent = await getOfferDataFromTx(txCreate);

      await mint.bat(bob.address, amountBob);
      await bat.connect(bob).approve(dex.address, amountBob);

      let txBid = await dex
        .connect(bob)
        .acceptOffer(offerEvent.offerId, bat.address, halfAmountBob);
      let receipt = await txBid.wait();
      let logs = parseLogs(receipt.logs);

      checkEventExists(logs, 'Approval', (x) => x.owner == bob.address, {
        owner: bob.address,
        spender: dex.address,
        value: halfAmountBob,
      });
      checkEventExists(logs, 'Transfer', (x) => x.to == bob.address, {
        from: dex.address,
        to: bob.address,
        value: halfAmountAlice,
      });
      checkEventExists(logs, 'Transfer', (x) => x.to == alice.address, {
        from: bob.address,
        to: alice.address,
        value: halfAmountBob,
      });

      checkEventExists(
        logs,
        'OfferAccepted',
        {
          offerId: offerEvent.offerId,
          sender: bob.address,
          amountAliceReceived: halfAmountAlice,
          amountBobReceived: halfAmountBob,
          tokenAddressAlice: usdt.address,
          tokenAddressBob: bat.address,
          offerType: offerEvent.offer.offerType,
          feeAlice: '0',
          feeBob: '0',
        },
        { exhaustive: false }
      );

      checkEventDoesntExist(logs, 'OfferClosed');
    });
    it('should reject missing Bob tokens');
    it('should reject 0 amountAlice');
    it('should reject 0 amountBob');
    it('should reject amountAlice higher than amountRemaining');
  });
  describe('close offer', () => {
    it('should close an offer on buyout');
    it('should return all Bob tokens when offer closes');
  });
  describe('smallest chunk size', () => {
    it('should create a dynamic offer with smallestChunkSize');
    it('should reject a small bid with smallestChunkSize');
    it('should accept a large bid with smallestChunkSize');
  });
});
