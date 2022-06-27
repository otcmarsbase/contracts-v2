const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { checkEvent, checkEventExists, checkEventDoesntExist } = require('../events')
const { prepareEnvironment, ZERO, getOfferIdFromTx, getOfferDataFromTx } = require("../utils")

describe("cancel dynamic offers", () =>
{
	it("should not cancel non-existing offer")
	it("should not cancel non-active offer")
	it("should not cancel non-cancellable offer")
	it("should not cancel offers of other people")
	it("should cancel offers after deadline")
})
describe("cancel static offers", () =>
{
	it("should not cancel non-cancellable static offer")
	it("should cancel static offers after deadline")
	it("should cancel static offers before any bids were made")
	it("should cancel static offers after some bids were made but not enough")
	it("should cancel static offers after enough bids were made")
	it("should cancel static offers after some bids were made with 0 minimumSize")
})