const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { checkEvent } = require('../events')
const { prepareEnvironment, ZERO, getOfferIdFromTx } = require("../utils")

const dd = (n) => '0'.repeat(n)

const emptyDefaults = (extra = {}) => ({
	modifyEnabled: false,
	cancelEnabled: false,
	holdTokens: false,
	feeAlice: "0",
	feeBob: "0",
	minimumSize: "0",
	smallestChunkSize: "0",
	deadline: 0,
	...extra,
})

const INSUFFICIENT_ALLOWANCE = "ERC20: insufficient allowance"
const INSUFFICIENT_BALANCE = "ERC20: transfer amount exceeds balance"

describe("missing/dynamic-offer", () => 
{
	it('should fail to create offer with insufficient allowance', async () =>
	{
		let { dex, owner, alice, bob, charlie, usdt, bat, mint } = await prepareEnvironment()

		let amountAlice = "1"

		await mint.usdt(alice.address, amountAlice)

		let tx = dex.connect(alice).createOffer(
			usdt.address,
			[bat.address],
			amountAlice,
			["1"],
			emptyDefaults()
		)
		await expect(tx).revertedWith(INSUFFICIENT_ALLOWANCE)
	})
	it('should fail to create offer with insufficient tokens but enough allowance', async () =>
	{
		let { dex, owner, alice, bob, charlie, usdt, bat, mint } = await prepareEnvironment()
		
		let amountAlice = "1"

		await usdt.connect(alice).approve(dex.address, amountAlice)

		let tx = dex.connect(alice).createOffer(
			usdt.address,
			[bat.address],
			amountAlice,
			["1"],
			emptyDefaults()
		)
		await expect(tx).revertedWith(INSUFFICIENT_BALANCE)
	})
	
    it("should create a simple dynamic offer token-to-token no cancel no modify no hold no minimum", async () =>
    {
		let { dex, owner, alice, bob, charlie, usdt, bat, mint, parseLogs } = await prepareEnvironment()

		const amountAlice = "123" + dd(6)
		const amountBob = "456" + dd(18)

		await mint.usdt(alice.address, amountAlice)
		await usdt.connect(alice).approve(dex.address, amountAlice)

		let txCreate = await dex.connect(alice).createOffer(
			usdt.address,
			[bat.address],
			amountAlice,
			[amountBob],
			emptyDefaults()
		)
		let receipt = await txCreate.wait()
		let logs = parseLogs(receipt.logs)

		expect(logs).length(3)

		checkEvent(logs[0], "Approval", {
			owner: alice.address,
			spender: dex.address,
			value: "0",
		})

		checkEvent(logs[1], "Transfer", {
			from: alice.address,
			to: dex.address,
			value: amountAlice,
		})

		checkEvent(logs[2], "OfferCreated", {
			offerId: "0",
			sender: alice.address,
		}, { exhaustive: false })

		let eventOfferData = logs[2].args.offer
		expect(eventOfferData.active).eq(true)
		expect(eventOfferData.minimumMet).eq(false)
		expect(eventOfferData.offerId).eq("0")
		expect(eventOfferData.amountAlice).eq(amountAlice)
		expect(eventOfferData.feeAlice).eq("0")
		expect(eventOfferData.feeBob).eq("0")
		expect(eventOfferData.smallestChunkSize).eq("0")
		expect(eventOfferData.minimumSize).eq("0")
		expect(eventOfferData.deadline).eq("0")
		expect(eventOfferData.amountRemaining).eq(amountAlice)
		expect(eventOfferData.offerer).eq(alice.address)
		expect(eventOfferData.payoutAddress).eq(alice.address)
		expect(eventOfferData.tokenAlice).eq(usdt.address)
		
		expect(eventOfferData.capabilities).eql([false, false, false])
		
		expect(eventOfferData.amountBob).length(1)
		expect(eventOfferData.amountBob[0]).eq(amountBob)

		expect(eventOfferData.minimumOrderAmountsAlice).length(0)
		expect(eventOfferData.minimumOrderAmountsBob).length(0)
		expect(eventOfferData.minimumOrderAddresses).length(0)
		expect(eventOfferData.minimumOrderTokens).length(0)

		expect(eventOfferData.tokenBob).length(1)
		expect(eventOfferData.tokenBob[0]).eq(bat.address)

		let nextOfferId = await dex.getNextOfferId()
		expect(nextOfferId).eq("1")
		let offer = await dex.getOffer("0")
		expect(offer).eql(eventOfferData)
		let offers = await dex.getAllOffers()
		expect(offers).length(1)
		expect(offers[0]).eql(eventOfferData)
	})
})