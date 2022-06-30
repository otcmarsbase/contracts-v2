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
	it("should hold tokens before minimum size is covered")
	it("should release tokens if minimum size is covered", async () =>
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
	it("should correctly release all held tokens after minimum size is covered")
})
describe("static offers with minimum size", () =>
{
	it("should not bid in an expired offer")
	it("should take out money from a successful expired offer as offermaker")
	it("should take out money from a successful expired offer as a bidder")
	it("should revert money from cancelled expired offer as offermaker")
	it("should revert money from cancelled expired offer as a bidder")
})