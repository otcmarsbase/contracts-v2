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
    constructor() {
    }
	
	function setCommissionAddress(address wallet) public
	{
		require(false, "NI");
	}
	function setExchangerAddress(address exchangeContract) public
	{
		require(false, "NI");
	}
	function setMinimumFee(uint256 _minimumFee) public
	{
		require(false, "NI");
	}
	function getMinimumFee() public view returns (uint256)
	{
		require(false, "NI");
		return 0;
	}
	function setNextOfferId(uint256 _nextOfferId) public
	{
		require(false, "NI");
	}
	function getOffer(uint256 offerId) public view returns (MarsBaseCommon.MBOffer memory)
	{
		require(false, "NI");
	}
	function getNextOfferId() public view returns (uint256)
	{
		require(false, "NI");
	}
	function getOwner() public view returns (address)
	{
		require(false, "NI");
	}
	function changeOwner(address newOwner) public
	{
		require(false, "NI");
	}
	function getAllOffers() public view returns (MarsBaseCommon.MBOffer[] memory)
	{
		require(false, "NI");
	}
	function createOffer(
        address tokenAlice,
        address[] calldata tokenBob,
        uint256 amountAlice,
        uint256[] calldata amountBob,
        MarsBaseCommon.OfferParams calldata offerParameters
    ) public payable
	{
		require(false, "NI");
	}
	function cancelOffer(uint256 offerId) public
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
    ) public payable
	{
		require(false, "NI");
	}
	function changeOfferParams(
        uint256 offerId,
        address[] calldata tokenBob,
        uint256[] calldata amountBob,
        MarsBaseCommon.OfferParams calldata offerParameters
    ) public
	{
		require(false, "NI");
	}
	function cancelBid(uint256 offerId) public
	{
		require(false, "NI");
	}
	function cancelExpiredOffers() public payable
	{
		require(false, "NI");
	}
	function migrateContract() public payable
	{
		require(false, "NI");
	}
	function lockContract() public
	{
		require(false, "NI");
	}
	function cancelOffers(uint256 from, uint256 to) public payable
	{
		require(false, "NI");
	}
}
