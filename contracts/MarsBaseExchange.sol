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
    }

    constructor() public {
    }

    mapping (uint256 => MBOffer) public offers;

    function createOffer(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut, address offerer) public payable returns (uint256) {
      MBOffer storage offer = offers[nextOfferId];
      offer.tokenIn = IERC20(tokenIn);
      offer.tokenOut = IERC20(tokenOut);
      offer.amountIn = amountIn;
      offer.amountOut = amountOut;
      offer.offerer = offerer;
      require(offer.tokenIn.transferFrom(msg.sender, address(this), amountIn));
      nextOfferId ++;
      return nextOfferId;
    }

}
