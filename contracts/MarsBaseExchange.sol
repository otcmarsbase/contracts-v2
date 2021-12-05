// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MarsBaseExchange {

    using SafeMath for uint256;

    uint256 nextOfferId;

    struct MBOffer {
      IERC20 tokenIn;
      IERC20 tokenOut;
      uint256 amountIn;
      uint256 amountOut;
      address offerer;
      address payoutAddress;
    }

    mapping (uint256 => MBOffer) public offers;

    function createOffer(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut, address offerer, address payoutAddress) public payable returns (uint256) {
      MBOffer memory offer = initOffer(tokenIn, tokenOut, amountIn, amountOut, offerer, payoutAddress);
      offers[nextOfferId] = offer;

      require(offer.tokenIn.transferFrom(msg.sender, address(this), amountIn));
      
      nextOfferId ++;

      return nextOfferId;
    }

    function createOffer(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut, address payoutAddress) public payable returns (uint256) {
      MBOffer memory offer = initOffer(tokenIn, tokenOut, amountIn, amountOut, msg.sender, payoutAddress);
      offers[nextOfferId] = offer;

      require(offer.tokenIn.transferFrom(msg.sender, address(this), amountIn));
      
      nextOfferId ++;

      return nextOfferId;
    }

    function createOffer(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut) public payable returns (uint256) {

      MBOffer memory offer = initOffer(tokenIn, tokenOut, amountIn, amountOut, msg.sender, msg.sender);
      offers[nextOfferId] = offer;

      require(offer.tokenIn.transferFrom(msg.sender, address(this), amountIn));
      
      nextOfferId ++;

      return nextOfferId;
    }

    function initOffer(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut, address offerer, address payoutAddress) private pure returns (MBOffer memory) {
      MBOffer memory offer;
      
      offer.tokenIn = IERC20(tokenIn);
      offer.tokenOut = IERC20(tokenOut);
      offer.amountIn = amountIn;
      offer.amountOut = amountOut;
      offer.offerer = offerer;
      offer.payoutAddress = payoutAddress;

      return offer;
    }

}
