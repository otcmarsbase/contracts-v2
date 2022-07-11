const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { createOfferTokenToken } = require('../create-offer')
const { tryParseLog, PUBLIC_ABIS } = require('../events')
const { mintAll, expectBalances } = require('../token-utils')
const { prepareEnvironment, getLastBlockTime } = require("../utils")

const ETH = "0x0000000000000000000000000000000000000000"

const sensibleOfferDefaults = async () => ({
	cancelEnabled: true,
	modifyEnabled: false,
	holdTokens: false,
	feeAlice: "5",
	feeBob: "5",
	minimumSize: "0",
	deadline: await getLastBlockTime() + 86400,
})

async function createOfferEthSell(contract, amountAlice, tokenBob, amountBob, params = sensibleOfferDefaults())
{
	let smallestChunkSize = amountAlice.substring(0, amountAlice.length - 2)
	let details = {
		...await sensibleOfferDefaults(),
		smallestChunkSize,
		...params,
	}
	let txCreate = await contract.createOffer(ETH, [tokenBob], amountAlice, [amountBob], details, {
		value: amountAlice
	})
	let receipt = await txCreate.wait()
	let logs = receipt.logs.map(tryParseLog(contract.interface, ...PUBLIC_ABIS))
	let offerCreatedEvent = logs.find(x => x.name == "OfferCreated")
	expect(offerCreatedEvent).not.undefined
	let id = offerCreatedEvent.args[0]
	return {
		id,
		tokenAlice: ETH,
		amountAlice,
		tokenBob,
		amountBob,
		details,
	}
}

describe("MAR-1221", () => 
{
    it("should migrate contracts with minimumSize token offer", async () =>
    {
		let env = await prepareEnvironment()
		let { owner, alice, bob, charlie, dex, usdt, bat, MarsBase } = env

		await mintAll(env, {
			alice: {
				usdt: "200000000000000000"
			}
		})
		await usdt.connect(alice).approve(dex.address, "200000000000000000")
		await createOfferTokenToken(dex.connect(alice), usdt.address, "200000000000000000", bat.address, "62232606000000000000", {
			minimumSize: "200000000000000000"
		})

		let txMigrate = await dex.migrateContract()
		await txMigrate.wait()

		await expectBalances(env, {
			alice: {
				usdt: "200000000000000000",
			}
		})
    })
    it("should migrate contracts after several token offers", async () =>
    {
		let env = await prepareEnvironment()
		let { owner, alice, bob, charlie, dex, usdt, bat, MarsBase } = env

		async function usdtMintAndBid(id, bidder, amount)
		{
			await usdt.transfer(bidder.address, amount)
			await usdt.connect(bidder).approve(dex.address, amount)

			let txBid = await dex.connect(bidder).acceptOffer(id, usdt.address, amount)
			let bidReceipt = await txBid.wait()
			return bidReceipt
		}
		async function createOffer(params)
		{
			await mintAll(env, {
				alice: {
					usdt: "200000000000000000"
				}
			})
			await usdt.connect(alice).approve(dex.address, "200000000000000000")
			return await createOfferTokenToken(dex.connect(alice), usdt.address, "200000000000000000", usdt.address, "62232606000000000000", params)
		}

		let offer0 = await createOffer({})
		await usdtMintAndBid(offer0.id, bob, "15558151500000000000")

		let offer1 = await createOffer({})
		await usdtMintAndBid(offer1.id, bob, "62232606000000000000")

		let offer2 = await createOffer({})
		await usdtMintAndBid(offer2.id, bob, "32232606000000000000")
		await usdtMintAndBid(offer2.id, charlie, "30000000000000000000")

		let offer3 = await createOffer({})
		await usdtMintAndBid(offer3.id, bob, "15558151500000000000")

		let offer4 = await createOffer({})

		let offer5 = await createOffer({
			cancelEnabled: false,
			modifyEnabled: false,
		})

		let offer6 = await createOffer({
			cancelEnabled: false,
			modifyEnabled: false,
			holdTokens: true,
		})

		let offer7 = await createOffer({
			minimumSize: "200000000000000000"
		})

		let txMigrate = await dex.migrateContract()
		await txMigrate.wait()
    })
    it("should migrate contracts with minimumSize ETH offer", async () =>
    {
		let { owner, alice, bob, charlie, dex, usdt, MarsBase } = await prepareEnvironment()

		await createOfferEthSell(dex.connect(alice), "200000000000000000", usdt.address, "62232606000000000000", {
			minimumSize: "200000000000000000"
		})

		let txMigrate = await dex.migrateContract()
		await txMigrate.wait()
    })
    it("should migrate contracts after several ETH offers", async () =>
    {
		let { owner, alice, bob, charlie, dex, usdt, MarsBase } = await prepareEnvironment()

		async function usdtMintAndBid(id, bidder, amount)
		{
			await usdt.transfer(bidder.address, amount)
			await usdt.connect(bidder).approve(dex.address, amount)

			let txBid = await dex.connect(bidder).acceptOffer(id, usdt.address, amount)
			let bidReceipt = await txBid.wait()
			return bidReceipt
		}

		let offer0 = await createOfferEthSell(dex.connect(alice), "200000000000000000", usdt.address, "62232606000000000000")
		await usdtMintAndBid(offer0.id, bob, "15558151500000000000")

		let offer1 = await createOfferEthSell(dex.connect(alice), "200000000000000000", usdt.address, "62232606000000000000")
		await usdtMintAndBid(offer1.id, bob, "62232606000000000000")

		let offer2 = await createOfferEthSell(dex.connect(alice), "200000000000000000", usdt.address, "62232606000000000000")
		await usdtMintAndBid(offer2.id, bob, "32232606000000000000")
		await usdtMintAndBid(offer2.id, charlie, "30000000000000000000")

		let offer3 = await createOfferEthSell(dex.connect(alice), "200000000000000000", usdt.address, "62232606000000000000")
		await usdtMintAndBid(offer3.id, bob, "15558151500000000000")

		let offer4 = await createOfferEthSell(dex.connect(alice), "200000000000000000", usdt.address, "62232606000000000000")

		let offer5 = await createOfferEthSell(dex.connect(alice), "200000000000000000", usdt.address, "62232606000000000000", {
			cancelEnabled: false,
			modifyEnabled: false,
		})

		let offer6 = await createOfferEthSell(dex.connect(alice), "200000000000000000", usdt.address, "62232606000000000000", {
			cancelEnabled: false,
			modifyEnabled: false,
			holdTokens: true,
		})

		let offer7 = await createOfferEthSell(dex.connect(alice), "200000000000000000", usdt.address, "62232606000000000000", {
			minimumSize: "200000000000000000"
		})

		let txMigrate = await dex.migrateContract()
		await txMigrate.wait()
    })
});