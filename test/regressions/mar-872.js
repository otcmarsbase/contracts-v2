const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { checkEventExists } = require('../events')
const { prepareEnvironment, getLastBlockTime } = require("../utils")

const ETH = "0x0000000000000000000000000000000000000000"

describe("MAR-872", () => 
{
    it("should exchange tokens if a static offer has bids and is cancelled with under 50% purchased", async () =>
    {
        const { owner, alice, bob, usdt, bat, dex, parseLogs } = await prepareEnvironment()
        
        // console.log(99)
        
        const batAmount = "100000000000000000000"
        const usdtAmount = "100000000000000000000"
        await bat.transfer(alice.address, batAmount)
        await usdt.transfer(bob.address, usdtAmount)
        
        // console.log(98)
        await bat.connect(alice).approve(dex.address, batAmount)
        
        // console.log(97)
        let tx = await dex.connect(alice).createOffer(bat.address, [usdt.address], batAmount, [usdtAmount], {
            cancelEnabled: true,
            modifyEnabled: false,
            holdTokens: false,
            feeAlice: 5,
            feeBob: 5,
            smallestChunkSize: "0",
            deadline: await getLastBlockTime() + 86400,
            minimumSize: "1000000000000000"
        })
        // console.log(96)
        let receipt = await tx.wait()
        // console.log(95)
        // console.log(receipt.events)
        // console.log(94)
        // console.log(`id: ${id}`)

        await usdt.connect(bob).approve(dex.address, usdtAmount)

        tx = await dex.connect(bob).acceptOffer(0, usdt.address, "10000000000000000")
        
        receipt = await tx.wait()

		checkEventExists(parseLogs(receipt.logs), "OfferAccepted", {
			amountAliceReceived: "9950000000000000",
			amountBobReceived: "9950000000000000",
			feeAlice: "50000000000000",
			feeBob: "50000000000000",
			tokenAddressAlice: bat.address,
			tokenAddressBob: usdt.address,
		}, { exhaustive: false })

        tx = await dex.connect(alice).cancelOffer(0)
        
        await tx.wait();

        expect(await usdt.balanceOf(alice.address)).to.equal("9950000000000000");
        expect(await bat.balanceOf(bob.address)).to.equal("9950000000000000");
    })
});