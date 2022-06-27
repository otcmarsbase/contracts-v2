const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { prepareJustContracts } = require('../utils')

const ETH = "0x0000000000000000000000000000000000000000"

const tomorrow = (now = Date.now()) => Math.floor(now / 1000 + 86400)

describe("MAR-1068", () => 
{
    it("should make sure value is the same as amount alice when creating an offer in ETH", async () =>
    {
        const [owner, alice, bob, commission] = await ethers.getSigners()

        const { MarsBase, m, MarsBaseExchange, dex } = await prepareJustContracts()

        const USDT = await ethers.getContractFactory("USDT")
        const BAT = await ethers.getContractFactory("BAT18")

        const usdt = await USDT.deploy()
        const bat = await BAT.deploy()
        
        // console.log(99)
        
        const ethAmount = "100000000000000000000"
        const usdtAmount = "100000000000000000000"
        await usdt.transfer(bob.address, usdtAmount)
        
        // console.log(97)
        let tx = dex.connect(alice).createOffer(ETH, [usdt.address], ethAmount, [usdtAmount], {
            cancelEnabled: true,
            modifyEnabled: false,
            holdTokens: true,
            feeAlice: 5,
            feeBob: 5,
            smallestChunkSize: "0",
            deadline: tomorrow(),
            minimumSize: "1000000000000000000"
        }, {value: "1000000"})

        expect(tx).to.be.revertedWith("T1a");

    })

    it("should make sure value is not zero when creating an offer in ETH", async () =>
    {
        const [owner, alice, bob, commission] = await ethers.getSigners()

        const { MarsBase, m, MarsBaseExchange, dex } = await prepareJustContracts()

        const USDT = await ethers.getContractFactory("USDT")
        const BAT = await ethers.getContractFactory("BAT18")

        const usdt = await USDT.deploy()
        const bat = await BAT.deploy()
        
        // console.log(99)
        
        const ethAmount = "100000000000000000000"
        const usdtAmount = "100000000000000000000"
        await usdt.transfer(bob.address, usdtAmount)
        
        // console.log(97)
        let tx = dex.connect(alice).createOffer(ETH, [usdt.address], ethAmount, [usdtAmount], {
            cancelEnabled: true,
            modifyEnabled: false,
            holdTokens: true,
            feeAlice: 5,
            feeBob: 5,
            smallestChunkSize: "0",
            deadline: tomorrow(),
            minimumSize: "1000000000000000000"
        }, {value: "0"})

        expect(tx).to.be.revertedWith("M3");

    })
});