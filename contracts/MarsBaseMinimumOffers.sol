// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./MarsBaseCommon.sol";
import "./MarsBase.sol";

contract MarsBaseMinimumOffers is MarsBaseCommon, MarsBase {

  function acceptOfferPartWithMinimum(uint256 offerId, address tokenBob, uint256 amountBob) public returns (uint256) {
    MBOffer memory offer = offers[offerId];

    require(tokenBob != address(0), "T0");
    require(offer.active == true, "S0");
    require(getTime() < offer.deadline || offer.deadline == 0, "M2");
    require(offer.offerType == OfferType.MinimumChunkedPurchase || 
      offer.offerType == OfferType.LimitedTimeMinimumPurchase || 
      offer.offerType == OfferType.LimitedTimeMinimumChunkedPurchase, "S5");

    address acceptedTokenBob = address(0);
    uint256 acceptedAmountBob = 0;
    for (uint256 index = 0; index < offer.tokenBob.length; index++) {
      if (offer.tokenBob[index] == tokenBob) {
        acceptedTokenBob = offer.tokenBob[index];
        acceptedAmountBob = offer.amountBob[index];
      }
    }

    uint256 partialAmountAlice = price(amountBob, acceptedAmountBob, offer.amountAlice);
    uint256 partialAmountBob = price(partialAmountAlice, offer.amountAlice, acceptedAmountBob);

    uint256 amountAfterFeeAlice = partialAmountAlice * (1000-offer.feeAlice) / 1000;
    uint256 amountAfterFeeBob = partialAmountBob * (1000-offer.feeBob) / 1000;

    require(acceptedTokenBob == tokenBob, "T3");

    require(partialAmountBob >= 0, "M6");

    require(partialAmountAlice >= offer.smallestChunkSize, "M1");
    require(partialAmountAlice <= offer.amountRemaining, "M10");
    
    offers[offerId].amountRemaining -= partialAmountBob;

    uint256 tokensSold = offer.amountAlice - offers[offerId].amountRemaining;

    if (tokensSold >= offer.minimumSize) {
      require(IERC20(acceptedTokenBob).transferFrom(msg.sender, offer.payoutAddress, amountAfterFeeBob), "T2a");
      require(IERC20(offer.tokenAlice).transfer(msg.sender, amountAfterFeeAlice), "T5");
      require(IERC20(acceptedTokenBob).transferFrom(msg.sender, address(this), partialAmountBob - amountAfterFeeBob), "T1a");
      
      uint256 acceptedAmountAfterFeeAlice;
      uint256 acceptedAmountAfterFeeBob;
      for (uint256 index = 0; index < offer.minimumOrderAddresses.length; index++) {
        acceptedAmountAfterFeeAlice = offer.minimumOrderAmountsAlice[index] * (1000-offer.feeAlice) / 1000;
        acceptedAmountAfterFeeBob = offer.minimumOrderAmountsBob[index] * (1000-offer.feeBob) / 1000;
        require(IERC20(offer.minimumOrderTokens[index]).transfer(offer.payoutAddress, acceptedAmountAfterFeeAlice), "T2b");
        require(IERC20(offer.tokenAlice).transfer(offer.minimumOrderAddresses[index], acceptedAmountAfterFeeBob), "T1b");
      }

      delete offers[offerId].minimumOrderAddresses;
      delete offers[offerId].minimumOrderAmountsBob;
      delete offers[offerId].minimumOrderAmountsAlice;
      delete offers[offerId].minimumOrderTokens;

    } else {
      require(IERC20(acceptedTokenBob).transferFrom(msg.sender, address(this), partialAmountBob), "T2a");

      uint256 chunkAlicedex = offer.minimumOrderAddresses.length;

      if (chunkAlicedex > 0) {
        chunkAlicedex -= 1;
      }

      offers[offerId].minimumOrderAddresses.push(msg.sender);
      offers[offerId].minimumOrderAmountsBob.push(partialAmountBob);
      offers[offerId].minimumOrderAmountsAlice.push(partialAmountAlice);
      offers[offerId].minimumOrderTokens.push(acceptedTokenBob);
    }

    if (offers[offerId].amountRemaining == 0) {
      delete offers[offerId];

      emit OfferAccepted(offerId, msg.sender, block.timestamp);
    } else {
      emit OfferPartiallyAccepted(offerId, msg.sender, block.timestamp);
    }

    return offerId;
  }

}
