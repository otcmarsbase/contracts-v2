function offerDataStringToOffer(data)
{
	let arr = data.split(',')

	let active = JSON.parse(arr.shift())
	let minimumMet = JSON.parse(arr.shift())
	let offerType = JSON.parse(arr.shift())
	let offerId = JSON.parse(arr.shift())
	let amountAlice = arr.shift()
	let feeAlice = arr.shift()
	let feeBob = arr.shift()
	let smallestChunkSize = arr.shift()
	let minimumSize = arr.shift()
	let deadline = parseInt(arr.shift())
	let amountRemaining = arr.shift()
	let offerer = arr.shift()
	let payoutAddress = arr.shift()
	let tokenAlice = arr.shift()
	
	let capabilities = [JSON.parse(arr.shift()), JSON.parse(arr.shift()), JSON.parse(arr.shift())]
	capabilities["modifyEnabled"] = capabilities[0]
	capabilities["cancelEnabled"] = capabilities[1]
	capabilities["holdTokens"] = capabilities[2]

	let amountBob = [arr.shift()]
	let minimumOrderAmountsAlice = [arr.shift()]
	let minimumOrderAmountsBob = [arr.shift()]
	let minimumOrderAddresses = [arr.shift()]
	let minimumOrderTokens = [arr.shift()]
	let tokenBob = [arr.shift()]

	return {
		// bool active
		active,
		// bool minimumMet
		minimumMet,
		// OfferType offerType
		offerType,
		// uint256 offerId
		offerId,
		// uint256 amountAlice
		amountAlice,
		// uint256 feeAlice
		feeAlice,
		// uint256 feeBob
		feeBob,
		// uint256 smallestChunkSize
		smallestChunkSize,
		// uint256 minimumSize
		minimumSize,
		// uint256 deadline
		deadline,
		// uint256 amountRemaining
		amountRemaining,
		// address offerer
		offerer,
		// address payoutAddress
		payoutAddress,
		// address tokenAlice
		tokenAlice,
		// bool[] capabilities
		capabilities,
		// uint256[] amountBob
		amountBob,
		// uint256[] minimumOrderAmountsAlice
		minimumOrderAmountsAlice,
		// uint256[] minimumOrderAmountsBob
		minimumOrderAmountsBob,
		// address[] minimumOrderAddresses
		minimumOrderAddresses,
		// address[] minimumOrderTokens
		minimumOrderTokens,
		// address[] tokenBob
		tokenBob,
	}
}

module.exports = {
	offerDataStringToOffer
}