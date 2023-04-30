const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { prepareEnvironment, ZERO } = require("../utils")

describe("missing/next-offer-id", () => 
{
    it("should set next offer id as owner", async () =>
    {
		let { owner, alice, bob, dex } = await prepareEnvironment()

		await dex.setNextOfferId(1)
		expect(await dex.getNextOfferId()).equal(1)
		await dex.setNextOfferId(2)
		expect(await dex.getNextOfferId()).equal(2)
		await dex.setNextOfferId(3)
		expect(await dex.getNextOfferId()).equal(3)
		await dex.setNextOfferId(4)
		expect(await dex.getNextOfferId()).equal(4)
	})
    it("should not set next offer id as non-owner", async () =>
    {
		let { owner, alice, bob, dex } = await prepareEnvironment()

		await expect(dex.connect(alice).setNextOfferId(1)).revertedWith("403")
		await expect(dex.connect(bob).setNextOfferId(1)).revertedWith("403")
		await dex.setNextOfferId(1)
		await expect(dex.connect(alice).setNextOfferId(0)).revertedWith("403")
	})
})