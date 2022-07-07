const { getLastBlockTime, ZERO } = require("./utils")

const sensibleOfferDefaults = () => ({
	modifyEnabled: false,
	cancelEnabled: true,
	holdTokens: false,
	feeAlice: "5",
	feeBob: "5",
	minimumSize: "0",
	smallestChunkSize: "0",
	deadline: Math.floor((Date.now() / 1000) + 86400),
})

const isEth = (token) => token == ZERO

async function createOfferTokenToken(contract, tokenAlice, amountAlice, tokenBob, amountBob, params = sensibleOfferDefaults())
{
	let smallestChunkSize = amountAlice.substring(0, amountAlice.length - 2)
	let details = {
		...sensibleOfferDefaults(),
		deadline: await getLastBlockTime() + 86400,
		smallestChunkSize,
		...params,
	}
	let txCreate = await contract.createOffer(tokenAlice, [tokenBob], amountAlice, [amountBob], details, {
		value: isEth(tokenAlice) ? amountAlice : "0",
	})
	let receipt = await txCreate.wait()
	let offerCreatedEvent = receipt.events.find(x => x.event == "OfferCreated")
	expect(offerCreatedEvent).not.undefined
	let id = offerCreatedEvent.args[0]
	return {
		id,
		tokenAlice,
		amountAlice,
		tokenBob,
		amountBob,
		details,
	}
}

module.exports = {
	sensibleOfferDefaults,
	createOfferTokenToken,
}