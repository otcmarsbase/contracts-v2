// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./MarsBaseCommon.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarsBase is MarsBaseCommon {

  uint256 nextOfferId;

  uint256 minimumFee = 10;

  mapping (uint256 => MBOffer) public offers;

  function setMinimumFee(uint256 _minimumFee) public {
    require(_minimumFee > 0);

    minimumFee = _minimumFee;
  }

  function setCurrentTime() public {
    for (uint256 index = 0; index < nextOfferId; index++) {
      if (getTime() >= offers[index].deadline && offers[index].deadline != 0) {
        cancelExpiredOffer(index);
      }
    }
  }

  function getOffer(uint256 offerId) public view returns (MBOffer memory) {
    return offers[offerId];
  }

  function getNextOfferId() public view returns (uint256) {
    return nextOfferId;
  }

  function createOffer(address sender, address tokenAlice, address[] calldata tokenBob, uint256 amountAlice, uint256[] calldata amountBob, uint256[] calldata offerParameters) public returns (uint256) {
    uint256 feeAlice = offerParameters[0];
    uint256 feeBob = offerParameters[1];
    
    require(tokenAlice != address(0), "T0");
    for (uint256 index = 0; index < tokenBob.length; index++) {
      require(tokenBob[index] != address(0), "T0");
    }

    require(feeAlice + feeBob >= minimumFee, "M0");
    
    MBOffer memory offer = initOffer(nextOfferId, tokenAlice, tokenBob, amountAlice, amountBob, offerParameters);
    offer = setOfferProperties(offer, offerParameters);
    offer.offerType = getOfferType(amountAlice, offerParameters);

    offer.payoutAddress = sender;
    offer.offerer = sender;

    uint256 offerId = nextOfferId;
    offers[offerId] = offer;

    require(IERC20(offer.tokenAlice).transferFrom(sender, address(this), amountAlice), "T1a");

    nextOfferId ++;

    return offerId;
  }

  function cancelExpiredOffer(uint256 offerId) private returns (uint256) {
    MBOffer memory offer = offers[offerId];

    if (offer.capabilities[1] == false) {
      return offerId;
    }

    require(offer.capabilities[1] == true, "S1");
    require(offer.active == true, "S0");
    require(offer.amountAlice > 0, "M3");

    require(IERC20(offer.tokenAlice).transfer(offer.offerer, offer.amountRemaining), "T1b");

    return offer.offerId;
  }

  function changeOfferPrice(uint256 offerId, address[] calldata tokenBob, uint256[] calldata amountBob, address sender) public returns (MBOffer memory) {
    MBOffer memory offer = offers[offerId];

    require(tokenBob.length == amountBob.length, "M5");

    for (uint256 index = 0; index < tokenBob.length; index++) {
      require(tokenBob[index] != address(0), "T0");
      require(amountBob[index] > 0, "M6");
    }

    require(offer.capabilities[0] == true, "S4");

    require(offer.offerer == sender, "S2");

    offer.tokenBob = tokenBob;
    offer.amountBob = amountBob;

    offers[offerId] = offer;

    return offer;

  }

  function changeOfferPricePart(uint256 offerId, address[] calldata tokenBob, uint256[] calldata amountBob, uint256 smallestChunkSize, address sender) public returns (MBOffer memory) {
    MBOffer memory offer = offers[offerId];

    require(tokenBob.length == amountBob.length, "M5");

    for (uint256 index = 0; index < tokenBob.length; index++) {
      require(tokenBob[index] != address(0), "T0");
      require(amountBob[index] > 0, "M6");
    }

    require(offer.capabilities[0] == true, "S4");

    require(offer.offerer == sender, "S2");
    require(smallestChunkSize <= offer.amountAlice, "M1");

    offer.tokenBob = tokenBob;
    offer.amountBob = amountBob;
    offer.smallestChunkSize = smallestChunkSize;

    offers[offerId] = offer;

    return offer;
  }

}
