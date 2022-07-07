const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { createOfferTokenToken, sensibleOfferDefaults } = require('../create-offer')
const { checkEvent, checkEventExists, checkEventDoesntExist } = require('../events')
const { mintAll, approveMany, expectBalances } = require('../token-utils')
const { prepareEnvironment, ZERO, getOfferIdFromTx, getOfferDataFromTx, skipTime, skipTimeTo, getLastBlockTime } = require("../utils")

describe.only("missing/eth", () =>
{
	it("should create an offer with eth as tokenAlice")
	it("should create an offer with eth as one of tokenBob")
	it("should create a bid with eth (instant exchange)")
	it("should create a bid with eth (hold tokens)", async () =>
	{
		let env = await prepareEnvironment()
		let { dex, mint, alice, bob, charlie, derek, bat, usdt, parseLogs } = env

		const _000_ = "0".repeat(17)

		await approveMany(env, await mintAll(env, {
			bob: {
				usdt: `100${_000_}0`,
			},
			charlie: {
				usdt: `10000${_000_}0`
			}
		}))
		
		// get alice eth balance
		// expect(ethers.utils.formatEther(await alice.getBalance())).eq("10000.0")

		let offer = await createOfferTokenToken(dex.connect(alice), ZERO, `1${_000_}0`, usdt.address, `4500${_000_}0`, {
			holdTokens: true,
			feeAlice: 0,
			feeBob: 0,
			smallestChunkSize: 0,
		})

		let aliceBalance = await alice.getBalance()

		// 0.000222222222222222 eth expected (222222222222222 wei) for every bid
		for (let i = 0; i < 10; i++)
			await dex.connect(bob).acceptOffer(offer.id, usdt.address, `1${_000_}0`)

		await expectBalances(env, {
			alice: {
				usdt: "0"
			},
			bob: {
				usdt: `90${_000_}0`
			},
		})
		let bobBalance = await bob.getBalance()

		// 0.997777777777777777 eth (997777777777777777 wei) expected
		// 999999999999999997 wei in total
		let bid2 = await dex.connect(charlie).acceptOffer(offer.id, usdt.address, `4490${_000_}0`)
		await expect(bid2).to.changeEtherBalances(
			[alice, bob, charlie],
			["3", "2222222222222220", "997777777777777777"]
		)
		// await expect(bid2).to.changeTokenBalance(usdt, alice, `4500${_000_}0`)

		await expectBalances(env, {
			alice: {
				usdt: `4500${_000_}0`,
				eth: aliceBalance.add(3),
			},
			bob: {
				usdt: `90${_000_}0`,
				eth: bobBalance.add(`2222222222222220`),
			},
			charlie: {
				usdt: `5510${_000_}0`,
			}
		})
	})
	it("should not create an offer with eth if not enough eth")
	it("should not create a bid with eth if not enough eth")
	it("should cancel an offer with eth tokenAlice")
	it("should cancel an offer with eth held")
	it("should deduct a fee from the eth offer")
	it("should deduct a fee from the eth bid")
})