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
	const dex = await MarsBaseExchange.deploy("0")

	const BestBid = await ethers.getContractFactory("MarsbaseBestBid")
	const bestBid = await BestBid.deploy("0")

	const Marketplace = await ethers.getContractFactory("MarsbaseMarketplace")
	const mplace = await Marketplace.deploy("0")

	const DexAttackMock = await ethers.getContractFactory("MarsBaseExchangeAttackMock")
	const dexAttackMock =  await DexAttackMock.deploy(dex.address)

	return {
		MarsBase,
		m,
		MarsBaseExchange,
		dex,
		BestBid,
		bestBid,
		Marketplace,
		mplace,
		dexAttackMock
	}
}
async function prepareEnvironment()
{
	const [owner, alice, bob, charlie, derek] = await ethers.getSigners()

	const { m, dex, bestBid, mplace, dexAttackMock } = await prepareJustContracts()

	const USDT = await ethers.getContractFactory("USDT")
	const BAT = await ethers.getContractFactory("BAT18")
	const Tether = await ethers.getContractFactory("TetherToken")

	const usdt = await USDT.deploy()
	const bat = await BAT.deploy()
	const tether = await Tether.deploy("100000000000", "Tether USD", "USDT", 6)
	
	return {
		owner, alice, bob, charlie, derek,
		MarsBase: m,
		dex,
		bb: bestBid,
		mplace,
		dexAttackMock,
		usdt,
		bat,
		tether,
		mint: {
			usdt: async (address, amount) => await usdt.transfer(address, amount),
			bat: async (address, amount) => await bat.transfer(address, amount),
			tether: async (address, amount) => { await tether.issue(amount), await tether.transfer(address, amount)},
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
	let logs = await getLogsFromTx(txCreate)
	let offerCreatedEvent = logs.find(x => x.name == "OfferCreated")
	expect(offerCreatedEvent, `OfferCreated event not found`).not.undefined
	return offerCreatedEvent.args
}
async function getLogsFromTx(txCreate)
{
	let receipt = await (await txCreate).wait()
	let logs = receipt.logs.map(tryParseLog(...PUBLIC_ABIS))
	return logs
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
	getLogsFromTx,
	skipTime,
	skipTimeTo,
	getLastBlockTime,
	ZERO,
}