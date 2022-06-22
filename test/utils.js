const { ethers } = require ("hardhat")

const ZERO = "0x0000000000000000000000000000000000000000"

async function prepareEnvironment()
{
	const [owner, alice, bob, charlie, derek] = await ethers.getSigners()

	const MarsBase = await ethers.getContractFactory("MarsBase")
	const m = await MarsBase.deploy()

	const MarsBaseExchange = await ethers.getContractFactory("MarsBaseExchange")
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
	}
}

module.exports = {
	prepareEnvironment,
	ZERO,
}