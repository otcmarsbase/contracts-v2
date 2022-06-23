const { ethers } = require ("hardhat")
const { tryParseLog, PUBLIC_ABIS } = require("./events")

const ZERO = "0x0000000000000000000000000000000000000000"

async function prepareEnvironment()
{
	const [owner, alice, bob, charlie, derek] = await ethers.getSigners()

	const MarsBase = await ethers.getContractFactory("MarsBase")
	const m = await MarsBase.deploy()

	const MarsBaseExchange = await ethers.getContractFactory("MarsBaseExchange")
	// const MarsBaseExchange = await ethers.getContractFactory("MarsBaseExchangeOld", {
	// 	libraries: {
	// 		MarsBase: m.address,
	// 	}
	// })
	const dex = await MarsBaseExchange.deploy()

	const USDT = await ethers.getContractFactory("USDT")
	const BAT = await ethers.getContractFactory("BAT18")

	const usdt = await USDT.deploy()
	const bat = await BAT.deploy()
	
	return {
		owner, alice, bob, charlie, derek,
		MarsBase: m,
		dex,
		usdt,
		bat,
		mint: {
			usdt: async (address, amount) => await usdt.transfer(address, amount),
			bat: async (address, amount) => await bat.transfer(address, amount),
		},
		parseLogs: (logs) =>
			logs.map(tryParseLog(m.interface, dex.interface, ...PUBLIC_ABIS))
	}
}

async function getOfferIdFromTx(txCreate)
{
	let receipt = await (await txCreate).wait()
	let offerCreatedEvent = receipt.events.find(x => x.event == "OfferCreated")
	expect(offerCreatedEvent).not.undefined
	let id = offerCreatedEvent.args[0]
	return id
}

module.exports = {
	prepareEnvironment,
	getOfferIdFromTx,
	ZERO,
}