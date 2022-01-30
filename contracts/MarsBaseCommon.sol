// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

abstract contract MarsBaseCommon {

  event OfferCreated(uint256 offerId, address sender, uint256 blockTimestamp, MBOffer offer);
  event OfferModified(uint256 offerId, address sender, uint256 blockTimestamp, OfferParams offerParameters);
  event OfferCancelled(uint256 offerId, address sender, uint256 blockTimestamp);
  event OfferAccepted(uint256 offerId, address sender, uint256 blockTimestamp, uint256 amountAlice, uint256 amountBob, address tokenAddress);

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

  struct OfferParams {
    bool cancelEnabled;
    bool modifyEnabled;
    bool holdTokens;
    uint256 feeAlice;
    uint256 feeBob;
    uint256 smallestChunkSize;
    uint256 deadline;
    uint256 minimumSize;
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

  function setOfferProperties (MBOffer memory offer, OfferParams calldata offerParams) public view returns (MBOffer memory) {
    require(offer.amountAlice >= offerParams.smallestChunkSize, "M1");
    require(getTime() < offerParams.deadline || offerParams.deadline == 0, "M2");

    offer.offerType = getOfferType(offer.amountAlice, offerParams);

    offer.smallestChunkSize = offerParams.smallestChunkSize;

    if (offerParams.cancelEnabled == true) {
      offer.capabilities[1] = true;
    }

    if (offerParams.modifyEnabled == true) {
      offer.capabilities[0] = true;
    }

    if (offerParams.minimumSize != 0) {
      offer.minimumSize = offerParams.minimumSize;

      if (offerParams.minimumSize != 0 && offerParams.holdTokens == true) {
        offer.capabilities[2] = true;
      }

    } else {
      offer.minimumSize = 0;
    }

    offer.deadline = offerParams.deadline;

    return offer;
  }

  function getOfferType (uint256 amountAlice, OfferParams calldata offerParameters) public pure returns (OfferType) {
    OfferType offerType = OfferType.FullPurchase;

    if (offerParameters.minimumSize == 0) {
      if (offerParameters.deadline > 0 && offerParameters.smallestChunkSize > 0 && offerParameters.smallestChunkSize != amountAlice) {
        offerType = OfferType.LimitedTimeChunkedPurchase;
      } else if (offerParameters.smallestChunkSize > 0 && offerParameters.smallestChunkSize != amountAlice) {
        offerType = OfferType.ChunkedPurchase;
      } else if (offerParameters.deadline > 0) {
        offerType = OfferType.LimitedTime;
      } else {
        offerType = OfferType.FullPurchase;
      }
    } else {
      if (offerParameters.deadline > 0 && offerParameters.smallestChunkSize > 0 && offerParameters.smallestChunkSize != amountAlice && offerParameters.holdTokens == true) {
        offerType = OfferType.LimitedTimeMinimumChunkedDeadlinePurchase;
      } else if (offerParameters.deadline > 0 && offerParameters.smallestChunkSize > 0 && offerParameters.smallestChunkSize != amountAlice) {
        offerType = OfferType.LimitedTimeMinimumChunkedPurchase;
      } else if (offerParameters.smallestChunkSize > 0 && offerParameters.smallestChunkSize != amountAlice) {
        offerType = OfferType.MinimumChunkedPurchase;
      } else if (offerParameters.deadline > 0) {
        offerType = OfferType.LimitedTimeMinimumPurchase;
      } else {
        offerType = OfferType.MinimumChunkedPurchase;
      }
    }

    return offerType;
  }

  function initOffer(uint256 nextOfferId, address tokenAlice, address[] calldata tokenBob, uint256 amountAlice, uint256[] calldata amountBob, OfferParams calldata offerParameters) public pure returns (MBOffer memory) {
    
    MBOffer memory offer;

    offer.offerId = nextOfferId;

    offer.tokenAlice = tokenAlice;
    offer.tokenBob = tokenBob;

    offer.amountAlice = amountAlice;
    offer.amountBob = amountBob;

    offer.feeAlice = offerParameters.feeAlice;
    offer.feeBob = offerParameters.feeBob;

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
