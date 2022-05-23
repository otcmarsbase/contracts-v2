const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")

const ETH = "0x0000000000000000000000000000000000000000"

const tomorrow = (now = Date.now()) => Math.floor(now / 1000 + 86400)

describe("MAR-842", () => 
{
    it("allow eth to be purchased for tokens with a static offer", async () =>
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
        const BAT = await ethers.getContractFactory("BAT18")

        const usdt = await USDT.deploy()
        const bat = await BAT.deploy()
        
        // console.log(99)
        
        const ethAmount = "100000000000000000000"
        const usdtAmount = "100000000000000000000"
        await usdt.transfer(bob.address, usdtAmount)
        
        // console.log(97)
        let tx = await dex.connect(alice).createOffer(ETH, [usdt.address], ethAmount, [usdtAmount], {
            cancelEnabled: true,
            modifyEnabled: true,
            holdTokens: true,
            feeAlice: 5,
            feeBob: 5,
            smallestChunkSize: "0",
            deadline: tomorrow(),
            minimumSize: "1000000000000000000"
        }, {value: ethAmount})
        // console.log(96)
        let receipt = await tx.wait()
        // console.log(95)
        // console.log(receipt.events)
        let id = receipt.events.find(x => x.event == "OfferCreated").args[0]
        // console.log(94)
        // console.log(`id: ${id}`)

        await usdt.connect(bob).approve(dex.address, usdtAmount)

        tx = await dex.connect(bob).acceptOffer(id, usdt.address, "60000000000000000")
        
        receipt = await tx.wait()
        let acceptedEvent = receipt.events.find(x => x.event == "OfferAccepted");

        expect(acceptedEvent.args.amountAliceReceived).to.equal("60000000000000000");
        expect(acceptedEvent.args.amountBobReceived).to.equal("60000000000000000");
        expect(acceptedEvent.args.feeAlice).to.equal("300000000000000");
        expect(acceptedEvent.args.feeBob).to.equal("300000000000000");
        expect(acceptedEvent.args.tokenAddressAlice).to.equal(ETH);
        expect(acceptedEvent.args.tokenAddressBob).to.equal(usdt.address);
    })
});