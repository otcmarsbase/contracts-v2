const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { sensibleOfferDefaults, createOfferTokenToken } = require('../create-offer')
const { checkEvent, checkEventExists, checkEventDoesntExist } = require('../events')
const { offerDataStringToOffer } = require('../regressions/utils')
const { prepareEnvironment, ZERO, getOfferIdFromTx, getOfferDataFromTx } = require("../utils")

describe("cancel dynamic offers", () =>
{
	it("should not cancel non-existing offer")
	it("should not cancel non-active offer")
	it("should not cancel non-cancellable offer")
	it("should not cancel offers of other people")
	it("should cancel offers after deadline")
})
describe("cancel static offers", () =>
{
	it("should not cancel non-cancellable static offer")
	it("should cancel static offers after deadline")
	it("should cancel static offers before any bids were made")
	it("should cancel static offers after some bids were made but not enough", async () =>
	{
		let { dex, owner, alice, bob, charlie, usdt, bat, mint, parseLogs } = await prepareEnvironment()

		let offerData = offerDataStringToOffer("true,false,3,0,100000000,0,0,1000000,0,1656587892,70000000,0x25fA0Cc65F8B5DB764EB2243b13db4D63B29fd58,0x25fA0Cc65F8B5DB764EB2243b13db4D63B29fd58,0xBdB3fa370D81981eF83A97ceA593948418F8f80D,false,true,true,45000000000000000000,30000000,13500000000000000000,0x41e4eedF9d2F618DEF9fcE80bBe54fD1408ebc27,0x525375C267BeF2C39E5e74603456312324fe9fB9,0x525375C267BeF2C39E5e74603456312324fe9fB9")
		let bobAmountBid = "13500000000000000000"

		// console.log(offerData)

		await mint.usdt(alice.address, offerData.amountAlice)
		await usdt.connect(alice).approve(dex.address, offerData.amountAlice)

		let offer = await createOfferTokenToken(dex.connect(alice), usdt.address, offerData.amountAlice, bat.address, offerData.amountBob[0], {
			cancelEnabled: offerData.capabilities.cancelEnabled,
			holdTokens: true,
			modifyEnabled: offerData.capabilities.modifyEnabled,
			smallestChunkSize: offerData.smallestChunkSize,
			feeAlice: offerData.feeAlice,
			feeBob: offerData.feeBob,
			minimumSize: "50000000",
			deadline: Math.floor((Date.now() / 1000) + 86400),
		})
		
		await mint.bat(bob.address, bobAmountBid)
		await bat.connect(bob).approve(dex.address, bobAmountBid)

		let txBid = await dex.connect(bob).acceptOffer(offer.id, bat.address, bobAmountBid)
		await txBid.wait()

		let txCancel = await dex.connect(alice).cancelOffer(offer.id)
		let receiptCancel = await txCancel.wait()
		// let logsCancel = parseLogs(receiptCancel.logs)
		
		expect(await usdt.balanceOf(alice.address)).equal("100000000")
		expect(await usdt.balanceOf(bob.address)).equal("0")
		expect(await bat.balanceOf(alice.address)).equal("0")
		expect(await bat.balanceOf(bob.address)).equal("13500000000000000000")
	})
	it("should cancel static offers after enough bids were made", async () =>
	{
		let { dex, owner, alice, bob, charlie, usdt, bat, mint, parseLogs } = await prepareEnvironment()

		let offerData = offerDataStringToOffer("true,false,3,0,100000000,0,0,1000000,0,1656587892,70000000,0x25fA0Cc65F8B5DB764EB2243b13db4D63B29fd58,0x25fA0Cc65F8B5DB764EB2243b13db4D63B29fd58,0xBdB3fa370D81981eF83A97ceA593948418F8f80D,false,true,true,45000000000000000000,30000000,13500000000000000000,0x41e4eedF9d2F618DEF9fcE80bBe54fD1408ebc27,0x525375C267BeF2C39E5e74603456312324fe9fB9,0x525375C267BeF2C39E5e74603456312324fe9fB9")
		let bobAmountBid = "13500000000000000000"

		// console.log(offerData)

		await mint.usdt(alice.address, offerData.amountAlice)
		await usdt.connect(alice).approve(dex.address, offerData.amountAlice)

		let offer = await createOfferTokenToken(dex.connect(alice), usdt.address, offerData.amountAlice, bat.address, offerData.amountBob[0], {
			cancelEnabled: offerData.capabilities.cancelEnabled,
			holdTokens: true,
			modifyEnabled: offerData.capabilities.modifyEnabled,
			smallestChunkSize: offerData.smallestChunkSize,
			feeAlice: offerData.feeAlice,
			feeBob: offerData.feeBob,
			minimumSize: offerData.minimumSize,
			deadline: Math.floor((Date.now() / 1000) + 86400),
		})
		
		await mint.bat(bob.address, bobAmountBid)
		await bat.connect(bob).approve(dex.address, bobAmountBid)

		let txBid = await dex.connect(bob).acceptOffer(offer.id, bat.address, bobAmountBid)
		await txBid.wait()

		let txCancel = await dex.connect(alice).cancelOffer(offer.id)
		await txCancel.wait()
		
		expect(await usdt.balanceOf(alice.address)).equal("70000000")
		expect(await usdt.balanceOf(bob.address)).equal("30000000")
		expect(await bat.balanceOf(alice.address)).equal("13500000000000000000")
		expect(await bat.balanceOf(bob.address)).equal("0")
	})
	it("should cancel static offers after some bids were made with 0 minimumSize")
})