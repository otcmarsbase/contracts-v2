const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { checkEvent, checkEventExists, checkEventDoesntExist } = require('../events')
const { mintAll, expectBalances, approveMany } = require('../token-utils')
const { prepareEnvironment, getLastBlockTime, getOfferIdFromTx, getLogsFromTx } = require("../utils")

describe("bestbid/fees", () =>
{
	describe("setMaximumFee", () => {
		it("should allow owner to call", async () => {
			let env = await prepareEnvironment()
			let { bb } = env
			await bb.setMaximumFee(2000); // 2%
			expect(await bb.maximumFee()).equal("2000")
		})
        it("should fail if attempt to set a maximum fee smaller than minimum fee", async () => {
			let env = await prepareEnvironment()
			let { bb } = env
            await bb.setMinimumFee(700)
			await expect(bb.setMaximumFee(500)).to.be.revertedWith("400-IMAXF")
		})
		it("should fail if attempt to set invalid maximum fee", async () => {
			let env = await prepareEnvironment()
			let { bb } = env
			await expect(bb.setMaximumFee(200000)).to.be.revertedWith("400-IFS")
		})
		it("should fail if a non-owner try to call", async () => {
			let env = await prepareEnvironment()
			let { bb, alice } = env
			await expect(bb.connect(alice).setMaximumFee(2000)).to.be.revertedWith("403")
		})
	})
	
    describe("setMinimumFee", () => {
		it("should allow owner to call", async () => {
			let env = await prepareEnvironment()
			let { bb } = env
			await bb.setMinimumFee(500);
			expect(await bb.maximumFee()).equal("1000")
		})

		it("should fail if attempt to set a minimum fee greater than maximum fee", async () => {
			let env = await prepareEnvironment()
			let { bb } = env
			await expect(bb.setMinimumFee(2000)).to.be.revertedWith("400-IMINF")
		})

		it("should fail if a non-owner try to call", async () => {
			let env = await prepareEnvironment()
			let { bb, alice } = env
			await expect(bb.connect(alice).setMinimumFee(500)).to.be.revertedWith("403")
		})
	})
	
})
