// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarsBaseExchange is Ownable {
    uint256 nextOfferId;

    uint256 minimumFee = 10;

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

    event OfferCreated(uint256 offerId, address sender, uint256 blockTimestamp);
    event OfferModified(uint256 offerId, address sender, uint256 blockTimestamp);
    event OfferCancelled(uint256 offerId, address sender, uint256 blockTimestamp);
    event OfferAccepted(uint256 offerId, address sender, uint256 blockTimestamp);
    event OfferPartiallyAccepted(uint256 offerId, address sender, uint256 blockTimestamp);

    // For testing usage
    event Log(uint256 log);

    mapping (uint256 => MBOffer) public offers;

    function getTime() virtual internal view returns (uint256) {
      return block.timestamp;
    }

    function setCurrentTime() public {
      for (uint256 index = 0; index < nextOfferId; index++) {
        if (getTime() >= offers[index].deadline && offers[index].deadline != 0) {
          cancelExpiredOffer(index);
        }
      }
    }

    function setMinimumFee(uint256 _minimumFee) public onlyOwner {
      require(_minimumFee > 0);

      minimumFee = _minimumFee;
    }

    function getOffer(uint256 offerId) public view returns (MBOffer memory) {
      return offers[offerId];
    }

    function getAllOffers() public view returns (MBOffer[] memory) {
      MBOffer[] memory openOffers = new MBOffer[](nextOfferId);
      uint256 counter = 0;

      for (uint256 index = 0; index < nextOfferId; index++) {
        if (offers[index].active == true) {
          openOffers[counter] = offers[index];
          counter++;
        }
      }

      return openOffers;
    }


    function getOpenOffersForAddress(address offerer) public view returns (MBOffer[] memory) {
      MBOffer[] memory openOffers = new MBOffer[](nextOfferId);
      uint256 counter = 0;

      for (uint256 index = 0; index < nextOfferId; index++) {
        if (offers[index].active == true && offers[index].offerer == offerer) {
          openOffers[counter] = offers[index];
          counter++;
        }
      }

      return openOffers;
    }

    function price(uint256 amountAlice, uint256 offerAmountAlice, uint256 offerAmountBob) public pure returns (uint256) {
      uint256 numerator = amountAlice * offerAmountBob;
      uint256 denominator = offerAmountAlice;
      uint256 finalPrice = numerator / denominator;
      return finalPrice;
    }

    function createOffer(address tokenAlice, address[] calldata tokenBob, uint256 amountAlice, uint256[] calldata amountBob, uint256[] calldata fees, uint256[] calldata offerParameters) public returns (uint256) {
      uint256 feeAlice = fees[0];
      uint256 feeBob = fees[1];
      
      require(tokenAlice != address(0), "T0");
      for (uint256 index = 0; index < tokenBob.length; index++) {
        require(tokenBob[index] != address(0), "T0");
      }

      require(feeAlice + feeBob >= minimumFee, "M0");
      
      MBOffer memory offer = initOffer(tokenAlice, tokenBob, amountAlice, amountBob, fees);
      offer = setOfferProperties(offer, offerParameters);

      uint256 offerId = nextOfferId;
      offers[offerId] = offer;

      require(IERC20(offer.tokenAlice).transferFrom(msg.sender, address(this), amountAlice), "T1a");

      nextOfferId ++;

      emit OfferCreated(offerId, msg.sender, block.timestamp);

      return offerId;
    }

    function setOfferProperties (MBOffer memory offer, uint256[] calldata offerParameters) private view returns (MBOffer memory) {
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

    function initOffer(address tokenAlice, address[] calldata tokenBob, uint256 amountAlice, uint256[] calldata amountBob, uint256[] calldata fees) private view returns (MBOffer memory) {
      
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

    function changeOfferPrice(uint256 offerId, address[] calldata tokenBob, uint256[] calldata amountBob) public returns (uint256) {
      require(tokenBob.length == amountBob.length, "M5");

      for (uint256 index = 0; index < tokenBob.length; index++) {
        require(tokenBob[index] != address(0), "T0");
        require(amountBob[index] > 0, "M6");
      }

      require(offerId <= nextOfferId, "S3");

      MBOffer memory offer = offers[offerId];
      require(offer.capabilities[0] == true, "S4");

      require(offer.offerer == msg.sender, "S2");

      offer.tokenBob = tokenBob;
      offer.amountBob = amountBob;

      offers[offerId] = offer;

      emit OfferModified(offerId, msg.sender, block.timestamp);

      return offerId;

    }

    function changeOfferPricePart(uint256 offerId, address[] calldata tokenBob, uint256[] calldata amountBob, uint256 smallestChunkSize) public returns (uint256) {
      require(tokenBob.length == amountBob.length, "M5");

      for (uint256 index = 0; index < tokenBob.length; index++) {
        require(tokenBob[index] != address(0), "T0");
        require(amountBob[index] > 0, "M6");
      }

      require(offerId <= nextOfferId, "S3");

      MBOffer memory offer = offers[offerId];

      require(offer.capabilities[0] == true, "S4");

      require(offer.offerer == msg.sender, "S2");
      require(smallestChunkSize <= offer.amountAlice, "M1");

      offer.tokenBob = tokenBob;
      offer.amountBob = amountBob;
      offer.smallestChunkSize = smallestChunkSize;

      offers[offerId] = offer;

      emit OfferModified(offerId, msg.sender, block.timestamp);

      return offerId;
    }

    function acceptOffer(uint256 offerId, address tokenBob, uint256 amountBob) public returns (uint256) {
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
      require(amountFeeDex > 0, "M7");

      require(IERC20(acceptedTokenBob).transferFrom(msg.sender, offer.payoutAddress, amountAfterFeeBob), "T2a");
      require(IERC20(offer.tokenAlice).transfer(msg.sender, amountAfterFeeAlice), "T1b");
      require(IERC20(acceptedTokenBob).transferFrom(msg.sender, address(this), amountFeeDex), "T5");
      
      delete offers[offerId];

      emit OfferAccepted(offerId, msg.sender, block.timestamp);

      return offerId;
    }

    function acceptOfferPart(uint256 offerId, address tokenBob, uint256 amountBob) public returns (uint256) {
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

      require(IERC20(acceptedTokenBob).transferFrom(msg.sender, offer.payoutAddress, amountAfterFeeBob), "T2a");
      require(IERC20(acceptedTokenBob).transferFrom(msg.sender, address(this), amountFeeDex), "T5");
      require(IERC20(offer.tokenAlice).transfer(msg.sender, amountAfterFeeAlice), "T1b");

      offers[offerId].amountRemaining -= partialAmountAlice;

      if (offers[offerId].amountRemaining == 0) {
        delete offers[offerId];

        emit OfferAccepted(offerId, msg.sender, block.timestamp);
      } else {
        emit OfferPartiallyAccepted(offerId, msg.sender, block.timestamp);
      }

      return offerId;
    }

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
