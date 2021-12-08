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
      address offerer;
      address payoutAddress;
      bool active;
    }

    event OfferCreated(uint256 offerId, MBOffer offer);
    event OfferCancelled(uint256 offerId, MBOffer offer);
    event OfferAccepted(uint256 offerId, MBOffer offer);

    mapping (uint256 => MBOffer) public offers;

    function getOffer(uint256 offerId) public view returns (MBOffer memory) {
      return offers[offerId];
    }

    function createOffer(address tokenIn, address[] calldata tokenOut, uint256 amountIn, uint256[] calldata amountOut) public payable returns (uint256) {
      MBOffer memory offer = initOffer(tokenIn, tokenOut, amountIn, amountOut, msg.sender, msg.sender);

      uint256 offerId = nextOfferId;
      offers[offerId] = offer;

      require(offer.tokenIn.transferFrom(msg.sender, address(this), amountIn));

      nextOfferId ++;

      emit OfferCreated(offerId, offer);

      return offerId;
    }

    function initOffer(address tokenIn, address[] calldata tokenOut, uint256 amountIn, uint256[] calldata amountOut, address offerer, address payoutAddress) private pure returns (MBOffer memory) {
      MBOffer memory offer = MBOffer(IERC20(tokenIn), tokenOut, amountIn, amountOut, offerer, payoutAddress, true);

      offer.tokenIn = IERC20(tokenIn);
      offer.tokenOut = tokenOut;
      offer.amountIn = amountIn;
      offer.amountOut = amountOut;
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

}
