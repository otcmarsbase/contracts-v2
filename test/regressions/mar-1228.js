const assert = require('assert/strict');
const BigNumber = require('bignumber.js');
const { expect } = require('chai');
const { ethers } = require('hardhat');
const { createOfferTokenToken } = require('../create-offer');
const { prepareEnvironment } = require('../utils');
const { offerDataStringToOffer } = require('./utils');

const ETH = '0x0000000000000000000000000000000000000000';

describe('MAR-1228', () => {
  it('should create 50%+ bids in static offers', async () => {
    let { owner, alice, bob, charlie, dex, usdt, bat, MarsBase } =
      await prepareEnvironment();

    async function usdtMintAndBid(id, bidder, amount) {
      await usdt.transfer(bidder.address, amount);
      await usdt.connect(bidder).approve(dex.address, amount);

      let txBid = await dex
        .connect(bidder)
        .acceptOffer(id, usdt.address, amount);
      let bidReceipt = await txBid.wait();
      return bidReceipt;
    }

    let offerData = offerDataStringToOffer(
      'true,false,6,40,100000000000000000000,0,0,1000000000000000000,50000000000000000000,1655882303,79999999999999998903,0x25fA0Cc65F8B5DB764EB2243b13db4D63B29fd58,0x25fA0Cc65F8B5DB764EB2243b13db4D63B29fd58,0x525375C267BeF2C39E5e74603456312324fe9fB9,false,true,false,91125029615634620000,20000000000000001097,18225005923126924999,0x41e4eedF9d2F618DEF9fcE80bBe54fD1408ebc27,0x3CB0EbaD9f5182046656E36D56aBFADe08767f6b,0x3CB0EbaD9f5182046656E36D56aBFADe08767f6b'
    );
    /**
		{
			active: true,
			minimumMet: false,
			offerType: 6,
			offerId: 40,
			amountAlice: '100000000000000000000',
			feeAlice: '0',
			feeBob: '0',
			smallestChunkSize: '1000000000000000000',
			minimumSize: '50000000000000000000',
			deadline: 1655882303,
			amountRemaining: '79999999999999998903',
			offerer: '0x25fA0Cc65F8B5DB764EB2243b13db4D63B29fd58',
			payoutAddress: '0x25fA0Cc65F8B5DB764EB2243b13db4D63B29fd58',
			tokenAlice: '0x525375C267BeF2C39E5e74603456312324fe9fB9',
			capabilities: [ false, true, false ],
			amountBob: [ '91125029615634620000' ],
			minimumOrderAmountsAlice: [ '20000000000000001097' ],
			minimumOrderAmountsBob: [ '18225005923126924999' ],
			minimumOrderAddresses: [ '0x41e4eedF9d2F618DEF9fcE80bBe54fD1408ebc27' ],
			minimumOrderTokens: [ '0x3CB0EbaD9f5182046656E36D56aBFADe08767f6b' ],
			tokenBob: [ '0x3CB0EbaD9f5182046656E36D56aBFADe08767f6b' ]
		}
		 */
    await bat.transfer(alice.address, offerData.amountAlice);
    await bat.connect(alice).approve(dex.address, offerData.amountAlice);

    let offer = await createOfferTokenToken(
      dex.connect(alice),
      bat.address,
      offerData.amountAlice,
      usdt.address,
      offerData.amountBob[0],
      {
        modifyEnabled: offerData.capabilities.modifyEnabled,
        cancelEnabled: offerData.capabilities.cancelEnabled,
        holdTokens: offerData.capabilities.holdTokens,
        feeAlice: offerData.feeAlice,
        feeBob: offerData.feeBob,
        minimumSize: offerData.minimumSize,
      }
    );

    await usdtMintAndBid(offer.id, bob, offerData.amountBob[0]);
  });
});
