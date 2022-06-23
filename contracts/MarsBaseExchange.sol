// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./MarsBase.sol";
import "./MarsBaseCommon.sol";
import "./IMarsbaseExchange.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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
		require(!offerParameters.cancelEnabled, "NI - cancelEnabled");
		require(!offerParameters.modifyEnabled, "NI - modifyEnabled");
		require(!offerParameters.holdTokens, "NI - holdTokens");
		require(offerParameters.feeAlice == 0, "NI - feeAlice");
		require(offerParameters.feeBob == 0, "NI - feeBob");
		require(offerParameters.smallestChunkSize == 0, "NI - smallestChunkSize");
		require(offerParameters.deadline == 0, "NI - deadline");
		require(offerParameters.minimumSize == 0, "NI - minimumSize");
		
		require(tokenAlice != address(0), "NI - tokenAlice");
		require(amountAlice > 0, "NI - amountAlice");

		require(tokenBob.length > 0, "NI - tokenBob");
		require(amountBob.length == tokenBob.length, "NI - amountBob");

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
	}
	function cancelOffer(uint256 offerId) unlocked public
	{
		require(false, "NI");
	}
	function price(
        uint256 amountAlice,
        uint256 offerAmountAlice,
        uint256 offerAmountBob
    ) public pure returns (uint256)
	{
		require(false, "NI");
		return 0;
	}
	function acceptOffer(
        uint256 offerId,
        address tokenBob,
        uint256 amountBob
    ) unlocked public payable
	{
		require(false, "NI");
	}
	function changeOfferParams(
        uint256 offerId,
        address[] calldata tokenBob,
        uint256[] calldata amountBob,
        MarsBaseCommon.OfferParams calldata offerParameters
    ) unlocked public
	{
		require(false, "NI");
	}
	function cancelBid(uint256 offerId) unlocked public
	{
		require(false, "NI");
	}
	function cancelExpiredOffers() public payable
	{
		require(false, "NI");
	}
	function migrateContract() onlyOwner public payable
	{
		require(false, "NI");
	}
	function lockContract() onlyOwner public
	{
		require(false, "NI");
	}
	function cancelOffers(uint256 from, uint256 to) onlyOwner public payable
	{
		require(false, "NI");
	}
}
