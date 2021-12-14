// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarsBaseExchange is Ownable {

    using SafeMath for uint256;

    uint256 nextOfferId;

    struct MBOffer {
      IERC20 tokenIn;
      address[] tokenOut;
      uint256 amountIn;
      uint256[] amountOut;
      uint256 smallestChunkSize;
      uint256 amountRemaining;
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

    function getOffer(uint256 offerId) public view returns (MBOffer memory) {
      return offers[offerId];
    }

    function price(uint256 amountIn, uint256 offerAmountIn, uint256 offerAmountOut) public pure returns (uint256) {
      uint256 numerator = amountIn.mul(offerAmountOut);
      uint256 denominator = offerAmountIn;
      return numerator / denominator;
    }

    function createOffer(address tokenIn, address[] calldata tokenOut, uint256 amountIn, uint256[] calldata amountOut, uint256 smallestChunkSize, uint256 deadline) public payable returns (uint256) {
      assert(tokenIn != address(0));
      for (uint256 index = 0; index < tokenOut.length; index++) {
        assert(tokenOut[index] != address(0));
      }

      assert(amountIn >= smallestChunkSize);
      assert(getTime() < deadline || deadline == 0);
      
      MBOffer memory offer = initOffer(tokenIn, tokenOut, amountIn, amountOut, smallestChunkSize, msg.sender, msg.sender, deadline);

      uint256 offerId = nextOfferId;
      offers[offerId] = offer;

      require(offer.tokenIn.transferFrom(msg.sender, address(this), amountIn));

      nextOfferId ++;

      emit OfferCreated(offerId, offer);

      return offerId;
    }

    function initOffer(address tokenIn, address[] calldata tokenOut, uint256 amountIn, uint256[] calldata amountOut, uint256 smallestChunkSize, address offerer, address payoutAddress, uint256 deadline) private pure returns (MBOffer memory) {
      MBOffer memory offer;

      offer.tokenIn = IERC20(tokenIn);
      offer.tokenOut = tokenOut;
      offer.amountIn = amountIn;
      offer.amountOut = amountOut;

      offer.amountRemaining = amountIn;
      offer.smallestChunkSize = smallestChunkSize;
      
      offer.offerer = offerer;
      offer.payoutAddress = payoutAddress;

      offer.deadline = deadline;
      offer.active = true;

      return offer;
    }

    function cancelOffer(uint256 offerId) public payable returns (uint256) {
      MBOffer memory offer = offers[offerId];

      assert(msg.sender == offer.offerer);
      assert(offer.active == true);
      assert(offer.amountIn > 0);

      require(offer.tokenIn.transfer(offer.offerer, offer.amountRemaining));

      delete offers[offerId];

      assert(offers[offerId].active == false);
      assert(offers[offerId].amountIn == 0);
      assert(offers[offerId].offerer == address(0));

      emit OfferCancelled(offerId, offer);

      return offerId;
    }

    function acceptOffer(uint256 offerId, address tokenOut, uint256 amountIn, uint256 amountOut) public payable returns (uint256) {
      MBOffer memory offer = offers[offerId];

      assert(tokenOut != address(0));
      assert(offer.active == true);
      assert(offer.amountIn == amountIn);
      assert(getTime() < offer.deadline || offer.deadline == 0);

      address acceptedTokenOut = address(0);
      uint256 acceptedAmountOut = 0;
      for (uint256 index = 0; index < offer.tokenOut.length; index++) {
        if (offer.tokenOut[index] == tokenOut && offer.amountOut[index] == amountOut) {
          acceptedTokenOut = offer.tokenOut[index];
          acceptedAmountOut = offer.amountOut[index];
        }
      }

      assert(acceptedTokenOut == tokenOut);
      assert(acceptedAmountOut == amountOut);

      require(IERC20(acceptedTokenOut).transferFrom(msg.sender, offer.payoutAddress, acceptedAmountOut));
      require(offer.tokenIn.transfer(msg.sender, offer.amountIn));

      delete offers[offerId];

      assert(offers[offerId].active == false);
      assert(offers[offerId].amountIn == 0);
      assert(offers[offerId].offerer == address(0));

      emit OfferAccepted(offerId, offer);

      return offerId;
    }

    function acceptOfferPart(uint256 offerId, address tokenOut, uint256 amountOut) public payable returns (uint256) {
      MBOffer memory offer = offers[offerId];

      assert(tokenOut != address(0));
      assert(offer.active == true);
      assert(getTime() < offer.deadline || offer.deadline == 0);

      address acceptedTokenOut = address(0);
      uint256 acceptedAmountOut = 0;
      for (uint256 index = 0; index < offer.tokenOut.length; index++) {
        if (offer.tokenOut[index] == tokenOut) {
          acceptedTokenOut = offer.tokenOut[index];
          acceptedAmountOut = offer.amountOut[index];
        }
      }

      uint256 partialAmountIn = price(amountOut, acceptedAmountOut, offer.amountIn);
      uint256 partialAmountOut = price(partialAmountIn, offer.amountIn, acceptedAmountOut);

      assert(acceptedTokenOut == tokenOut);

      assert(partialAmountOut >= 0);

      assert(partialAmountIn >= offer.smallestChunkSize);
      assert(partialAmountIn <= offer.amountRemaining);

      require(IERC20(acceptedTokenOut).transferFrom(msg.sender, offer.payoutAddress, partialAmountOut));
      require(offer.tokenIn.transfer(msg.sender, partialAmountIn));

      offers[offerId].amountRemaining -= partialAmountIn;

      if (offers[offerId].amountRemaining == 0) {
        delete offers[offerId];

        assert(offers[offerId].active == false);
        assert(offers[offerId].amountIn == 0);
        assert(offers[offerId].amountRemaining == 0);
        assert(offers[offerId].offerer == address(0));

        emit OfferAccepted(offerId, offer);
      } else {
        emit OfferPartiallyAccepted(offerId, offers[offerId]);
      }

      return offerId;
    }

}
