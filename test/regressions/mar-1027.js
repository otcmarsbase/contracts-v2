const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { prepareJustContracts } = require('../utils')

const ETH = "0x0000000000000000000000000000000000000000"

const tomorrow = (now = Date.now()) => Math.floor(now / 1000 + 86400)

describe("MAR-1027", () => 
{
    it("should exchange tokens if a static offer has bids and is cancelled with under 50% purchased, ensuing the remainder goes back to the offer creator", async () =>
    {
        const [owner, alice, bob] = await ethers.getSigners()

        const { MarsBase, m, MarsBaseExchange, dex } = await prepareJustContracts()

        const USDT = await ethers.getContractFactory("USDT")
        const BAT = await ethers.getContractFactory("BAT18")

        const usdt = await USDT.deploy()
        const bat = await BAT.deploy()
        
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

        tx = await dex.connect(bob).acceptOffer(id, usdt.address, "10000000000000000")
        
        receipt = await tx.wait()
        let acceptedEvent = receipt.events.find(x => x.event == "OfferAccepted");

        expect(acceptedEvent.args.amountAliceReceived).to.equal("10000000000000000");
        expect(acceptedEvent.args.amountBobReceived).to.equal("10000000000000000");
        expect(acceptedEvent.args.tokenAddressAlice).to.equal(bat.address);
        expect(acceptedEvent.args.tokenAddressBob).to.equal(usdt.address);

        tx = await dex.connect(alice).cancelOffer(id)
        
        await tx.wait();

        expect(await usdt.balanceOf(alice.address)).to.equal("9950000000000000");
        expect(await bat.balanceOf(bob.address)).to.equal("9950000000000000");

        expect(await bat.balanceOf(alice.address)).to.equal("99990000000000000000");
    })
});