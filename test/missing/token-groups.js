const assert = require ('assert/strict')
const BigNumber = require ('bignumber.js')
const { expect } = require ("chai")
const { ethers } = require ("hardhat")
const { checkEvent, checkEventExists, checkEventDoesntExist } = require('../events')
const { prepareEnvironment, ZERO, getOfferIdFromTx, getOfferDataFromTx } = require("../utils")

describe("missing/token-groups", () =>
{
	it("should trade multiple Bob tokens at once")
})
