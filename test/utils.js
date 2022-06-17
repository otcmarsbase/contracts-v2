const { ethers } = require ("hardhat")

async function prepareEnvironment()
{
	const [owner, alice, bob, charlie, derek] = await ethers.getSigners()

	const MarsBase = await ethers.getContractFactory("MarsBase")
	const m = await MarsBase.deploy()

	const MarsBaseExchange = await ethers.getContractFactory("MarsBaseExchange", {
		libraries: {
			MarsBase: m.address
		}
	})
	const dex = await MarsBaseExchange.deploy()

	const USDT = await ethers.getContractFactory("USDT")

	const usdt = await USDT.deploy()
	
	return {
		owner, alice, bob, charlie, derek,
		MarsBase: m,
		dex,
		usdt,
	}
}

module.exports = {
	prepareEnvironment,
}