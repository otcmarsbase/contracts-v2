// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./MarsBase.sol";
import "./MarsBaseCommon.sol";
import "./IMarsbaseExchange.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// import "hardhat/console.sol";

/// @title MarsBaseExchange
/// @author dOTC Marsbase
/// @notice This contract contains the public facing elements of the marsbase exchange. 
contract MarsBaseExchange is IMarsbaseExchange
{
    address owner;

    uint256 nextOfferId = 0;
	uint256 activeOffersCount = 0;

    uint256 minimumFee = 0;

    address commissionWallet;
    address commissionExchanger;
	
    bool locked = false;

    mapping(uint256 => MarsBaseCommon.MBOffer) public offers;

    constructor() {
		owner = msg.sender;
		commissionWallet = msg.sender;
    }

	// onlyOwner modifier
	modifier onlyOwner {
		require(msg.sender == owner, "403");
		_;
	}
	modifier unlocked {
		require(!locked, "409");
		_;
	}
	
	function setCommissionAddress(address wallet) onlyOwner public
	{
		commissionWallet = wallet;
	}
	function getCommissionAddress() public view returns (address)
	{
		return commissionWallet;
	}
	function setExchangerAddress(address exchangeContract) onlyOwner public
	{
		commissionExchanger = exchangeContract;
	}
	function getExchangerAddress() public view returns (address)
	{
		return commissionExchanger;
	}
	function setMinimumFee(uint256 _minimumFee) onlyOwner public
	{
		minimumFee = _minimumFee;
	}
	function getMinimumFee() public view returns (uint256)
	{
		return minimumFee;
	}
	function setNextOfferId(uint256 _nextOfferId) onlyOwner public
	{
		nextOfferId = _nextOfferId;
	}
	function getNextOfferId() public view returns (uint256)
	{
		return nextOfferId;
	}
	function getOffer(uint256 offerId) public view returns (MarsBaseCommon.MBOffer memory)
	{
		return offers[offerId];
	}
	function getOwner() public view returns (address)
	{
		return owner;
	}
	function changeOwner(address newOwner) onlyOwner public
	{
		owner = newOwner;
	}

	uint256 constant MAX_UINT256 = type(uint256).max;

	uint256 constant POW_2_128 = 2**128;
	uint256 constant POW_2_64 = 2**64;
	uint256 constant POW_2_32 = 2**32;
	uint256 constant POW_2_16 = 2**16;
	uint256 constant POW_2_8 = 2**8;
	uint256 constant POW_2_4 = 2**4;
	uint256 constant POW_2_2 = 2**2;
	uint256 constant POW_2_1 = 2**1;
	
	function log2(uint256 x) public pure returns (uint8 n)
	{
		if (x >= POW_2_128) { x >>= 128; n += 128; }
		if (x >= POW_2_64) { x >>= 64; n += 64; }
		if (x >= POW_2_32) { x >>= 32; n += 32; }
		if (x >= POW_2_16) { x >>= 16; n += 16; }
		if (x >= POW_2_8) { x >>= 8; n += 8; }
		if (x >= POW_2_4) { x >>= 4; n += 4; }
		if (x >= POW_2_2) { x >>= 2; n += 2; }
		if (x >= 2) { n += 1; }
	}

	/**
		Price calculation is approximate, but it's good enough for our purposes.
		We don't need the exact amount of tokens, we just need a close enough approximation.
	 */
	function price(
        uint256 amountAlice,
        uint256 offerAmountAlice,
        uint256 offerAmountBob
    ) public pure returns (uint256)
	{
		uint16 amountAliceLog2 = log2(amountAlice);
		uint16 offerAmountBobLog2 = log2(offerAmountBob);

		if ((amountAliceLog2 + offerAmountBobLog2) < 240) // TODO: check bounds for 255 instead of 240
		{
			return (amountAlice * offerAmountBob) / offerAmountAlice;

			// uint256 numerator = amountAlice * offerAmountBob;
			// uint256 finalPrice = numerator / offerAmountAlice;
			// return finalPrice;
		}

		// otherwise, just divide the bigger value
		if (amountAlice >= offerAmountBob)
		{
			// return (amountAlice * offerAmountBob) / offerAmountAlice;
			// return amountAlice * offerAmountBob / offerAmountAlice;
			// return amountAlice / offerAmountAlice * offerAmountBob;
			// return (amountAlice / offerAmountAlice) * offerAmountBob;
			return (amountAlice / offerAmountAlice) * offerAmountBob;
		}
		else
		{
			// return (amountAlice * offerAmountBob) / offerAmountAlice;
			// return amountAlice * offerAmountBob / offerAmountAlice;
			// return amountAlice * offerAmountBob / offerAmountAlice;
			// return amountAlice * (offerAmountBob / offerAmountAlice);
			return amountAlice * (offerAmountBob / offerAmountAlice);
		}
	}

	// max safe uint256 constant that can be calculated for 1e4 fee
	uint256 constant MAX_SAFE_TARGET_AMOUNT = MAX_UINT256 / (1e4);

	function afterFee(uint256 amountBeforeFee, uint256 feePercent) public pure returns (uint256 amountAfterFee, uint256 fee)
	{
		if (feePercent == 0)
			return (amountBeforeFee, 0);

		if (feePercent >= 1e3)
			return (0, amountBeforeFee);

		if (amountBeforeFee < MAX_SAFE_TARGET_AMOUNT)
			fee = (amountBeforeFee * feePercent) / 1e3;
		else
			fee = (amountBeforeFee / 1e3) * feePercent;

		amountAfterFee = amountBeforeFee - fee;
		return (amountAfterFee, fee);
	}

	// TODO: rename to `getAllActiveOffers`
	function getAllOffers() public view returns (MarsBaseCommon.MBOffer[] memory)
	{
		MarsBaseCommon.MBOffer[] memory offersArray = new MarsBaseCommon.MBOffer[](activeOffersCount);
		uint256 i = 0;
		for (uint256 offerId = 0; offerId < nextOfferId; offerId++)
		{
			if (offers[offerId].active)
			{
				offersArray[i] = offers[offerId];
				i++;
			}
		}
		return offersArray;
	}
	function getOfferType(uint256 amountAlice, MarsBaseCommon.OfferParams calldata offerParameters) public pure returns (MarsBaseCommon.OfferType)
	{
		if (offerParameters.minimumSize == 0)
		{
			if (offerParameters.deadline > 0
				&& offerParameters.smallestChunkSize > 0
				&& offerParameters.smallestChunkSize != amountAlice)
				return MarsBaseCommon.OfferType.LimitedTimeChunkedPurchase;
			
			if (offerParameters.smallestChunkSize > 0
				&& offerParameters.smallestChunkSize != amountAlice)
				return MarsBaseCommon.OfferType.ChunkedPurchase;
			
			if (offerParameters.deadline > 0)
				return MarsBaseCommon.OfferType.LimitedTime;
			
			return MarsBaseCommon.OfferType.FullPurchase;
		}
		if (offerParameters.deadline > 0 
			&& offerParameters.smallestChunkSize > 0
			&& offerParameters.smallestChunkSize != amountAlice
			&& offerParameters.holdTokens == true)
			return MarsBaseCommon.OfferType.LimitedTimeMinimumChunkedDeadlinePurchase;

		if (offerParameters.deadline > 0 && offerParameters.smallestChunkSize > 0 && offerParameters.smallestChunkSize != amountAlice)
			return MarsBaseCommon.OfferType.LimitedTimeMinimumChunkedPurchase;

		if (offerParameters.smallestChunkSize > 0 && offerParameters.smallestChunkSize != amountAlice)
			return MarsBaseCommon.OfferType.MinimumChunkedPurchase;

		if (offerParameters.deadline > 0)
			return MarsBaseCommon.OfferType.LimitedTimeMinimumPurchase;
		
		return MarsBaseCommon.OfferType.MinimumChunkedPurchase;
	}
	function createOffer(
        address tokenAlice,
        address[] calldata tokenBob,
        uint256 amountAlice,
        uint256[] calldata amountBob,
        MarsBaseCommon.OfferParams calldata offerParameters
    ) unlocked public payable
	{
		// require(!offerParameters.cancelEnabled, "NI - cancelEnabled");
		require(!offerParameters.modifyEnabled, "NI - modifyEnabled");
		// require(!offerParameters.holdTokens, "NI - holdTokens");
		// require(offerParameters.feeAlice == 0, "NI - feeAlice");
		// require(offerParameters.feeBob == 0, "NI - feeBob");
		// require(offerParameters.smallestChunkSize == 0, "NI - smallestChunkSize");
		// require(offerParameters.deadline == 0, "NI - deadline");
		// require(offerParameters.minimumSize == 0, "NI - minimumSize");
		
		require(tokenAlice != address(0), "NI - tokenAlice");
		require(amountAlice > 0, "NI - amountAlice");

		require(tokenBob.length > 0, "NI - tokenBob");
		require(amountBob.length == tokenBob.length, "400-BLMM"); // Bob Length MisMatch
		for (uint256 i = 0; i < tokenBob.length; i++)
		{
			require(tokenBob[i] != address(0), "NI - tokenBob ETH");
		}

		// create offer object
		uint256 offerId = nextOfferId++;
		activeOffersCount++;

		offers[offerId] = MarsBaseCommon.MBOffer(
			true,
			false,
			getOfferType(amountAlice, offerParameters),
			offerId,
			amountAlice,
			offerParameters.feeAlice,
			offerParameters.feeBob,
			offerParameters.smallestChunkSize,
			offerParameters.minimumSize,
			offerParameters.deadline,
			amountAlice,
			msg.sender,
			msg.sender,
			tokenAlice,
			[offerParameters.modifyEnabled, offerParameters.cancelEnabled, offerParameters.holdTokens],
			amountBob,
			new uint256[](0),
			new uint256[](0),
			new address[](0),
			new address[](0),
			tokenBob
		);

		// console.log(amountAlice);

		// take tokens from alice
		require(IERC20(tokenAlice).transferFrom(msg.sender, address(this), amountAlice), "402");

		emit OfferCreated(offerId, msg.sender, block.timestamp, offers[offerId]);
	}
	function sendTokensAfterFeeFrom(
		address token,
		uint256 amount,
		address from,
		address to,
		uint256 feePercent
	) private returns (uint256 /* amountAfterFee */, uint256 /* fee */)
	{
		if (commissionWallet == address(0))
			feePercent = 0;

		(uint256 amountAfterFee, uint256 fee) = afterFee(amount, feePercent);

		// send tokens to receiver
		if (from == address(this))
			require(IERC20(token).transfer(to, amountAfterFee), "403-R1");
		else
			require(IERC20(token).transferFrom(from, to, amountAfterFee), "403-R2");

		if (fee > 0)
		{
			if (commissionWallet != address(0))
			{
				require(commissionExchanger == address(0), "NI - commissionExchanger");
			}

			// send fee to commission wallet
			if (from == address(this))
				require(IERC20(token).transfer(commissionWallet, fee), "403-C1");
			else
				require(IERC20(token).transferFrom(from, commissionWallet, fee), "403-C2");
		}
		return (amountAfterFee, fee);
	}
	function acceptOffer(
        uint256 offerId,
        address tokenBob,
        uint256 amountBob
    ) unlocked public payable
	{
		MarsBaseCommon.MBOffer memory offer = offers[offerId];
		require(offer.active, "404");

		// check that deadline has not passed
		if (offer.deadline > 0)
			require(offer.deadline >= block.timestamp, "405-D"); // deadline has passed

		// check that tokenBob is accepted in the offer
		uint256 offerAmountBob = 0;
		{ // split to block to prevent solidity stack issues
			bool accepted = false;
			for (uint256 i = 0; i < offer.tokenBob.length; i++)
			{
				if (offer.tokenBob[i] == tokenBob)
				{
					accepted = true;
					offerAmountBob = offer.amountBob[i];
					break;
				}
			}
			require(accepted, "404-TBI"); // Token Bob is Incorrect
		}
		
		// calculate how much tokenAlice should be sent
		uint256 amountAlice = price(amountBob, offerAmountBob, offer.amountAlice);

		// check that amountAlice is not too low (if smallestChunkSize is 0 it's also okay)
		require(amountAlice >= min(offer.smallestChunkSize, offer.amountRemaining), "400-AAL");

		// check that amountAlice is not too high
		require(amountAlice <= offer.amountRemaining, "400-AAH"); // Amount Alice is too High
		// we don't throw here so it's possible to "overspend"
		// e.g.:
		// swap 100 $ALICE to 33 $BOB
		// 1 $BOB = 3.333 $ALICE (rounded to 3 due to integer arithmetics)
		// minbid is 11 $BOB
		// Bob buys 33 $ALICE for 11 $BOB (67 $ALICE remaining)
		// Charlie buys 33 $ALICE for 11 $BOB (34 $ALICE remaining)
		// David wants to buy all 34 $ALICE, but:
		// if he tries to send 11 $BOB he will receive only 33 $ALICE
		// if he tries to send 12 $BOB, amountAlice will be 36 $ALICE and tx will revert
		// so we need to let David send a little more $BOB than the limit
		// if (amountAlice > offer.amountRemaining)
		// 	amountAlice = offer.amountRemaining;
		// unfortunately, to prevent front-running we need to make sure
		// that the bidder really expects to get less tokens
		// TODO: we can enable this functionality by providing expected amountAlice into this method (dex-style)


		// update offer
		offers[offerId].amountRemaining -= amountAlice;
		
		offer = offers[offerId];

		// send tokens to participants or schedule for sending later
		bool holdTokens = offer.capabilities[2];
		bool minimumCoveredAfterThis = (offer.amountAlice + amountAlice - offer.amountRemaining) >= offer.minimumSize;

		if (!holdTokens && minimumCoveredAfterThis)
		{
			_swapAllHeldTokens(offers[offerId]);
			_swapInstantTokens(offer, tokenBob, amountBob, amountAlice);
		}
		else
		{
			_scheduleTokenSwap(offer, tokenBob, amountBob, amountAlice, msg.sender);
		}

		if (offers[offerId].amountRemaining == 0)
		{
			_swapAllHeldTokens(offers[offerId]);
			_destroyOffer(offerId, MarsBaseCommon.OfferCloseReason.Success);
		}
	}
	function max(uint256 a, uint256 b) public pure returns (uint256)
	{
		return a >= b ? a : b;
	}
	function min(uint256 a, uint256 b) public pure returns (uint256)
	{
		return a >= b ? b : a;
	}
	function minimumCovered(MarsBaseCommon.MBOffer memory offer) pure public returns (bool result)
	{
		uint256 amountSold = offer.amountAlice - offer.amountRemaining;
		result = amountSold >= offer.minimumSize;
	}
	function cancelOffer(uint256 offerId) unlocked public
	{
		MarsBaseCommon.MBOffer memory offer = offers[offerId];
		require(offer.active, "404");
		require(offer.capabilities[1], "400-CE");
		require(offer.offerer == msg.sender, "403");

		if (minimumCovered(offer))
			_swapAllHeldTokens(offer);

		_destroyOffer(offerId, MarsBaseCommon.OfferCloseReason.CancelledBySeller);
	}
	function _emitOfferAcceptedForScheduledSwap(
		MarsBaseCommon.MBOffer memory offer,
		uint256 i
	) private
	{
		(uint256 aliceSentToBob, uint256 feeAliceDeducted) = afterFee(offer.minimumOrderAmountsAlice[i], offer.feeAlice);
		(uint256 bobSentToAlice, uint256 feeBobDeducted) = afterFee(offer.minimumOrderAmountsBob[i], offer.feeBob);

		// emit event
		emit OfferAccepted(
			// uint256 offerId,
			offer.offerId,
			// address sender,
			offer.minimumOrderAddresses[i],
			// uint256 blockTimestamp,
			block.timestamp,
			// uint256 amountAliceReceived,
			aliceSentToBob,
			// uint256 amountBobReceived,
			bobSentToAlice,
			// address tokenAddressAlice,
			offer.tokenAlice,
			// address tokenAddressBob,
			offer.minimumOrderTokens[i],
			// MarsBaseCommon.OfferType offerType,
			offer.offerType,
			// uint256 feeAlice,
			feeAliceDeducted,
			// uint256 feeBob
			feeBobDeducted
		);
	}
	function _scheduleTokenSwap(
		MarsBaseCommon.MBOffer memory offer,
		address tokenBob,
		uint256 amountBob,
		uint256 amountAlice,
		address bob
	) private
	{
		uint256 index = offers[offer.offerId].minimumOrderAddresses.length;

		IERC20(tokenBob).transferFrom(bob, address(this), amountBob);

		offers[offer.offerId].minimumOrderAmountsAlice.push(amountAlice);
		offers[offer.offerId].minimumOrderAmountsBob.push(amountBob);
		offers[offer.offerId].minimumOrderAddresses.push(bob);
		offers[offer.offerId].minimumOrderTokens.push(tokenBob);

		_emitOfferAcceptedForScheduledSwap(offers[offer.offerId], index);
	}
	function _swapInstantTokens(
		MarsBaseCommon.MBOffer memory offer,
		address tokenBob,
		uint256 amountBob,
		uint256 amountAlice
	) private
	{
		// send Bob tokens to Alice
		(uint256 bobSentToAlice, uint256 feeBobDeducted) = sendTokensAfterFeeFrom(
			// address token,
			tokenBob,
			// uint256 amount,
			amountBob,
			// address from,
			msg.sender,
			// address to,
			offer.offerer,
			// uint256 feePercent
			offer.feeBob
		);
		// send Alice tokens to Bob
		(uint256 aliceSentToBob, uint256 feeAliceDeducted) = sendTokensAfterFeeFrom(
			// address token,
			offer.tokenAlice,
			// uint256 amount,
			amountAlice,
			// address from,
			address(this),
			// address to,
			msg.sender,
			// uint256 feePercent
			offer.feeAlice
		);

		// emit event
		emit OfferAccepted(
			// uint256 offerId,
			offer.offerId,
			// address sender,
			msg.sender,
			// uint256 blockTimestamp,
			block.timestamp,
			// uint256 amountAliceReceived,
			aliceSentToBob,
			// uint256 amountBobReceived,
			bobSentToAlice,
			// address tokenAddressAlice,
			offer.tokenAlice,
			// address tokenAddressBob,
			tokenBob,
			// MarsBaseCommon.OfferType offerType,
			offer.offerType,
			// uint256 feeAlice,
			feeAliceDeducted,
			// uint256 feeBob
			feeBobDeducted
		);
	}
	function _swapAllHeldTokens(MarsBaseCommon.MBOffer memory offer) private
	{
		uint256 offerId = offer.offerId;

		// trade all remaining tokens
		for (uint256 i = 0; i < offer.minimumOrderTokens.length; i++)
		{
			// address tokenBob = offer.minimumOrderTokens[i];
			// uint256 amountBob = offer.minimumOrderAmountsBob[i];
			uint256 amountAlice = offer.minimumOrderAmountsAlice[i];

			require(amountAlice > 0, "500-AAL"); // Amount Alice is too Low

			offer.amountRemaining -= amountAlice;
			require(offer.amountRemaining >= 0, "500-AR"); // Amount Remaining
			
			// just to future-proof double entry protection in case of refactoring
			offers[offerId].minimumOrderAmountsAlice[i] = 0;

			_swapHeldTokens(offer, i);
		}
		// drop used arrays
		offers[offerId].minimumOrderAmountsAlice = new uint256[](0);
		offers[offerId].minimumOrderAmountsBob = new uint256[](0);
		offers[offerId].minimumOrderAddresses = new address[](0);
		offers[offerId].minimumOrderTokens = new address[](0);
	}
	function _swapHeldTokens(MarsBaseCommon.MBOffer memory offer, uint256 i) private
	{
		// send Bob tokens to Alice
		(uint256 bobSentToAlice, uint256 feeBobDeducted) = sendTokensAfterFeeFrom(
			// address token,
			offer.minimumOrderTokens[i],
			// uint256 amount,
			offer.minimumOrderAmountsBob[i],
			// address from,
			address(this),
			// address to,
			offer.offerer,
			// uint256 feePercent
			offer.feeBob
		);
		// send Alice tokens to Bob
		(uint256 aliceSentToBob, uint256 feeAliceDeducted) = sendTokensAfterFeeFrom(
			// address token,
			offer.tokenAlice,
			// uint256 amount,
			offer.minimumOrderAmountsAlice[i],
			// address from,
			address(this),
			// address to,
			offer.minimumOrderAddresses[i],
			// uint256 feePercent
			offer.feeAlice
		);

		// do not emit event (it was emit before)

		// // emit event
		// emit OfferAccepted(
		// 	// uint256 offerId,
		// 	offer.offerId,
		// 	// address sender,
		// 	msg.sender,
		// 	// uint256 blockTimestamp,
		// 	block.timestamp,
		// 	// uint256 amountAliceReceived,
		// 	aliceSentToBob,
		// 	// uint256 amountBobReceived,
		// 	bobSentToAlice,
		// 	// address tokenAddressAlice,
		// 	offer.tokenAlice,
		// 	// address tokenAddressBob,
		// 	offer.minimumOrderTokens[i],
		// 	// MarsBaseCommon.OfferType offerType,
		// 	offer.offerType,
		// 	// uint256 feeAlice,
		// 	feeAliceDeducted,
		// 	// uint256 feeBob
		// 	feeBobDeducted
		// );
	}
	function closeExpiredOffer(uint256 offerId) unlocked public
	{
		MarsBaseCommon.MBOffer memory offer = offers[offerId];
		require(offer.active, "404");

		// require offer to be expired
		require((offer.deadline > 0) && (offer.deadline < block.timestamp), "400-NE"); // Not Expired
		
		// if minimum covered
		// uint256 amountSold = offer.amountAlice - offer.amountRemaining;
		// bool minimumCovered = amountSold >= offer.minimumSize;
		// bool minimumCovered = (offer.amountAlice - offer.amountRemaining) >= offer.minimumSize;
		if ((offer.amountAlice - offer.amountRemaining) < offer.minimumSize)
		{
			_destroyOffer(offerId, MarsBaseCommon.OfferCloseReason.DeadlinePassed);
			return;
		}

		// if any tokens are still held in the offer
		if (offer.minimumOrderTokens.length > 0)
		{
			_swapAllHeldTokens(offer);
		}

		_destroyOffer(offerId, MarsBaseCommon.OfferCloseReason.Success);
	}
	function _destroyOffer(uint256 offerId, MarsBaseCommon.OfferCloseReason reason) private
	{
		MarsBaseCommon.MBOffer memory offer = offers[offerId];

		require(offer.active, "404");

		// require(offer.minimumSize == 0, "NI - offer.minimumSize");

		// is this excessive for double-entry prevention?
		offers[offerId].active = false;

		// send remaining tokens to Alice
		if (offer.amountRemaining > 0)
			IERC20(offer.tokenAlice).transfer(offer.offerer, offer.amountRemaining);

		// if any tokens are still held in the offer
		if (offer.minimumOrderTokens.length > 0)
		{
			// revert all tokens to their owners
			for (uint256 i = 0; i < offer.minimumOrderTokens.length; i++)
			{
				IERC20(offer.minimumOrderTokens[i]).transfer(offer.minimumOrderAddresses[i], offer.minimumOrderAmountsBob[i]);
				IERC20(offer.tokenAlice).transfer(offer.offerer, offer.minimumOrderAmountsAlice[i]);
			}
		}

		delete offers[offerId];
		activeOffersCount--;
		
		emit OfferClosed(
			// uint256 offerId,
			offerId,
			// MarsBaseCommon.OfferCloseReason reason,
			reason,
			// uint256 blockTimestamp
			block.timestamp
		);
	}
	function changeOfferParams(
        uint256 offerId,
        address[] calldata tokenBob,
        uint256[] calldata amountBob,
        MarsBaseCommon.OfferParams calldata offerParameters
    ) unlocked public
	{
		require(false, "NI - changeOfferParams");
	}
	function cancelBid(uint256 offerId) unlocked public
	{
		require(false, "NI - cancelBid");
	}
	function cancelExpiredOffers() public payable
	{
		require(false, "NI - cancelExpiredOffers");
	}
	function migrateContract() onlyOwner public payable
	{
		require(false, "NI - migrateContract");
	}
	function lockContract() onlyOwner public
	{
		require(false, "NI - lockContract");
	}
	function cancelOffers(uint256 from, uint256 to) onlyOwner public payable
	{
		require(false, "NI - cancelOffers");
	}
}
