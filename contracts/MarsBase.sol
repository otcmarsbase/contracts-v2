// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./MarsBaseCommon.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarsBase is MarsBaseCommon {

  uint256 nextOfferId;

  uint256 minimumFee = 10;

  address dexAddress;
  address owner;

  mapping (uint256 => MBOffer) public offers;

  constructor() {
    owner = msg.sender;
  }

  function setDexAddress(address dex) public {
    require(msg.sender == owner, "S7");

    dexAddress = dex;
  }

  function setMinimumFee(uint256 _minimumFee) public {
    require(msg.sender == owner, "S7");
    require(_minimumFee > 0, "M11");

    minimumFee = _minimumFee;
  }

  function getOffer(uint256 offerId) public view returns (MBOffer memory) {
    return offers[offerId];
  }

  function getNextOfferId() public view returns (uint256) {
    return nextOfferId;
  }

  function createOffer(address sender, address tokenAlice, address[] calldata tokenBob, uint256 amountAlice, uint256[] calldata amountBob, uint256[] calldata offerParameters) public returns (MBOffer memory) {
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

    return offer;
  }

  function changeOfferParams(uint256 offerId, address[] calldata tokenBob, uint256[] calldata amountBob, uint256[] calldata offerParameters, address sender) public returns (MBOffer memory) {
    MBOffer memory offer = offers[offerId];

    require(offer.offerer == sender, "S2");
    require(tokenBob.length == amountBob.length, "M5");

    for (uint256 index = 0; index < tokenBob.length; index++) {
      require(tokenBob[index] != address(0), "T0");
      require(amountBob[index] > 0, "M6");
    }

    require(offer.capabilities[0] == true, "S4");

    require(offerParameters[2] <= offer.amountAlice, "M1");

    offer.tokenBob = tokenBob;
    offer.amountBob = amountBob;
    offer.feeAlice = offerParameters[0];
    offer.feeBob = offerParameters[1];
    offer.smallestChunkSize = offerParameters[2];
    offer.deadline = offerParameters[3];

    offers[offerId] = offer;

    return offer;
  }

}
