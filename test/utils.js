const { ethers, network } = require ("hardhat")
const { tryParseLog, PUBLIC_ABIS } = require("./events")

const ZERO = "0x0000000000000000000000000000000000000000"

async function prepareJustContracts()
{
	const MarsBase = await ethers.getContractFactory("MarsBase")
	const m = await MarsBase.deploy()

	const MarsBaseExchange = await ethers.getContractFactory("MarsBaseExchange")
	// const MarsBaseExchange = await ethers.getContractFactory("MarsBaseExchangeOld", {
	// 	libraries: {
	// 		MarsBase: m.address,
	// 	}
	// })
	const dex = await MarsBaseExchange.deploy()
	return {
		MarsBase,
		m,
		MarsBaseExchange,
		dex,
	}
}
async function prepareEnvironment()
{
	const [owner, alice, bob, charlie, derek] = await ethers.getSigners()

	const { m, dex } = await prepareJustContracts()

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
	let offerData = await getOfferDataFromTx(txCreate)
	return offerData[0]
}
async function getOfferDataFromTx(txCreate)
{
	let receipt = await (await txCreate).wait()
	let offerCreatedEvent = receipt.events.find(x => x.event == "OfferCreated")
	expect(offerCreatedEvent, `OfferCreated event not found`).not.undefined
	return offerCreatedEvent.args
}

async function skipTimeTo(timestamp)
{
	await network.provider.send("evm_setNextBlockTimestamp", [timestamp])
}

async function skipTime(seconds)
{
	// forward time in hardhat
	await network.provider.send("evm_increaseTime", [seconds])
	await network.provider.send("evm_mine")
}
async function getLastBlockTime()
{
	let block = await ethers.provider.getBlock("latest")
	return block.timestamp
}

module.exports = {
	prepareJustContracts,
	prepareEnvironment,
	getOfferIdFromTx,
	getOfferDataFromTx,
	skipTime,
	skipTimeTo,
	getLastBlockTime,
	ZERO,
}