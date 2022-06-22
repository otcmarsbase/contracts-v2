const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { prepareEnvironment } = require("../utils")

const ETH = "0x0000000000000000000000000000000000000000"

const tomorrow = (now = Date.now()) => Math.floor(now / 1000 + 86400)

describe("MAR-1125", () => 
{
    it("should send back remaining ETH in a static offer after bid", async () =>
    {
        const [owner, alice, bob] = await ethers.getSigners()

        const MarsBase = await ethers.getContractFactory("MarsBase")
        const m = await MarsBase.deploy()

        const MarsBaseExchange = await ethers.getContractFactory("MarsBaseExchange", {
            // libraries: {
            //     MarsBase: m.address
            // }
        })
        const dex = await MarsBaseExchange.deploy()

        const USDT = await ethers.getContractFactory("USDT")

        const usdt = await USDT.deploy()
        
        // console.log(99)

		const offer = {
			// uint256 offerId
			offerId: 2,
			// address sender
			sender: "0x25fa0cc65f8b5db764eb2243b13db4d63b29fd58",
			// uint256 blockTimestamp
			blockTimestamp: 1655121337,
	
			// MarsBaseCommon.MBOffer offer
			offer: {
				// bool active
				active: true,
				// bool minimumMet
				minimumMet: false,
				// OfferType offerType
				offerType: 3,
				// uint256 offerId
				offerId: 2,
				// uint256 amountAlice
				amountAlice: "200000000000000000",
				// uint256 feeAlice
				feeAlice: "5",
				// uint256 feeBob
				feeBob: "5",
				// uint256 smallestChunkSize
				smallestChunkSize: "2000000000000000",
				// uint256 minimumSize
				minimumSize: "0",
				// uint256 deadline
				deadline: 1655207697,
				// uint256 amountRemaining
				amountRemaining: "200000000000000000",
				// address offerer
				offerer: "0x25fa0cc65f8b5db764eb2243b13db4d63b29fd58",
				// address payoutAddress
				payoutAddress: "0x25fa0cc65f8b5db764eb2243b13db4d63b29fd58",
				// address tokenAlice
				tokenAlice: "0x0000000000000000000000000000000000000000",
				// bool[] capabilities
				capabilities: [true, true, false], 
				// uint256[] amountBob
				amountBob: ["62232606000000000000"],
				// uint256[] minimumOrderAmountsAlice
				minimumOrderAmountsAlice: [],
				// uint256[] minimumOrderAmountsBob
				minimumOrderAmountsBob: [],
				// address[] minimumOrderAddresses
				minimumOrderAddresses: [],
				// address[] minimumOrderTokens
				minimumOrderTokens: [],
				// address[] tokenBob
				tokenBob: ["0x525375c267bef2c39e5e74603456312324fe9fb9"]
			}
		}

		// console.log(`starting create`)

		let txCreate = await dex.connect(alice).createOffer(ETH, [usdt.address], "200000000000000000", ["62232606000000000000"], {
            cancelEnabled: true,
            modifyEnabled: true,
            holdTokens: false,
            feeAlice: "5",
            feeBob: "5",
            smallestChunkSize: "2000000000000000",
            deadline: Math.floor((Date.now() / 1000) + (1655207697 - 1655121337)),
            minimumSize: "0"
        }, {
			value: "200000000000000000"
		})
        let receipt = await txCreate.wait()
		let offerCreatedEvent = receipt.events.find(x => x.event == "OfferCreated")
        let id = offerCreatedEvent.args[0]
		expect(id).equal(0)

		// console.log(`starting bid`)

        await usdt.transfer(bob.address, "15558151500000000000")
        await usdt.connect(bob).approve(dex.address, "15558151500000000000")

		let txBid = await dex.connect(bob).acceptOffer(id, usdt.address, "15558151500000000000")
        let bidReceipt = await txBid.wait()
    })
    it("should close ETH offer after 3 bids", async () =>
    {
		// MarsBaseCommon.MBOffer offer
		const offer = {
			// bool active
			active: true,
			// bool minimumMet
			minimumMet: false,
			// OfferType offerType
			offerType: 3,
			// uint256 offerId
			offerId: 3,
			// uint256 amountAlice
			amountAlice: "200000000000000000",
			// uint256 feeAlice
			feeAlice: "5",
			// uint256 feeBob
			feeBob: "5",
			// uint256 smallestChunkSize
			smallestChunkSize: "2000000000000000",
			// uint256 minimumSize
			minimumSize: "0",
			// uint256 deadline
			deadline: "1655285743",
			// uint256 amountRemaining
			amountRemaining: "37499999999999983",
			// address offerer
			offerer: "0x25fA0Cc65F8B5DB764EB2243b13db4D63B29fd58",
			// address payoutAddress
			payoutAddress: "0x25fA0Cc65F8B5DB764EB2243b13db4D63B29fd58",
			// address tokenAlice
			tokenAlice: "0x0000000000000000000000000000000000000000",
			// bool[] capabilities
			capabilities: [true, true, false],
			// uint256[] amountBob
			amountBob: ["69147340000000000000"],
			// uint256[] minimumOrderAmountsAlice
			minimumOrderAmountsAlice: [],
			// uint256[] minimumOrderAmountsBob
			minimumOrderAmountsBob: [],
			// address[] minimumOrderAddresses
			minimumOrderAddresses: [],
			// address[] minimumOrderTokens
			minimumOrderTokens: [],
			// address[] tokenBob
			// tokenBob: ["0x525375C267BeF2C39E5e74603456312324fe9fB9"]
			tokenBob: ["0x525375C267BeF2C39E5e74603456312324fe9fB9"]
		}

		// console.log(`starting create`)

		const txParamsBob1 = {
			// 0	offerId	uint256	3
			offerId: "3",
			// 1	tokenBob	address	0x525375C267BeF2C39E5e74603456312324fe9fB9
			tokenBob: "0x525375C267BeF2C39E5e74603456312324fe9fB9",
			// 2	amountBob	uint256	17286835000000000000
			amountBob: "17286835000000000000",
		}
		const txParamsBob2 = {
			// 0	offerId	uint256	3
			offerId: "3",
			// 1	tokenBob	address	0x525375C267BeF2C39E5e74603456312324fe9fB9
			tokenBob: "0x525375C267BeF2C39E5e74603456312324fe9fB9",
			// 2	amountBob	uint256	38895378750000006000
			amountBob: "38895378750000006000",
		}
		const txParamsBob3 = {
			// 0	offerId	uint256	3
			offerId: "3",
			// 1	tokenBob	address	0x525375C267BeF2C39E5e74603456312324fe9fB9
			tokenBob: "0x525375C267BeF2C39E5e74603456312324fe9fB9",
			// 2	amountBob	uint256	12965126249999997000
			amountBob: "12965126249999997000",
		}

		let { owner, alice, bob, dex, usdt, MarsBase } = await prepareEnvironment()

		let txCreate = await dex.connect(alice).createOffer(ETH, [usdt.address], offer.amountAlice, offer.amountBob, {
            modifyEnabled: offer.capabilities[0],
            cancelEnabled: offer.capabilities[1],
            holdTokens: offer.capabilities[2],
            feeAlice: offer.feeAlice,
            feeBob: offer.feeBob,
            smallestChunkSize: offer.smallestChunkSize,
            deadline: Math.floor((Date.now() / 1000) + 86400),
            minimumSize: offer.minimumSize
        }, {
			value: offer.amountAlice
		})
        let receipt = await txCreate.wait()
		let offerCreatedEvent = receipt.events.find(x => x.event == "OfferCreated")
        let id = offerCreatedEvent.args[0]
		expect(id).equal(0)

		// console.log(`starting bid`)
		
        await usdt.transfer(bob.address, txParamsBob1.amountBob)
        await usdt.transfer(bob.address, txParamsBob2.amountBob)
        await usdt.transfer(bob.address, txParamsBob3.amountBob)

        await usdt.connect(bob).approve(dex.address, txParamsBob1.amountBob)
		let txBid1 = await dex.connect(bob).acceptOffer(id, usdt.address, txParamsBob1.amountBob)
        let bidReceipt1 = await txBid1.wait()

        await usdt.connect(bob).approve(dex.address, txParamsBob2.amountBob)
		let txBid2 = await dex.connect(bob).acceptOffer(id, usdt.address, txParamsBob2.amountBob)
        let bidReceipt2 = await txBid2.wait()

		// price(amountBob, acceptedAmountBob, offer.amountAlice)
		// console.log("price: " + await MarsBase.price(txParamsBob1.amountBob, offer.amountBob[0], offer.amountAlice))

		let amounts = [txParamsBob1, txParamsBob2, txParamsBob3].map(x => ethers.BigNumber.from(x.amountBob))
		let sum = amounts.reduce((a, b) => a.add(b), ethers.BigNumber.from(0))

		// console.log(`sold: ${amounts[0].add(amounts[1])}, total: ${sum}, offer size: ${offer.amountBob}`)
		// console.log(`for bob ${sum} we get ${await MarsBase.price(sum, offer.amountBob[0], offer.amountAlice)} out of ${offer.amountAlice}`)
		
		let offerB = await dex.connect(bob).getOffer(id)
		// console.log(offerB)

        await usdt.connect(bob).approve(dex.address, txParamsBob3.amountBob)
		let txBid3 = dex.connect(bob).acceptOffer(id, usdt.address, txParamsBob3.amountBob)
		await expect(txBid3).revertedWith("M10")

		let amountBobWithoutOverflow = "12965126249999994000"
		let txBid4 = await dex.connect(bob).acceptOffer(id, usdt.address, amountBobWithoutOverflow)
		let bidReceipt4 = await txBid4.wait()
    })
});