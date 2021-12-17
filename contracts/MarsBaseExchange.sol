// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarsBaseExchange is Ownable {

    using SafeMath for uint256;

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
      OfferType offerType;
      IERC20 tokenAlice;
      address[] tokenBob;
      uint256 amountAlice;
      uint256[] amountBob;
      uint256 feeAlice;
      uint256 feeBob;
      uint256 smallestChunkSize;
      uint256 amountRemaining;
      uint256 minimumSize;
      uint256[] minimumOrderAmountsAlice;
      uint256[] minimumOrderAmountsBob;
      address[] minimumOrderAddresses;
      address[] minimumOrderTokens;
      uint256 deadline;
      address offerer;
      address payoutAddress;
      bool active;
    }

    event OfferCreated(uint256 offerId, MBOffer offer);
    event OfferCancelled(uint256 offerId, MBOffer offer);
    event OfferAccepted(uint256 offerId, MBOffer offer);
    event OfferPartiallyAccepted(uint256 offerId, MBOffer offer);

    mapping (uint256 => MBOffer) public offers;

    function getTime() virtual internal view returns (uint256) {
        // current block timestamp as seconds since unix epoch
        // ref: https://solidity.readthedocs.io/en/v0.5.7/units-and-global-variables.html#block-and-transaction-properties
        return block.timestamp;
    }

    function setCurrentTime() public onlyOwner {
      for (uint256 index = 0; index < nextOfferId; index++) {
        if (getTime() >= offers[index].deadline && offers[index].deadline != 0) {
          cancelOffer(index);

          assert(offers[index].active == false);
        }
      }
    }

    function setMinimumFee(uint256 _minimumFee) public onlyOwner {
      assert(_minimumFee > 0);

      minimumFee = _minimumFee;
    }

    function getOffer(uint256 offerId) public view returns (MBOffer memory) {
      return offers[offerId];
    }

    function price(uint256 amountAlice, uint256 offerAmountAlice, uint256 offerAmountBob) public pure returns (uint256) {
      uint256 numerator = amountAlice.mul(offerAmountBob);
      uint256 denominator = offerAmountAlice;
      return numerator / denominator;
    }

    function createOffer(address tokenAlice, address[] calldata tokenBob, uint256 amountAlice, uint256[] calldata amountBob, uint256[] calldata fees, uint256[] calldata offerParameters) public payable returns (uint256) {
      uint256 feeAlice = fees[0];
      uint256 feeBob = fees[1];
      
      assert(tokenAlice != address(0));
      for (uint256 index = 0; index < tokenBob.length; index++) {
        assert(tokenBob[index] != address(0));
      }

      assert(amountAlice >= offerParameters[0]);
      assert(getTime() < offerParameters[1] || offerParameters[1] == 0);

      assert(feeAlice + feeBob >= minimumFee);
      
      MBOffer memory offer = initOffer(tokenAlice, tokenBob, amountAlice, amountBob, fees, offerParameters);

      uint256 offerId = nextOfferId;
      offers[offerId] = offer;

      require(offer.tokenAlice.transferFrom(msg.sender, address(this), amountAlice));

      nextOfferId ++;

      emit OfferCreated(offerId, offer);

      return offerId;
    }

    function initOffer(address tokenAlice, address[] calldata tokenBob, uint256 amountAlice, uint256[] calldata amountBob, uint256[] calldata fees, uint256[] calldata offerParameters) private view returns (MBOffer memory) {
      OfferType offerType;

      if (offerParameters.length == 2) {
        if (offerParameters[1] > 0 && offerParameters[1] > 0 && offerParameters[1] != amountAlice) {
          offerType = OfferType.LimitedTimeChunkedPurchase;
        } else if (offerParameters[0] > 0 && offerParameters[0] != amountAlice) {
          offerType = OfferType.ChunkedPurchase;
        } else if (offerParameters[1] > 0) {
          offerType = OfferType.LimitedTime;
        } else {
          offerType = OfferType.FullPurchase;
        }
      } else if (offerParameters.length == 3) {
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

      
      MBOffer memory offer;

      offer.offerType = offerType;

      offer.tokenAlice = IERC20(tokenAlice);
      offer.tokenBob = tokenBob;

      offer.amountAlice = amountAlice;
      offer.amountBob = amountBob;

      offer.feeAlice = fees[0];
      offer.feeBob = fees[1];

      offer.amountRemaining = amountAlice;
      offer.smallestChunkSize = offerParameters[0];

      if (offerParameters.length == 3) {
        offer.minimumSize = offerParameters[2];
      } else {
        offer.minimumSize = 0;
      }

      offer.minimumOrderTokens = new address[](0);
      offer.minimumOrderAddresses = new address[](0);
      offer.minimumOrderAmountsAlice = new uint256[](0);
      offer.minimumOrderAmountsBob = new uint256[](0);
      
      offer.offerer = msg.sender;
      offer.payoutAddress = msg.sender;

      offer.deadline = offerParameters[1];
      offer.active = true;

      return offer;
    }

    function cancelOffer(uint256 offerId) public payable returns (uint256) {
      MBOffer storage offer = offers[offerId];

      assert(msg.sender == offer.offerer);
      assert(offer.active == true);
      assert(offer.amountAlice > 0);

      require(offer.tokenAlice.transfer(offer.offerer, offer.amountRemaining));

      delete offers[offerId];

      assert(offers[offerId].active == false);
      assert(offers[offerId].amountAlice == 0);
      assert(offers[offerId].offerer == address(0));

      emit OfferCancelled(offerId, offer);

      return offerId;
    }

    function acceptOffer(uint256 offerId, address tokenBob, uint256 amountAlice, uint256 amountBob) public payable returns (uint256) {
      MBOffer storage offer = offers[offerId];

      assert(tokenBob != address(0));
      assert(offer.active == true);
      assert(offer.amountAlice == amountAlice);
      assert(getTime() < offer.deadline || offer.deadline == 0);

      address acceptedTokenBob = address(0);
      uint256 acceptedAmountBob = 0;
      for (uint256 index = 0; index < offer.tokenBob.length; index++) {
        if (offer.tokenBob[index] == tokenBob && offer.amountBob[index] == amountBob) {
          acceptedTokenBob = offer.tokenBob[index];
          acceptedAmountBob = offer.amountBob[index];
        }
      }

      assert(acceptedTokenBob == tokenBob);
      assert(acceptedAmountBob == amountBob);

      require(IERC20(acceptedTokenBob).transferFrom(msg.sender, offer.payoutAddress, acceptedAmountBob));
      require(offer.tokenAlice.transfer(msg.sender, offer.amountRemaining));

      delete offers[offerId];

      assert(offers[offerId].active == false);
      assert(offers[offerId].amountAlice == 0);
      assert(offers[offerId].offerer == address(0));

      emit OfferAccepted(offerId, offer);

      return offerId;
    }

    function acceptOfferPart(uint256 offerId, address tokenBob, uint256 amountBob) public payable returns (uint256) {
      MBOffer storage offer = offers[offerId];

      assert(tokenBob != address(0));
      assert(offer.active == true);
      assert(getTime() < offer.deadline || offer.deadline == 0);
      assert(offer.offerType == OfferType.ChunkedPurchase || 
        offer.offerType == OfferType.LimitedTimeChunkedPurchase || 
        offer.offerType == OfferType.LimitedTimeMinimumChunkedPurchase || 
        offer.offerType == OfferType.MinimumChunkedPurchase);

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

      assert(acceptedTokenBob == tokenBob);

      assert(partialAmountBob >= 0);

      assert(partialAmountAlice >= offer.smallestChunkSize);
      assert(partialAmountAlice <= offer.amountRemaining);

      require(IERC20(acceptedTokenBob).transferFrom(msg.sender, offer.payoutAddress, partialAmountBob));
      require(offer.tokenAlice.transfer(msg.sender, partialAmountAlice));

      offers[offerId].amountRemaining -= partialAmountAlice;

      if (offers[offerId].amountRemaining == 0) {
        delete offers[offerId];

        assert(offers[offerId].active == false);
        assert(offers[offerId].amountAlice == 0);
        assert(offers[offerId].amountRemaining == 0);
        assert(offers[offerId].offerer == address(0));

        emit OfferAccepted(offerId, offer);
      } else {
        emit OfferPartiallyAccepted(offerId, offers[offerId]);
      }

      return offerId;
    }

    function acceptOfferPartWithMinimum(uint256 offerId, address tokenBob, uint256 amountBob) public payable returns (uint256) {
      MBOffer storage offer = offers[offerId];

      assert(tokenBob != address(0));
      assert(offer.active == true);
      assert(getTime() < offer.deadline || offer.deadline == 0);
      assert(offer.offerType == OfferType.MinimumChunkedPurchase || 
        offer.offerType == OfferType.LimitedTimeMinimumPurchase || 
        offer.offerType == OfferType.LimitedTimeMinimumChunkedPurchase);

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

      assert(acceptedTokenBob == tokenBob);

      assert(partialAmountBob >= 0);

      assert(partialAmountAlice >= offer.smallestChunkSize);
      assert(partialAmountAlice <= offer.amountRemaining);
      
      offers[offerId].amountRemaining -= partialAmountBob;

      uint256 tokensSold = offer.amountAlice - offer.amountRemaining;

      if (tokensSold >= offer.minimumSize) {
        require(IERC20(acceptedTokenBob).transferFrom(msg.sender, offer.payoutAddress, partialAmountBob));
        require(offer.tokenAlice.transfer(msg.sender, partialAmountAlice));

        for (uint256 index = 0; index < offer.minimumOrderAddresses.length; index++) {
          require(IERC20(offer.minimumOrderTokens[index]).transferFrom(address(this), offer.payoutAddress, partialAmountBob));
          require(offer.tokenAlice.transfer(offer.minimumOrderAddresses[index], offer.minimumOrderAmountsBob[index]));
        }

        delete offers[offerId].minimumOrderAddresses;
        delete offers[offerId].minimumOrderAmountsBob;
        delete offers[offerId].minimumOrderAmountsAlice;
        delete offers[offerId].minimumOrderTokens;

        assert(offers[offerId].minimumOrderAmountsBob.length == 0);
        assert(offers[offerId].minimumOrderAmountsAlice.length == 0);
        assert(offers[offerId].minimumOrderAddresses.length == 0);
        assert(offers[offerId].minimumOrderTokens.length == 0);

      } else {
        require(IERC20(acceptedTokenBob).transferFrom(msg.sender, address(this), partialAmountBob));

        uint256 chunkAlicedex = offer.minimumOrderAddresses.length;

        if (chunkAlicedex > 0) {
          chunkAlicedex -= 1;
        }

        offer.minimumOrderAddresses.push(msg.sender);
        offer.minimumOrderAmountsBob.push(partialAmountBob);
        offer.minimumOrderAmountsAlice.push(partialAmountAlice);
        offer.minimumOrderTokens.push(acceptedTokenBob);

        offers[offerId] = offer;

        assert(offer.minimumOrderAmountsBob.length == chunkAlicedex + 1);
        assert(offer.minimumOrderAmountsAlice.length == chunkAlicedex + 1);
        assert(offer.minimumOrderAddresses.length == chunkAlicedex + 1);
        assert(offer.minimumOrderTokens.length == chunkAlicedex + 1);
      }

      if (offers[offerId].amountRemaining == 0) {
        delete offers[offerId];

        assert(offers[offerId].active == false);
        assert(offers[offerId].amountAlice == 0);
        assert(offers[offerId].amountRemaining == 0);
        assert(offers[offerId].offerer == address(0));

        emit OfferAccepted(offerId, offer);
      } else {
        emit OfferPartiallyAccepted(offerId, offers[offerId]);
      }

      return offerId;
    }

}
