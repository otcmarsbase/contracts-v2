const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { createOfferTokenToken } = require('../create-offer')
const { checkEvent, checkEventExists, checkEventDoesntExist } = require('../events')
const { mintAll, approveMany, expectBalances } = require('../token-utils')
const { prepareEnvironment, ZERO, getOfferIdFromTx, getOfferDataFromTx } = require("../utils")

describe("dynamic offers with minimum size", () =>
{
	it("should hold tokens before minimum size is covered before cancel", async () =>
	{
		let env = await prepareEnvironment()
		let { dex, mint, alice, bob, charlie, bat, usdt, parseLogs } = env

		await approveMany(env, await mintAll(env, {
			alice: {
				usdt: "200",
			},
			bob: {
				bat: "50",
			},
			charlie: {
				bat: "100",
			},
		}))

		async function doOfferBids(offer)
		{
			for (let i = 0; i < 20; i++)
			{
				let bidSuccess = await dex.connect(bob).acceptOffer(offer.id, bat.address, "1")
				await bidSuccess.wait()
			}
			for (let i = 0; i < 20; i++)
			{
				let bidSuccess = await dex.connect(charlie).acceptOffer(offer.id, bat.address, "1")
				await bidSuccess.wait()
			}
			return offer
		}
		let offer1 = await createOfferTokenToken(dex.connect(alice), usdt.address, "200", bat.address, "100", {
			feeAlice: "0",
			feeBob: "0",
			minimumSize: "75",
			cancelEnabled: true,
		})
		await expectBalances({ // offer created, bids not yet made
			alice: {
				usdt: "0",
				bat: "0",
			},
			bob: {
				usdt: "0",
				bat: "50",
			},
			charlie: {
				usdt: "0",
				bat: "100",
			},
		})
		await doOfferBids(offer1)
		await expectBalances({ // bids made, but not yet sent
			alice: {
				usdt: "0",
				bat: "0",
			},
			bob: {
				usdt: "0",
				bat: "30",
			},
			charlie: {
				usdt: "0",
				bat: "80",
			},
		})

		await dex.connect(alice).cancelOffer(offer1.id)
		await expectBalances({ // tokens returned to respective owners
			alice: {
				usdt: "200",
				bat: "0",
			},
			bob: {
				usdt: "0",
				bat: "50",
			},
			charlie: {
				usdt: "0",
				bat: "100",
			},
		})
	})
	it("should hold tokens before minimum size is covered before buyout", async () =>
	{
		let env = await prepareEnvironment()
		let { dex, mint, alice, bob, charlie, derek, bat, usdt, parseLogs } = env

		await approveMany(env, await mintAll(env, {
			alice: {
				usdt: "200",
			},
			bob: {
				bat: "50",
			},
			charlie: {
				bat: "100",
			},
			derek: {
				bat: "60",
			}
		}))

		async function doOfferBids(offer)
		{
			for (let i = 0; i < 20; i++)
			{
				let bidSuccess = await dex.connect(bob).acceptOffer(offer.id, bat.address, "1")
				await bidSuccess.wait()
			}
			for (let i = 0; i < 20; i++)
			{
				let bidSuccess = await dex.connect(charlie).acceptOffer(offer.id, bat.address, "1")
				await bidSuccess.wait()
			}
			return offer
		}
		let offer1 = await createOfferTokenToken(dex.connect(alice), usdt.address, "200", bat.address, "100", {
			feeAlice: "0",
			feeBob: "0",
			minimumSize: "75",
			cancelEnabled: true,
		})
		await expectBalances({ // offer created, bids not yet made
			alice: {
				usdt: "0",
				bat: "0",
			},
			bob: {
				usdt: "0",
				bat: "50",
			},
			charlie: {
				usdt: "0",
				bat: "100",
			},
		})
		await doOfferBids(offer1)
		await expectBalances({ // bids made, but not yet sent
			alice: {
				usdt: "0",
				bat: "0",
			},
			bob: {
				usdt: "0",
				bat: "30",
			},
			charlie: {
				usdt: "0",
				bat: "80",
			},
		})

		await dex.connect(derek).acceptOffer(offer1.id, bat.address, "60")
		await expectBalances({ // bids made, but not yet sent
			alice: {
				usdt: "0",
				bat: "100",
			},
			bob: {
				usdt: "40",
				bat: "30",
			},
			charlie: {
				usdt: "40",
				bat: "80",
			},
			derek: {
				usdt: "120",
				bat: "0",
			},
		})
	})
	it("should release tokens if minimum size is covered in first bid", async () =>
	{
		let env = await prepareEnvironment()
		let { dex, mint, alice, bob, charlie, bat, usdt, parseLogs } = env

		for (let [BAT_SENT, USDT_GOT] of [
			["200", "100"],
			["150", "75"],
			["175", "87"],
		])
		{
			await approveMany(env, await mintAll(env, {
				alice: {
					usdt: "100",
				},
				bob: {
					bat: BAT_SENT,
				}
			}))

			let offer = await createOfferTokenToken(dex.connect(alice), usdt.address, "100", bat.address, "200", {
				feeAlice: "0",
				feeBob: "0",
				minimumSize: "75",
			})
	
			// full buyout
			await dex.connect(bob).acceptOffer(offer.id, bat.address, BAT_SENT)
			await expectBalances(env, {
				alice: {
					usdt: "0",
					bat: BAT_SENT,
				},
				bob: {
					usdt: USDT_GOT,
					bat: "0",
				},
			})
			// burn tokens for next loop iteration
			await bat.connect(alice).transfer(charlie.address, BAT_SENT)
			await usdt.connect(bob).transfer(charlie.address, USDT_GOT)
		}
	})
	it("should correctly release all held tokens after minimum size is covered", async () =>
	{
		let env = await prepareEnvironment()
		let { dex, mint, alice, bob, charlie, bat, usdt, parseLogs } = env

		const balances = {
			alice: {
				usdt: "100",
			},
			bob: {
				bat: "50",
			},
			charlie: {
				bat: "100",
			},
		}
		await mintAll(env, balances)
		await approveMany(env, balances)

		let offer = await createOfferTokenToken(dex.connect(alice), usdt.address, "100", bat.address, "200", {
			feeAlice: "0",
			feeBob: "0",
			minimumSize: "75",
		})

		await dex.connect(bob).acceptOffer(offer.id, bat.address, "50")
		await expectBalances(env, {
			alice: {
				usdt: "0",
				bat: "0",
			},
			bob: {
				usdt: "0",
				bat: "0",
			},
			charlie: {
				usdt: "0",
				bat: "100",
			}
		})

		await dex.connect(charlie).acceptOffer(offer.id, bat.address, "100")
		await expectBalances(env, {
			alice: {
				usdt: "0",
				bat: "150",
			},
			bob: {
				usdt: "25",
				bat: "0",
			},
			charlie: {
				usdt: "50",
				bat: "0",
			}
		})
		await dex.connect(alice).cancelOffer(offer.id)
		await expectBalances(env, {
			alice: {
				usdt: "25",
				bat: "150",
			},
			bob: {
				usdt: "25",
				bat: "0",
			},
			charlie: {
				usdt: "50",
				bat: "0",
			}
		})
	})
})
describe("static offers with minimum size", () =>
{
	it("should not bid in an expired offer")
	it("should take out money from a successful expired offer as offermaker")
	it("should take out money from a successful expired offer as a bidder")
	it("should revert money from cancelled expired offer as offermaker")
	it("should revert money from cancelled expired offer as a bidder")
})