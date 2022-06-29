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

async function createOfferTokenToken(contract, tokenAlice, amountAlice, tokenBob, amountBob, params = sensibleOfferDefaults())
{
	let smallestChunkSize = amountAlice.substring(0, amountAlice.length - 2)
	let details = {
		...sensibleOfferDefaults(),
		smallestChunkSize,
		...params,
	}
	let txCreate = await contract.createOffer(tokenAlice, [tokenBob], amountAlice, [amountBob], details)
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