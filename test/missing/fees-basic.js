const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { prepareEnvironment } = require("../utils")

describe("missing/fees-basic", () => 
{
	describe("minimum-fee-basic", () => {
		it("should have 0 minimum fee by default", async () =>
		{
			let { dex } = await prepareEnvironment()
	
			let fee = await dex.getMinimumFee()
			expect(fee).equal(0)
		})
		it("should set minimum fee as owner", async () =>
		{
			let { owner, alice, bob, charlie, dex } = await prepareEnvironment()
	
			expect(await dex.getMinimumFee()).equal(0)
			
			await dex.setMinimumFee(1)
			expect(await dex.getMinimumFee()).equal(1)
	
			await dex.setMinimumFee(10)
			expect(await dex.getMinimumFee()).equal(10)
	
			await dex.setMinimumFee(0)
			expect(await dex.getMinimumFee()).equal(0)
		})
		it("should not set minimum fee as non-owner", async () =>
		{
			let { owner, alice, bob, charlie, dex } = await prepareEnvironment()
	
			await expect(dex.connect(alice).setMinimumFee(1)).revertedWith("403")
			await expect(dex.connect(bob).setMinimumFee(1)).revertedWith("403")
			await expect(dex.connect(charlie).setMinimumFee(1)).revertedWith("403")
		})
	})
   
	describe("maximum-fee-basic", () => {
		it("should have 1% maximum fee by default", async () =>
		{
			let { dex } = await prepareEnvironment()
	
			let fee = await dex.maximumFee()
			expect(fee).equal("10")
		})
		it("should set maximum fee as owner", async () =>
		{
			let { dex } = await prepareEnvironment()
	
			expect(await dex.maximumFee()).equal(10)
			
			await dex.setMaximumFee(1)
			expect(await dex.maximumFee()).equal(1)
	
			await dex.setMaximumFee(20)
			expect(await dex.maximumFee()).equal(20)
	
			await dex.setMaximumFee(10)
			expect(await dex.maximumFee()).equal(10)
		})
		it("should not set maximum fee as non-owner", async () =>
		{
			let {  alice, bob, charlie, dex } = await prepareEnvironment()
	
			await expect(dex.connect(alice).setMaximumFee(1)).revertedWith("403")
			await expect(dex.connect(bob).setMaximumFee(1)).revertedWith("403")
			await expect(dex.connect(charlie).setMaximumFee(1)).revertedWith("403")
		})
	})
})