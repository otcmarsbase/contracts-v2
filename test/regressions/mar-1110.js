const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")

const ETH = "0x0000000000000000000000000000000000000000"

const tomorrow = (now = Date.now()) => Math.floor(now / 1000 + 86400)

describe("MAR-1110", () => 
{
    it("should allow a part dynamic offer with token Alice as ETH to be bought 100% immediately, even with rounding issues", async () =>
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
        const BAT = await ethers.getContractFactory("BAT18")

        const usdt = await USDT.deploy()
        const bat = await BAT.deploy()
        
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
            modifyEnabled: true,
            holdTokens: true,
            feeAlice: 5,
            feeBob: 5,
            smallestChunkSize: "0",
            deadline: tomorrow(),
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