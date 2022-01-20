// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MarsBaseCommon {

  event OfferCreated(uint256 offerId, address sender, uint256 blockTimestamp);
  event OfferModified(uint256 offerId, address sender, uint256 blockTimestamp);
  event OfferCancelled(uint256 offerId, address sender, uint256 blockTimestamp);
  event OfferAccepted(uint256 offerId, address sender, uint256 blockTimestamp);

  // For testing usage
  event Log(uint256 log);

  // OfferType as int
  /*
    Full Purchase - 0
    Limited Time / Deadline - 1
    Chunked Purchase - 2
    Chunked Purchse with Minimum - 3
    Limited Time / Deadline with Minimum - 4
    Limited Time / Deaadline and Chunked - 5
    Limited Time / Deadline, Chunked with Minimum - 6
    Limited Time / Deadline, Chunked with Minimum with delyed distribution - 7
    */

  enum OfferType {
    FullPurchase,
    LimitedTime,
    ChunkedPurchase,
    MinimumChunkedPurchase,
    LimitedTimeMinimumPurchase,
    LimitedTimeChunkedPurchase,
    LimitedTimeMinimumChunkedPurchase,
    LimitedTimeMinimumChunkedDeadlinePurchase
  }

  enum ContractType {
    Offers,
    MinimumOffers
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

  function contractType(OfferType offerType) public pure returns (ContractType) {
    if (offerType == OfferType.FullPurchase || offerType == OfferType.ChunkedPurchase || offerType == OfferType.LimitedTime || offerType == OfferType.LimitedTimeChunkedPurchase) {
      return ContractType.Offers;
    } else {
      return ContractType.MinimumOffers;
    }
  }


  function price(uint256 amountAlice, uint256 offerAmountAlice, uint256 offerAmountBob) public pure returns (uint256) {
    uint256 numerator = amountAlice * offerAmountBob;
    uint256 denominator = offerAmountAlice;
    uint256 finalPrice = numerator / denominator;
    return finalPrice;
  }

  function setOfferProperties (MBOffer memory offer, uint256[] calldata offerParameters) public view returns (MBOffer memory) {
    require(offer.amountAlice >= offerParameters[2], "M1");
    require(getTime() < offerParameters[3] || offerParameters[3] == 0, "M2");

    offer.offerType = getOfferType(offer.amountAlice, offerParameters);

    offer.smallestChunkSize = offerParameters[0];

    if (offerParameters[4] == 1) {
      offer.capabilities[0] = true;
    }

    if (offerParameters[5] == 1) {
      offer.capabilities[1] = true;
    }

    if (offerParameters[7] == 1) {
      offer.capabilities[2] = true;
    }

    if (offerParameters.length == 8) {
      offer.minimumSize = offerParameters[6];
    } else {
      offer.minimumSize = 0;
    }

    offer.deadline = offerParameters[3];

    return offer;
  }

  function getOfferType (uint256 amountAlice, uint256[] calldata offerParameters) public pure returns (OfferType) {
    OfferType offerType;

    if (offerParameters.length == 7) {
      if (offerParameters[3] > 0 && offerParameters[3] > 0 && offerParameters[3] != amountAlice) {
        offerType = OfferType.LimitedTimeChunkedPurchase;
      } else if (offerParameters[2] > 0 && offerParameters[2] != amountAlice) {
        offerType = OfferType.ChunkedPurchase;
      } else if (offerParameters[3] > 0) {
        offerType = OfferType.LimitedTime;
      } else {
        offerType = OfferType.FullPurchase;
      }
    } else if (offerParameters.length == 8) {
      if (offerParameters[2] > 0 && offerParameters[3] > 0 && offerParameters[2] != amountAlice && offerParameters[7] == 1) {
        offerType = OfferType.LimitedTimeMinimumChunkedDeadlinePurchase;
      } else if (offerParameters[2] > 0 && offerParameters[3] > 0 && offerParameters[2] != amountAlice) {
        offerType = OfferType.LimitedTimeMinimumChunkedPurchase;
      } else if (offerParameters[2] > 0 && offerParameters[2] != amountAlice) {
        offerType = OfferType.MinimumChunkedPurchase;
      } else if (offerParameters[3] > 0) {
        offerType = OfferType.LimitedTimeMinimumPurchase;
      } else {
        offerType = OfferType.MinimumChunkedPurchase;
      }
    }

    return offerType;
  }

  function initOffer(uint256 nextOfferId, address tokenAlice, address[] calldata tokenBob, uint256 amountAlice, uint256[] calldata amountBob, uint256[] calldata offerParameters) public pure returns (MBOffer memory) {
    
    MBOffer memory offer;

    offer.offerId = nextOfferId;

    offer.tokenAlice = tokenAlice;
    offer.tokenBob = tokenBob;

    offer.amountAlice = amountAlice;
    offer.amountBob = amountBob;

    offer.feeAlice = offerParameters[0];
    offer.feeBob = offerParameters[1];

    offer.amountRemaining = amountAlice;

    offer.minimumOrderTokens = new address[](0);
    offer.minimumOrderAddresses = new address[](0);
    offer.minimumOrderAmountsAlice = new uint256[](0);
    offer.minimumOrderAmountsBob = new uint256[](0);

    offer.capabilities = new bool[](3);

    offer.active = true;

    return offer;
  }
}
