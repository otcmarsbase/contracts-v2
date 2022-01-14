// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MarsBaseCommon {

  event OfferCreated(uint256 offerId, address sender, uint256 blockTimestamp);
  event OfferModified(uint256 offerId, address sender, uint256 blockTimestamp);
  event OfferCancelled(uint256 offerId, address sender, uint256 blockTimestamp);
  event OfferAccepted(uint256 offerId, address sender, uint256 blockTimestamp);
  event OfferPartiallyAccepted(uint256 offerId, address sender, uint256 blockTimestamp);

  // For testing usage
  event Log(uint256 log);

  enum OfferType {
    FullPurchase,
    LimitedTime,
    ChunkedPurchase,
    MinimumChunkedPurchase,
    LimitedTimeMinimumPurchase,
    LimitedTimeChunkedPurchase,
    LimitedTimeMinimumChunkedPurchase
  }

  struct MBOffer {
    bool active;
    OfferType offerType;
    uint256 offerId;
    uint256 amountAlice;
    uint256 feeAlice;
    uint256 feeBob;
    uint256 smallestChunkSize;
    uint256 minimumSize;
    uint256 deadline;
    uint256 amountRemaining;
    address offerer;
    address payoutAddress;
    address tokenAlice;
    bool[] capabilities;
    uint256[] amountBob;
    uint256[] minimumOrderAmountsAlice;
    uint256[] minimumOrderAmountsBob;
    address[] minimumOrderAddresses;
    address[] minimumOrderTokens;
    address[] tokenBob;
  }

  function getTime() virtual internal view returns (uint256) {
    return block.timestamp;
  }


  function price(uint256 amountAlice, uint256 offerAmountAlice, uint256 offerAmountBob) public pure returns (uint256) {
    uint256 numerator = amountAlice * offerAmountBob;
    uint256 denominator = offerAmountAlice;
    uint256 finalPrice = numerator / denominator;
    return finalPrice;
  }

  function setOfferProperties (MBOffer memory offer, uint256[] calldata offerParameters) public view returns (MBOffer memory) {
    require(offer.amountAlice >= offerParameters[0], "M1");
    require(getTime() < offerParameters[1] || offerParameters[1] == 0, "M2");

    offer.offerType = getOfferType(offer.amountAlice, offerParameters);

    offer.smallestChunkSize = offerParameters[0];

    if (offerParameters[2] == 1) {
      offer.capabilities[0] = true;
    }

    if (offerParameters[3] == 1) {
      offer.capabilities[1] = true;
    }

    if (offerParameters.length == 5) {
      offer.minimumSize = offerParameters[4];
    } else {
      offer.minimumSize = 0;
    }

    offer.deadline = offerParameters[1];

    return offer;
  }

  function getOfferType (uint256 amountAlice, uint256[] calldata offerParameters) private pure returns (OfferType) {
    OfferType offerType;

    if (offerParameters.length == 4) {
      if (offerParameters[1] > 0 && offerParameters[1] > 0 && offerParameters[1] != amountAlice) {
        offerType = OfferType.LimitedTimeChunkedPurchase;
      } else if (offerParameters[0] > 0 && offerParameters[0] != amountAlice) {
        offerType = OfferType.ChunkedPurchase;
      } else if (offerParameters[1] > 0) {
        offerType = OfferType.LimitedTime;
      } else {
        offerType = OfferType.FullPurchase;
      }
    } else if (offerParameters.length == 5) {
      if (offerParameters[0] > 0 && offerParameters[1] > 0 && offerParameters[0] != amountAlice) {
        offerType = OfferType.LimitedTimeMinimumChunkedPurchase;
      } else if (offerParameters[0] > 0 && offerParameters[0] != amountAlice) {
        offerType = OfferType.MinimumChunkedPurchase;
      } else if (offerParameters[1] > 0) {
        offerType = OfferType.LimitedTimeMinimumPurchase;
      } else {
        offerType = OfferType.MinimumChunkedPurchase;
      }
    }

    return offerType;
  }

  function initOffer(uint256 nextOfferId, address tokenAlice, address[] calldata tokenBob, uint256 amountAlice, uint256[] calldata amountBob, uint256[] calldata fees) public view returns (MBOffer memory) {
    
    MBOffer memory offer;

    offer.offerId = nextOfferId;

    offer.tokenAlice = tokenAlice;
    offer.tokenBob = tokenBob;

    offer.amountAlice = amountAlice;
    offer.amountBob = amountBob;

    offer.feeAlice = fees[0];
    offer.feeBob = fees[1];

    offer.amountRemaining = amountAlice;

    offer.minimumOrderTokens = new address[](0);
    offer.minimumOrderAddresses = new address[](0);
    offer.minimumOrderAmountsAlice = new uint256[](0);
    offer.minimumOrderAmountsBob = new uint256[](0);
    
    offer.offerer = msg.sender;
    offer.payoutAddress = msg.sender;
    offer.capabilities = new bool[](2);

    offer.active = true;

    return offer;
  }
}
