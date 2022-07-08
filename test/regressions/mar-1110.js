const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { prepareEnvironment, getLastBlockTime } = require("../utils")

const ETH = "0x0000000000000000000000000000000000000000"

describe("MAR-1110", () => 
{
    it("should allow a part dynamic offer with token Alice as ETH to be bought 100% immediately, even with rounding issues", async () =>
    {
        const { owner, alice, bob, usdt, bat, dex, parseLogs } = await prepareEnvironment()
        
        // console.log(99)
        
        const batAmount = "100000000000000000000"
        const usdtAmount = "100000000000000000000"
        const usdtPurchaseAmount = "99999999990000000000"
        await bat.transfer(alice.address, batAmount)
        await usdt.transfer(bob.address, usdtAmount)
        
        // console.log(98)
        await bat.connect(alice).approve(dex.address, batAmount)

        let tx = await dex.connect(alice).createOffer(bat.address, [usdt.address], batAmount, [usdtAmount], {
            cancelEnabled: true,
            modifyEnabled: false,
            holdTokens: true,
            feeAlice: 5,
            feeBob: 5,
            smallestChunkSize: "0",
            deadline: await getLastBlockTime() + 86400,
            minimumSize: "1000000000000000000"
        })
        // console.log(96)
        let receipt = await tx.wait()
        // console.log(95)
        // console.log(receipt.events)
        let id = receipt.events.find(x => x.event == "OfferCreated").args[0]
        // console.log(94)
        // console.log(`id: ${id}`)

        await usdt.connect(bob).approve(dex.address, usdtAmount)

        tx = await dex.connect(bob).acceptOffer(id, usdt.address, usdtAmount);
        tx.wait();

        let offer = await dex.getOffer(id);
        expect(offer.active).to.equal(false);
    })
});