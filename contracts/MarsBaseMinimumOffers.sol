// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./MarsBaseCommon.sol";
import "./MarsBase.sol";

contract MarsBaseMinimumOffers is MarsBaseCommon, MarsBase {

  function acceptOfferPartWithMinimum(uint256 offerId, address tokenBob, uint256 amountBob, address sender) public returns (uint256) {
    MBOffer memory offer = offers[offerId];

    require(tokenBob != address(0), "T0");
    require(offer.active == true, "S0");
    require(offer.offerType == OfferType.MinimumChunkedPurchase || 
      offer.offerType == OfferType.LimitedTimeMinimumPurchase || 
      offer.offerType == OfferType.LimitedTimeMinimumChunkedPurchase ||
      offer.offerType == OfferType.LimitedTimeMinimumChunkedDeadlinePurchase, "S5");

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

    if ((tokensSold >= offer.minimumSize && offer.capabilities[2] == false) ||
      (tokensSold == offer.amountAlice && offer.capabilities[2] == true) || 
      (tokensSold >= offer.minimumSize && offer.capabilities[2] == true && offer.deadline < getTime())) {
      require(IERC20(acceptedTokenBob).transferFrom(sender, offer.payoutAddress, amountAfterFeeBob), "T2a");
      require(IERC20(offer.tokenAlice).transfer(sender, amountAfterFeeAlice), "T5");
      require(IERC20(acceptedTokenBob).transferFrom(sender, address(this), partialAmountBob - amountAfterFeeBob), "T1a");

      for (uint256 index = 0; index < offer.minimumOrderAddresses.length; index++) {
        require(IERC20(offer.minimumOrderTokens[index]).transfer(offer.payoutAddress, offer.minimumOrderAmountsAlice[index] * (1000-offer.feeAlice) / 1000), "T2b");
        require(IERC20(offer.tokenAlice).transfer(offer.minimumOrderAddresses[index], offer.minimumOrderAmountsBob[index] * (1000-offer.feeBob) / 1000), "T1b");
      }

    } else if (tokensSold < offer.minimumSize && offer.capabilities[2] == true && offer.offerType == OfferType.LimitedTimeMinimumChunkedDeadlinePurchase && offer.deadline < getTime()) {
      cancelExpiredMinimumOffer(offerId);
      return offerId;
    } else {
      require(IERC20(acceptedTokenBob).transferFrom(sender, address(this), partialAmountBob), "T2a");

      uint256 chunkAlicedex = offer.minimumOrderAddresses.length;

      if (chunkAlicedex > 0) {
        chunkAlicedex -= 1;
      }

      offers[offerId].minimumOrderAddresses.push(sender);
      offers[offerId].minimumOrderAmountsBob.push(partialAmountBob);
      offers[offerId].minimumOrderAmountsAlice.push(partialAmountAlice);
      offers[offerId].minimumOrderTokens.push(acceptedTokenBob);
    }

    if (offers[offerId].amountRemaining == 0 || (tokensSold >= offer.minimumSize && offer.capabilities[2] == true && offer.deadline < getTime())) {
      delete offers[offerId];
    }

    return offerId;
  }

  function cancelExpiredMinimumOffer(uint256 offerId) private {
    MBOffer memory offer = offers[offerId];

    require(offer.offerType != OfferType.LimitedTimeMinimumChunkedDeadlinePurchase && offer.deadline < getTime(), "S1");
    require(offer.active == true, "S0");
    require(offer.amountAlice > 0, "M3");
    require (contractType(offer.offerType) == ContractType.MinimumOffers, "S5");

    for (uint256 index = 0; index < offer.minimumOrderAddresses.length; index++) {
      require(offer.minimumOrderTokens[index] != address(0), "T0");
      require(offer.minimumOrderAddresses[index] != address(0), "T0");
      require(offer.minimumOrderAmountsBob[index] != 0, "M4");
      
      require(IERC20(offer.minimumOrderTokens[index]).transfer(offer.minimumOrderAddresses[index], offer.minimumOrderAmountsBob[index]), "T2b");
    }

    require(IERC20(offer.tokenAlice).transfer(offer.offerer, offer.amountAlice), "T1b");

    delete offers[offerId];
  }

  function cancelOffer(uint256 offerId, address sender) public returns (uint256) {
    MBOffer memory offer = offers[offerId];

    require(offer.capabilities[1] == true, "S1");
    require(sender == offer.offerer, "S2");
    require(offer.active == true, "S0");
    require(offer.amountAlice > 0, "M3");

    require (contractType(offer.offerType) == ContractType.MinimumOffers, "S5");
    
    for (uint256 index = 0; index < offer.minimumOrderAddresses.length; index++) {
      require(offer.minimumOrderTokens[index] != address(0), "T0");
      require(offer.minimumOrderAddresses[index] != address(0), "T0");
      require(offer.minimumOrderAmountsBob[index] != 0, "M4");
      
      require(IERC20(offer.minimumOrderTokens[index]).transfer(offer.minimumOrderAddresses[index], offer.minimumOrderAmountsBob[index]), "T2b");
    }

      require(IERC20(offer.tokenAlice).transfer(offer.offerer, offer.amountAlice), "T1b");

    delete offers[offerId];

    return offerId;
  }

}
