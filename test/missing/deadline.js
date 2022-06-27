const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { checkEvent, checkEventExists, checkEventDoesntExist } = require('../events')
const { prepareEnvironment, ZERO, getOfferIdFromTx, getOfferDataFromTx } = require("../utils")

describe("dynamic offers with deadlines", () =>
{
	it("should not bid in an expired offer")
	it("should take out money from a successful expired offer as offermaker")
	it("should take out money from a successful expired offer as a bidder")
	it("should revert money from cancelled expired offer as offermaker")
	it("should revert money from cancelled expired offer as a bidder")
})
describe("static offers with deadlines", () =>
{
	it("should not bid in an expired offer")
	it("should take out money from a successful expired offer as offermaker")
	it("should take out money from a successful expired offer as a bidder")
	it("should revert money from cancelled expired offer as offermaker")
	it("should revert money from cancelled expired offer as a bidder")
})