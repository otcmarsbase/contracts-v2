const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { prepareEnvironment, getLastBlockTime } = require("../utils")

const ETH = "0x0000000000000000000000000000000000000000"

describe("MAR-974", () => 
{
    it("should send tokens to the commission wallet if no exchange contract is specified", async () =>
    {
        const { owner, alice, bob, charlie: commission, usdt, bat, dex, parseLogs } = await prepareEnvironment()

        let commissionTx = await dex.setCommissionAddress(commission.address);
        commissionTx.wait();
        
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
            smallestChunkSize: "10000",
            deadline: await getLastBlockTime() + 86400,
            minimumSize: "0"
        })
        // console.log(96)
        let receipt = await tx.wait()
        // console.log(95)
        // console.log(receipt.events)
        let id = receipt.events.find(x => x.event == "OfferCreated").args[0]
        // console.log(94)
        // console.log(`id: ${id}`)

        await usdt.connect(bob).approve(dex.address, usdtAmount)

        tx = await dex.connect(bob).acceptOffer(id, usdt.address, "100000000000000000")
        
        receipt = await tx.wait()
        let acceptedEvent = receipt.events.find(x => x.event == "OfferAccepted");

        expect(acceptedEvent.args.amountAliceReceived).to.equal("99500000000000000");
        expect(acceptedEvent.args.amountBobReceived).to.equal("99500000000000000");
        expect(acceptedEvent.args.tokenAddressAlice).to.equal(bat.address);
        expect(acceptedEvent.args.tokenAddressBob).to.equal(usdt.address);

        expect(await usdt.balanceOf(alice.address)).to.equal("99500000000000000");
        expect(await bat.balanceOf(bob.address)).to.equal("99500000000000000");

        // Check commission
        expect(await bat.balanceOf(commission.address)).to.equal("500000000000000");
        expect(await usdt.balanceOf(commission.address)).to.equal("500000000000000");
    })

    it("should not send tokens to the commission wallet if it's not specified", async () =>
    {
        const { owner, alice, bob, charlie: commission, usdt, bat, dex, parseLogs } = await prepareEnvironment()
        await dex.setCommissionAddress(ETH);
        
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

        expect(await usdt.balanceOf(alice.address)).to.equal("10000000000000000");
        expect(await bat.balanceOf(bob.address)).to.equal("10000000000000000");

        expect(await bat.balanceOf(alice.address)).to.equal("99990000000000000000");

        // Check commission
        expect(await bat.balanceOf(dex.address)).to.equal("0");
        expect(await usdt.balanceOf(dex.address)).to.equal("0");

        // Should be empty
        expect(await bat.balanceOf(commission.address)).to.equal("0");
        expect(await usdt.balanceOf(commission.address)).to.equal("0");
    })

    it("should exchange tokens to USDT if the commission wallet and exchange address is specified", async () =>
    {
        const { owner, alice, bob, charlie: commission, usdt, bat, dex, parseLogs } = await prepareEnvironment()

        let commissionTx = await dex.setCommissionAddress(commission.address);
        await commissionTx.wait();

        const MarsBaseSwap = await ethers.getContractFactory("MarsbaseSwapMock")
        const swap = await MarsBaseSwap.deploy();

        let exchangeTx = await dex.setExchangerAddress(swap.address);
        await exchangeTx.wait();
        
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
            holdTokens: true,
            feeAlice: 5,
            feeBob: 5,
            smallestChunkSize: "10000",
            deadline: await getLastBlockTime() + 86400,
            minimumSize: "0"
        })
        // console.log(96)
        let receipt = await tx.wait()
        // console.log(95)
        // console.log(receipt.events)
        let id = receipt.events.find(x => x.event == "OfferCreated").args[0]
        // console.log(94)
        // console.log(`id: ${id}`)

        await usdt.connect(bob).approve(dex.address, usdtAmount)

        await expect(dex.connect(bob).acceptOffer(id, usdt.address, "100000000000000000"))
        .to.emit(swap, "liquidateTokenEvent");
    })
});