const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { prepareEnvironment, ZERO } = require("../utils")

describe("missing/commission-exchanger-basic", () => 
{
    it("should set commission address as owner", async () =>
    {
		let { owner, alice, bob, dex } = await prepareEnvironment()

		await dex.setCommissionAddress(alice.address)
		expect(await dex.getCommissionAddress()).equal(alice.address)
		await dex.setCommissionAddress(bob.address)
		expect(await dex.getCommissionAddress()).equal(bob.address)
		await dex.setCommissionAddress(ZERO)
		expect(await dex.getCommissionAddress()).equal(ZERO)
	})
    it("should not set commission address as non-owner", async () =>
    {
		let { owner, alice, bob, dex } = await prepareEnvironment()

		await expect(dex.connect(alice).setCommissionAddress(alice.address)).revertedWith("403")
		await expect(dex.connect(bob).setCommissionAddress(alice.address)).revertedWith("403")
		await dex.setCommissionAddress(alice.address)
		await expect(dex.connect(alice).setCommissionAddress(ZERO)).revertedWith("403")
	})
    it("should set commission exchanger as owner", async () =>
    {
		let { owner, alice, bob, dex } = await prepareEnvironment()

		await dex.setExchangerAddress(alice.address)
		expect(await dex.getExchangerAddress()).equal(alice.address)
		await dex.setExchangerAddress(bob.address)
		expect(await dex.getExchangerAddress()).equal(bob.address)
		await dex.setExchangerAddress(ZERO)
		expect(await dex.getExchangerAddress()).equal(ZERO)
	})
    it("should not set commission exchanger as non-owner", async () =>
    {
		let { owner, alice, bob, dex } = await prepareEnvironment()

		await expect(dex.connect(alice).setExchangerAddress(alice.address)).revertedWith("403")
		await expect(dex.connect(bob).setExchangerAddress(alice.address)).revertedWith("403")
		await dex.setExchangerAddress(alice.address)
		await expect(dex.connect(alice).setExchangerAddress(ZERO)).revertedWith("403")
	})
})