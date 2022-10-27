const assert = require('assert/strict')
const BigNumber = require('bignumber.js')
const { expect } = require("chai")
const { ethers } = require("hardhat")
const { checkEvent, checkEventExists, checkEventDoesntExist } = require('../events')
const { mintAll, expectBalances, approveMany } = require('../token-utils')
const { prepareEnvironment, getLastBlockTime, getOfferIdFromTx, getLogsFromTx } = require("../utils")

describe.only("marketplace/basic", () =>
{
	it("should create an offer and accept bid", async () =>
	{
		/*
			Scenario 1 (basic single bidder):
			1. Alice creates an offer
			2. Bob creates a bid
			3. Alice creates BestBid offer
			4. Alice accepts Bob's bid
		*/
		let env = await prepareEnvironment()
		let { bb, mplace, mint, alice, bob, charlie, derek, bat, usdt, tether, parseLogs } = env

		let offerTx = await mplace.connect(alice).createOffer({
			tokenAlice: bat.address,
			amountAlice: "100",

			tokensBob: [usdt.address, tether.address],

			feeAlice: "0",
			feeBob: "0",

			deadline: (await getLastBlockTime()) + 86400 * 7,
		})
		let offerId = (await getLogsFromTx(offerTx)).find(x => x.name == "OfferCreated").args.id
		expect(offerId).equal("0")

		let bidTx = await mplace.connect(bob).createBid(offerId, usdt.address, "250")
		let bidId = (await getLogsFromTx(bidTx)).find(x => x.name == "BidCreated").args.bidIdx
		expect(bidId).equal("0")

		await approveMany(env, await mintAll(env, {
			alice: {
				bat: "100",
			},
			bob: {
				usdt: "500",
			}
		}), bb.address)

		let bbOfferTx = await bb.connect(alice).createOffer({
			tokenAlice: bat.address,
			amountAlice: "100",

			tokensBob: [usdt.address, tether.address],

			feeAlice: "0",
			feeBob: "0",
		})
		let bbOfferId = (await getLogsFromTx(bbOfferTx)).find(x => x.name == "OfferCreated").args.id
		expect(bbOfferId).equal("0")

		await mplace.connect(alice).acceptBid(offerId, bidId, bbOfferId)
	})
	describe("deadline", () =>
	{
		describe("charge eth for long offer deadline", () =>
		{
			it("should fail if not enough", async () =>
			{
				let env = await prepareEnvironment()
				let { bb, mplace, mint, alice, bob, charlie, derek, bat, usdt, tether, parseLogs } = env

				let offerTx = mplace.connect(alice).createOffer({
					tokenAlice: bat.address,
					amountAlice: "100",

					tokensBob: [usdt.address, tether.address],

					feeAlice: "0",
					feeBob: "0",

					deadline: (await getLastBlockTime()) + 86400 * 8,
				})

				await expect(offerTx).to.be.revertedWith("400-NE")
			})
			it("should succeed if enough", async () =>
			{
				let env = await prepareEnvironment()
				let { owner, bb, mplace, mint, alice, bob, charlie, derek, bat, usdt, tether, parseLogs } = env

				let offerTx = await mplace.connect(alice).createOffer({
					tokenAlice: bat.address,
					amountAlice: "100",

					tokensBob: [usdt.address, tether.address],

					feeAlice: "0",
					feeBob: "0",

					deadline: (await getLastBlockTime()) + 86400 * 8,
				}, { value: ethers.utils.parseUnits("86400", "gwei") })

				await expect(offerTx).to.changeEtherBalances([mplace, alice],
					[ethers.utils.parseUnits("86400", "gwei"), ethers.utils.parseUnits("-86400", "gwei")])

				let feeTx = await mplace.connect(bob).dumpEthToComissionWallet()

				await expect(feeTx).to.changeEtherBalances([owner, mplace],
					[ethers.utils.parseUnits("86400", "gwei"), ethers.utils.parseUnits("-86400", "gwei")])
			})
		})
		it("should not charge eth for short deadline extension", async () =>
		{
			let env = await prepareEnvironment()
			let { owner, bb, mplace, mint, alice, bob, charlie, derek, bat, usdt, tether, parseLogs } = env

			let initialDeadline = (await getLastBlockTime()) + 86400 * 7

			let offerTx = await mplace.connect(alice).createOffer({
				tokenAlice: bat.address,
				amountAlice: "100",

				tokensBob: [usdt.address, tether.address],

				feeAlice: "0",
				feeBob: "0",

				deadline: initialDeadline,
			})
			let offerId = (await getLogsFromTx(offerTx)).find(x => x.name == "OfferCreated").args.id
			expect(offerId).equal("0")

			await mplace.connect(alice).extendDeadline(offerId, initialDeadline - 86400)

			await mplace.connect(alice).extendDeadline(offerId, initialDeadline,)
		})
		it("should charge eth for long deadline extension", async () =>
		{
			let env = await prepareEnvironment()
			let { owner, bb, mplace, mint, alice, bob, charlie, derek, bat, usdt, tether, parseLogs } = env

			let initialDeadline = (await getLastBlockTime()) + 86400 * 7

			let offerTx = await mplace.connect(alice).createOffer({
				tokenAlice: bat.address,
				amountAlice: "100",

				tokensBob: [usdt.address, tether.address],

				feeAlice: "0",
				feeBob: "0",

				deadline: initialDeadline,
			})
			let offerId = (await getLogsFromTx(offerTx)).find(x => x.name == "OfferCreated").args.id
			expect(offerId).equal("0")

			let extendTxFail = mplace.connect(alice).extendDeadline(offerId, initialDeadline + 86400)
			await expect(extendTxFail).to.be.revertedWith("400-NE")

			let extendTx = await mplace.connect(alice).extendDeadline(offerId, initialDeadline + 86400, {
				value: ethers.utils.parseUnits("86400", "gwei")
			})

			await expect(extendTx).to.changeEtherBalances([mplace, alice],
				[ethers.utils.parseUnits("86400", "gwei"), ethers.utils.parseUnits("-86400", "gwei")])

			let feeTx = await mplace.connect(bob).dumpEthToComissionWallet()

			await expect(feeTx).to.changeEtherBalances([owner, mplace],
				[ethers.utils.parseUnits("86400", "gwei"), ethers.utils.parseUnits("-86400", "gwei")])
		})
	})
})
