// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./MarsBaseCommon.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MarsBase is MarsBaseCommon {

  uint256 nextOfferId;

  uint256 minimumFee = 10;

  mapping (uint256 => MBOffer) public offers;

  function createOffer(address tokenAlice, address[] calldata tokenBob, uint256 amountAlice, uint256[] calldata amountBob, uint256[] calldata fees, uint256[] calldata offerParameters) public returns (uint256) {
    uint256 feeAlice = fees[0];
    uint256 feeBob = fees[1];
    
    require(tokenAlice != address(0), "T0");
    for (uint256 index = 0; index < tokenBob.length; index++) {
      require(tokenBob[index] != address(0), "T0");
    }

    require(feeAlice + feeBob >= minimumFee, "M0");
    
    MBOffer memory offer = initOffer(nextOfferId, tokenAlice, tokenBob, amountAlice, amountBob, fees);
    offer = setOfferProperties(offer, offerParameters);

    uint256 offerId = nextOfferId;
    offers[offerId] = offer;

    require(IERC20(offer.tokenAlice).transferFrom(msg.sender, address(this), amountAlice), "T1a");

    nextOfferId ++;

    emit OfferCreated(offerId, msg.sender, block.timestamp);

    return offerId;
  }

  function cancelExpiredOffer(uint256 offerId) private returns (uint256) {
    MBOffer memory offer = offers[offerId];

    if (offer.capabilities[1] == false) {
      return offerId;
    }

    require(offer.active == true, "S0");
    require(offer.amountAlice > 0, "M3");

    if (offer.offerType == OfferType.MinimumChunkedPurchase || 
      offer.offerType == OfferType.LimitedTimeMinimumPurchase || 
      offer.offerType == OfferType.LimitedTimeMinimumChunkedPurchase) 
    {
      for (uint256 index = 0; index < offer.minimumOrderAddresses.length; index++) {
        require(offer.minimumOrderTokens[index] != address(0), "T0");
        require(offer.minimumOrderAddresses[index] != address(0), "T0");
        require(offer.minimumOrderAmountsBob[index] != 0, "M4");
        
        require(IERC20(offer.minimumOrderTokens[index]).transfer(offer.minimumOrderAddresses[index], offer.minimumOrderAmountsBob[index]), "T2b");
      }

      require(IERC20(offer.tokenAlice).transfer(offer.offerer, offer.amountAlice), "T1b");
    } else {
      require(IERC20(offer.tokenAlice).transfer(offer.offerer, offer.amountRemaining), "T1b");
    }

    delete offers[offerId];

    emit OfferCancelled(offerId, msg.sender, block.timestamp);

    return offerId;
  }

  function cancelOffer(uint256 offerId) public returns (uint256) {
    MBOffer memory offer = offers[offerId];

    require(offer.capabilities[1] == true, "S1");
    require(msg.sender == offer.offerer, "S2");
    require(offer.active == true, "S0");
    require(offer.amountAlice > 0, "M3");

    require(offer.offerType != OfferType.MinimumChunkedPurchase || 
      offer.offerType == OfferType.LimitedTimeMinimumPurchase || 
      offer.offerType == OfferType.LimitedTimeMinimumChunkedPurchase, "S5");

    require(IERC20(offer.tokenAlice).transfer(offer.offerer, offer.amountRemaining), "T1b");

    return offer.offerId;
  }

  function changeOfferPrice(uint256 offerId, address[] calldata tokenBob, uint256[] calldata amountBob) public view returns (MBOffer memory) {
    MBOffer memory offer = offers[offerId];

    require(tokenBob.length == amountBob.length, "M5");

    for (uint256 index = 0; index < tokenBob.length; index++) {
      require(tokenBob[index] != address(0), "T0");
      require(amountBob[index] > 0, "M6");
    }

    require(offer.capabilities[0] == true, "S4");

    require(offer.offerer == msg.sender, "S2");

    offer.tokenBob = tokenBob;
    offer.amountBob = amountBob;

    return offer;

  }

  function changeOfferPricePart(MBOffer calldata _offer, address[] calldata tokenBob, uint256[] calldata amountBob, uint256 smallestChunkSize) public view returns (MBOffer memory) {
    require(tokenBob.length == amountBob.length, "M5");

    for (uint256 index = 0; index < tokenBob.length; index++) {
      require(tokenBob[index] != address(0), "T0");
      require(amountBob[index] > 0, "M6");
    }

    MBOffer memory offer = _offer;

    require(offer.capabilities[0] == true, "S4");

    require(offer.offerer == msg.sender, "S2");
    require(smallestChunkSize <= offer.amountAlice, "M1");

    offer.tokenBob = tokenBob;
    offer.amountBob = amountBob;
    offer.smallestChunkSize = smallestChunkSize;

    return offer;
  }

}
