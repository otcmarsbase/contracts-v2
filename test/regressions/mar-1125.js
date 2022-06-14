const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")

const ETH = "0x0000000000000000000000000000000000000000"

const tomorrow = (now = Date.now()) => Math.floor(now / 1000 + 86400)

describe("MAR-1125", () => 
{
    it("should allow to buy ETH for tokens in a static offer", async () =>
    {
        const [owner, alice, bob] = await ethers.getSigners()

        const MarsBase = await ethers.getContractFactory("MarsBase")
        const m = await MarsBase.deploy()

        const MarsBaseExchange = await ethers.getContractFactory("MarsBaseExchange", {
            libraries: {
                MarsBase: m.address
            }
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
        })
        let receipt = await txCreate.wait()
        let id = receipt.events.find(x => x.event == "OfferCreated").args[0]
		expect(id).equal(1)

		// console.log(`starting bid`)

        await usdt.transfer(bob.address, "15558151500000000000")
        await usdt.connect(bob).approve(dex.address, "15558151500000000000")

		let txBid = await dex.connect(bob).acceptOffer(id, usdt.address, "15558151500000000000")
        let bidReceipt = await txBid.wait()
    })
});