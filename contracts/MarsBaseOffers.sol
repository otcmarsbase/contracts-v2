// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./MarsBaseCommon.sol";
import "./MarsBase.sol";

contract MarsBaseOffers is MarsBase {

  function acceptOffer(uint256 offerId, address tokenBob, uint256 amountBob, address sender) public returns (uint256) {
    MBOffer memory offer = offers[offerId];

    require(tokenBob != address(0), "T0");
    require(offer.active == true, "S0");
    require(getTime() < offer.deadline || offer.deadline == 0, "M2");

    address acceptedTokenBob = address(0);
    uint256 acceptedAmountBob = 0;
    for (uint256 index = 0; index < offer.tokenBob.length; index++) {
      if (offer.tokenBob[index] == tokenBob && offer.amountBob[index] == amountBob) {
        acceptedTokenBob = offer.tokenBob[index];
        acceptedAmountBob = offer.amountBob[index];
      }
    }

    require(acceptedTokenBob == tokenBob, "T3");
    require(acceptedAmountBob == amountBob, "T4");

    uint256 amountAfterFeeAlice = offer.amountRemaining * (1000-offer.feeAlice) / 1000;
    uint256 amountAfterFeeBob = acceptedAmountBob * (1000-offer.feeBob) / 1000;
    uint256 amountFeeDex = acceptedAmountBob - amountAfterFeeBob;

    require(IERC20(acceptedTokenBob).transferFrom(sender, offer.payoutAddress, amountAfterFeeBob), "T2a");
    require(IERC20(offer.tokenAlice).transfer(sender, amountAfterFeeAlice), "T1b");
    require(IERC20(acceptedTokenBob).transferFrom(sender, commissionWallet, amountFeeDex), "T5");
    
    delete offers[offerId];

    return amountAfterFeeAlice;
  }

  function acceptOfferPart(uint256 offerId, address tokenBob, uint256 amountBob, address sender) public returns (uint256) {
    MBOffer memory offer = offers[offerId];

    require(tokenBob != address(0), "T0");
    require(offer.active == true, "S0");
    require(getTime() < offer.deadline || offer.deadline == 0, "M2");
    require(offer.offerType == OfferType.ChunkedPurchase || 
      offer.offerType == OfferType.LimitedTimeChunkedPurchase || 
      offer.offerType == OfferType.LimitedTimeMinimumChunkedPurchase || 
      offer.offerType == OfferType.MinimumChunkedPurchase, "S5");

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
    uint256 amountFeeDex = partialAmountBob - amountAfterFeeBob;

    require(amountAfterFeeBob >= 0, "M8");
    require(amountFeeDex > 0, "M7");

    require(amountAfterFeeAlice >= offer.smallestChunkSize, "M1");
    require(amountAfterFeeAlice <= offer.amountRemaining, "M10");

    require(IERC20(acceptedTokenBob).transferFrom(sender, offer.payoutAddress, amountAfterFeeBob), "T2a");
    require(IERC20(acceptedTokenBob).transferFrom(sender, commissionWallet, amountFeeDex), "T5");
    require(IERC20(offer.tokenAlice).transfer(sender, amountAfterFeeAlice), "T1b");

    offers[offerId].amountRemaining -= partialAmountAlice;

    if (offers[offerId].amountRemaining == 0) {
      delete offers[offerId];
    }

    return amountAfterFeeAlice;
  }

  function cancelExpiredOffers() public {
    require(msg.sender == dexAddress, "S8");

    for (uint256 index = 0; index < nextOfferId; index++) {
      if (getTime() >= offers[index].deadline && offers[index].deadline != 0) {
          cancelExpiredOffer(index);
      }
    }
  }

  function cancelExpiredOffer(uint256 offerId) private returns (uint256) {
    MBOffer memory offer = offers[offerId];

    if (offer.capabilities[1] == false) {
      return offerId;
    }

    require(offer.capabilities[1] == true, "S1");
    require(offer.active == true, "S0");
    require(offer.amountAlice > 0, "M3");

    require(IERC20(offer.tokenAlice).transfer(offer.offerer, offer.amountRemaining), "T1b");

    delete offers[offerId];

    return offer.offerId;
  }

  function cancelOffer(uint256 offerId, address sender) public returns (uint256) {
    MBOffer memory offer = offers[offerId];

    require(offer.capabilities[1] == true, "S1");
    require(sender == offer.offerer, "S2");
    require(offer.active == true, "S0");
    require(offer.amountAlice > 0, "M3");

    require (contractType(offer.offerType) == ContractType.Offers, "S5");
    require(IERC20(offer.tokenAlice).transfer(offer.offerer, offer.amountRemaining), "T1b");

    delete offers[offerId];

    return offerId;
  }


}