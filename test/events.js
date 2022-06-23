const { expect } = require("chai")

const excludeNumberKeys = (keys) =>
	keys.filter(x => parseInt(x).toString() != x)

const checkEvent = (log, name, args, params = { exhaustive: true }) =>
{
	expect(log.name).eq(name, `[Event] ${log.name} != ${name}`)
	for (let key in args)
	{
		let val = log.args[key]
		let m = `[Event] ${name}.${key} != ${args[key]}`
		if (ethers.BigNumber.isBigNumber(val))
			expect(val.toString()).eq(args[key], m)
		else
			expect(val).eql(args[key], m)
	}
	if (params.exhaustive)
		expect(excludeNumberKeys(Object.keys(log.args))).eql(Object.keys(args), "events keys are missing")
}
const erc20Abi = new ethers.utils.Interface(
	[
		"event Transfer(address indexed from, address indexed to, uint256 value)",
		"event Approval(address indexed owner, address indexed spender, uint256 value)",
		"function totalSupply() external view returns (uint256)",
		"function balanceOf(address account) external view returns (uint256)",
		"function transfer(address to, uint256 amount) external returns (bool)",
		"function allowance(address owner, address spender) external view returns (uint256)",
		"function approve(address spender, uint256 amount) external returns (bool)",
		"function transferFrom(address from, address to, uint256 amount) external returns (bool)",
	]
)
const tryParseLog = (...interfaces) => (log) =>
{
	for (let interface of interfaces)
	{
		try
		{
			return interface.parseLog(log)
		}
		catch (e)
		{
		}
	}
	return log
}
const PUBLIC_ABIS = [
	erc20Abi,
]

module.exports = {
	checkEvent,
	tryParseLog,
	PUBLIC_ABIS,
}