// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MarsBaseExchange {

    using SafeMath for uint256;

    uint256 nextOfferId;

    struct MBOffer {
      IERC20 tokenIn;
      address[] tokenOut;
      uint256 amountIn;
      uint256[] amountOut;
      uint256 smallestChunkSize;
      uint256 amountRemaining;
      address offerer;
      address payoutAddress;
      bool active;
    }

    event OfferCreated(uint256 offerId, MBOffer offer);
    event OfferCancelled(uint256 offerId, MBOffer offer);
    event OfferAccepted(uint256 offerId, MBOffer offer);
    event OfferPartiallyAccepted(uint256 offerId, MBOffer offer);

    mapping (uint256 => MBOffer) public offers;

    function getOffer(uint256 offerId) public view returns (MBOffer memory) {
      return offers[offerId];
    }

    function price(uint256 amountIn, uint256 amountOut, uint256 chunkSize) public pure returns (uint256) {
      // uint256 input_amount_with_fee = amountIn.mul(1);
      // uint256 numerator = input_amount_with_fee.mul(amountOut);
      // uint256 denominator = remainingAmountIn.add(amountIn);
      uint256 conversionRate = amountIn / amountOut;
      return chunkSize.mul(conversionRate);
    }

    function createOffer(address tokenIn, address[] calldata tokenOut, uint256 amountIn, uint256[] calldata amountOut, uint256 smallestChunkSize) public payable returns (uint256) {
      assert(amountIn >= smallestChunkSize);
      
      MBOffer memory offer = initOffer(tokenIn, tokenOut, amountIn, amountOut, smallestChunkSize, msg.sender, msg.sender);

      uint256 offerId = nextOfferId;
      offers[offerId] = offer;

      require(offer.tokenIn.transferFrom(msg.sender, address(this), amountIn));

      nextOfferId ++;

      emit OfferCreated(offerId, offer);

      return offerId;
    }

    function initOffer(address tokenIn, address[] calldata tokenOut, uint256 amountIn, uint256[] calldata amountOut, uint256 smallestChunkSize, address offerer, address payoutAddress) private pure returns (MBOffer memory) {
      MBOffer memory offer;

      offer.tokenIn = IERC20(tokenIn);
      offer.tokenOut = tokenOut;
      offer.amountIn = amountIn;
      offer.amountOut = amountOut;

      offer.amountRemaining = amountIn;
      offer.smallestChunkSize = smallestChunkSize;
      
      offer.offerer = offerer;
      offer.payoutAddress = payoutAddress;
      offer.active = true;

      return offer;
    }

    function cancelOffer(uint256 offerId) public payable returns (uint256) {
      MBOffer memory offer = offers[offerId];

      assert(msg.sender == offer.offerer);
      assert(offer.active == true);
      assert(offer.amountIn > 0);

      require(offer.tokenIn.transfer(offer.offerer, offer.amountIn));

      delete offers[offerId];

      assert(offers[offerId].active == false);
      assert(offers[offerId].amountIn == 0);
      assert(offers[offerId].offerer == address(0));

      emit OfferCancelled(offerId, offer);

      return offerId;
    }

    function acceptOffer(uint256 offerId, address tokenOut, uint256 amountIn, uint256 amountOut) public payable returns (uint256) {
      MBOffer memory offer = offers[offerId];

      assert(offer.active == true);
      assert(offer.amountIn == amountIn);

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

      assert(offer.active == true);

      address acceptedTokenOut = address(0);
      uint256 acceptedAmountOut = 0;
      for (uint256 index = 0; index < offer.tokenOut.length; index++) {
        if (offer.tokenOut[index] == tokenOut) {
          acceptedTokenOut = offer.tokenOut[index];
          acceptedAmountOut = offer.amountOut[index];
        }
      }

      uint256 conversionRate = offer.amountIn / acceptedAmountOut;

      uint256 partialAmountIn = amountOut.mul(conversionRate); //price(offer.amountIn, acceptedAmountOut, amountOut);
      uint256 partialAmountOut = offer.amountRemaining / conversionRate;//price(partialAmountOut, amountOut, offer.amountIn);

      assert(acceptedTokenOut == tokenOut);
      // assert(partialAmountOut <= amountOut);

      assert(partialAmountIn >= offer.smallestChunkSize);
      // assert(partialAmountOut <= offer.amountIn);

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
