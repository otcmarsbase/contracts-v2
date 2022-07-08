const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { checkEvent, checkEventExists, checkEventDoesntExist } = require('../events')
const { mintAll, expectBalances } = require('../token-utils')
const { prepareEnvironment, ZERO, getOfferIdFromTx, getOfferDataFromTx } = require("../utils")

describe("missing/smallest chunk size", () =>
{
	for (let HOLD_TOKENS of [true, false])
	it(`should not allow bids less than the smallest chunk size for ${HOLD_TOKENS ? "static" : "dynamic"}`, async () =>
	{
		let env = await prepareEnvironment()
		let { dex, mint, alice, bob, bat, usdt, parseLogs } = env

		const amounts = {
			alice: "100",
			bob: "200",
			smallestChunkSize: "50",
			bidTooLow: "99",
			bidSuccess: "100",
		}
		const afterBid = {
			alice: {
				usdt: "0",
				bat: HOLD_TOKENS ? "0" : "100",
			},
			bob: {
				usdt: HOLD_TOKENS ? "0" : "50",
				bat: "0",
			}
		}
		await mintAll(env, {
			alice: {
				usdt: amounts.alice,
			},
			bob: {
				bat: amounts.bidSuccess,
			}
		})
		
		await usdt.connect(alice).approve(dex.address, amounts.alice)
		let tx = await dex.connect(alice).createOffer(usdt.address, [bat.address], amounts.alice, [amounts.bob], {
			holdTokens: HOLD_TOKENS,
			smallestChunkSize: "50",
			minimumSize: "0",

			modifyEnabled: false,
			cancelEnabled: false,
			feeAlice: "0",
			feeBob: "0",
			deadline: 0,
		})
		let offerId = await getOfferIdFromTx(tx)

		await bat.connect(bob).approve(dex.address, amounts.bidSuccess)

		// too low bid should fail
		await expect(dex.connect(bob).acceptOffer(offerId, bat.address, amounts.bidTooLow)).revertedWith("400-AAL")

		// high bid should go okay
		let bid1 = await dex.connect(bob).acceptOffer(offerId, bat.address, amounts.bidSuccess)
		await bid1.wait()

		// just check that everyone got their money back
		await expectBalances(env, afterBid)
	})

	for (let HOLD_TOKENS of [true, false])
	for (let AMOUNT_ALICE of ["10000"])
	for (let SMALLEST_CHUNK_SIZE of ["5000"])
	for (let MIN_SIZE of ["0", "2500", "7500", "9899", "9900", "9999", "10000"])
	it(`[${HOLD_TOKENS ? "static" : "dynamic"} min size = ${MIN_SIZE}] should allow last bidder to bid less than smallest chunk size for all of the remaining tokens`, async () =>
	{
		let env = await prepareEnvironment()
		let { dex, mint, alice, bob, charlie, bat, usdt, parseLogs } = env

		const amounts = {
			bob: "100",
			bid1: "70",
			bidTooLow: "29",
			bidTooHigh: "31",
			bid2: "30",
		}
		let afterBid = {
			alice: {
				usdt: "0",
				bat: "100",
			},
			bob: {
				usdt: "7000",
				bat: "0",
			},
			charlie: {
				usdt: "3000",
				bat: "1", // 31 minted, 30 bid
			}
		}

		// mint
		await mintAll(env, {
			alice: {
				usdt: AMOUNT_ALICE,
			},
			bob: {
				bat: amounts.bid1,
			},
			charlie: {
				bat: amounts.bidTooHigh,
			}
		})

		// approve
		await usdt.connect(alice).approve(dex.address, AMOUNT_ALICE)
		await bat.connect(bob).approve(dex.address, amounts.bid1)
		await bat.connect(charlie).approve(dex.address, amounts.bidTooHigh)

		// create offer
		let tx = await dex.connect(alice).createOffer(usdt.address, [bat.address], AMOUNT_ALICE, [amounts.bob], {
			holdTokens: HOLD_TOKENS,
			minimumSize: MIN_SIZE,
			smallestChunkSize: SMALLEST_CHUNK_SIZE,

			modifyEnabled: false,
			cancelEnabled: false,
			feeAlice: "0",
			feeBob: "0",
			deadline: 0,
		})
		let offerId = await getOfferIdFromTx(tx)

		// should fail
		await expect(dex.connect(bob).acceptOffer(offerId, bat.address, amounts.bid2), "too low - 1").revertedWith("400-AAL")

		// high bid should go okay
		let bid1 = await dex.connect(bob).acceptOffer(offerId, bat.address, amounts.bid1)

		// too high bid should fail
		await expect(dex.connect(charlie).acceptOffer(offerId, bat.address, amounts.bidTooHigh), "too high").revertedWith("")

		// too low bid should fail
		await expect(dex.connect(charlie).acceptOffer(offerId, bat.address, amounts.bidTooLow), "too low - 2").revertedWith("400-AAL")

		// normal bid should pass okay
		let bid2 = await dex.connect(charlie).acceptOffer(offerId, bat.address, amounts.bid2)

		// just check that everyone got their money 
		await expectBalances(env, afterBid)
	})
})