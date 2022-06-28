const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { prepareEnvironment, ZERO } = require("../utils")

describe("missing/fee", () => 
{
    it("should correctly calculate fee for small amounts", async () =>
    {
		let { owner, alice, bob, dex } = await prepareEnvironment()

		let feePercent = 5
		for (let [amount, feeAmount] of [
			[0, 0],
			[1, 0],
			[5, 0],
			
			[100, 0],
			
			[199, 0],
			[200, 1],
			[201, 1],
			
			[399, 1],
			[400, 2],
			[401, 2],

			[999, 4],
			[1000, 5],
			[1001, 5],
			[10000, 50],

			// ["999991465593435680596738785309628", "1999982931186871361193477570619256"],
		])
		{
			let [amountAfterFee, feeAmountResult] = await dex.afterFee(amount, feePercent)
			// console.log(`${amountAlice} ${amountBob} = ${price}`)
			// console.log(`${amount} - ${feePercent/10}% = ${amountAfterFee}  ${feeAmountResult}`)
			expect(feeAmountResult, `${amount} * ${feePercent/10}% = ${feeAmountResult}`).equal(feeAmount)
			expect(amountAfterFee, `${amount} - ${feePercent/10}% = ${amountAfterFee}`).equal(amount - feeAmountResult)
		}
	})
})