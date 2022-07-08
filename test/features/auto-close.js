const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { checkEvent, checkEventExists, checkEventDoesntExist } = require('../events')
const { mintAll, expectBalances } = require('../token-utils')
const { prepareEnvironment, getLastBlockTime } = require("../utils")

describe("features/auto close offers", () =>
{
	for (let OFFER_SIZE of ["10000"])
	for (let HOLD_TOKENS of [false, true])
	for (let MIN_SIZE of ["0", "5000", "9999", "10000"])
	for (let SCS of ["0", "5000", "9999", "10000"])
	for (let DEADLINE of [0, Math.floor(Date.now() / 1000) + 86400])
	it(`should auto close ${HOLD_TOKENS ? "static" : "dynamic"} offer in one bid [${DEADLINE ? "" : "no "}deadline - min ${MIN_SIZE} minbid ${SCS}]`, async () =>
	{
		let env = await prepareEnvironment()
		let { dex, mint, alice, bob, bat, usdt, parseLogs } = env

		let BID = "999900"

		await mintAll(env, {
			alice: {
				usdt: OFFER_SIZE,
			},
			bob: {
				bat: "1000000",
			}
		})

		await usdt.connect(alice).approve(dex.address, OFFER_SIZE)
		let tx = await dex.connect(alice).createOffer(usdt.address, [bat.address], OFFER_SIZE, ["1000000"], {
			holdTokens: HOLD_TOKENS,
			smallestChunkSize: SCS,
			minimumSize: MIN_SIZE,
			deadline: DEADLINE,

			modifyEnabled: false,
			cancelEnabled: false,
			feeAlice: "0",
			feeBob: "0",
		})
		await tx.wait()

		await bat.connect(bob).approve(dex.address, BID)
		let bidSuccess = await dex.connect(bob).acceptOffer(0, bat.address, BID)
		await bidSuccess.wait()

		await expectBalances(env, {
			alice: {
				usdt: "1",
				bat: "999900",
			},
			bob: {
				usdt: "9999",
				bat: "100",
			}
		})
	})

	it("should create offers with 99.98% minimum size")
	it("should convert offers with 100% minimum size to 99.99% minimum size")
	it("should create offers with 99.98% smallest chunk size")
	it("should convert offers with 100% smallest chunk size to 99.99% smallest chunk size")
})