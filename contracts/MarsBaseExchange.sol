// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./MarsBaseCommon.sol";
import "./MarsBaseOffers.sol";
import "./MarsBaseMinimumOffers.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarsBaseExchange is MarsBaseCommon {
    address marsBaseOffersAddress;
    address marsBaseMinimumOffersAddress;

    constructor(address offersAddress, address minimumOffersAddress) {
        marsBaseOffersAddress = offersAddress;
        marsBaseMinimumOffersAddress = minimumOffersAddress;
    }

    function getOffer(uint256 offerId, OfferType offerType) public view returns (MBOffer memory) {
        MBOffer memory offer;

        if (contractType(offerType) == ContractType.Offers) {
            offer = MarsBaseOffers(marsBaseOffersAddress).getOffer(offerId);
        } else {
            offer = MarsBaseMinimumOffers(marsBaseMinimumOffersAddress).getOffer(offerId);
        }

        return offer;
    }

    function getAllOffers() public view returns (MBOffer[] memory) {
        MarsBaseOffers offersContract = MarsBaseOffers(marsBaseOffersAddress);
        MarsBaseMinimumOffers minimumOffersContract = MarsBaseMinimumOffers(marsBaseMinimumOffersAddress);

        MBOffer[] memory openOffers = new MBOffer[](offersContract.getNextOfferId() + minimumOffersContract.getNextOfferId());
        uint256 counter = 0;
    
        for (uint256 index = 0; index < offersContract.getNextOfferId(); index++) {
          if (offersContract.getOffer(index).active == true) {
            openOffers[counter] = offersContract.getOffer(index);
            counter++;
          }
        }
    
        for (uint256 index = 0; index < minimumOffersContract.getNextOfferId(); index++) {
          if (minimumOffersContract.getOffer(index).active == true) {
            openOffers[counter] = minimumOffersContract.getOffer(index);
            counter++;
          }
        }
    
        return openOffers;
      }

    function createOffer(address tokenAlice, address[] calldata tokenBob, uint256 amountAlice, uint256[] calldata amountBob, uint256[] calldata offerParameters) public {
        OfferType offerType = getOfferType(amountAlice, offerParameters);

        uint256 offerId;
        if (contractType(offerType) == ContractType.Offers) {
            offerId = MarsBaseOffers(marsBaseOffersAddress).createOffer(msg.sender, tokenAlice, tokenBob, amountAlice, amountBob, offerParameters);
        } else {
            offerId = MarsBaseMinimumOffers(marsBaseMinimumOffersAddress).createOffer(msg.sender, tokenAlice, tokenBob, amountAlice, amountBob, offerParameters);
        }

        emit OfferCreated(offerId, msg.sender, block.timestamp);
    }

    function cancelOffer(uint256 offerId, OfferType offerType) public {
        if (contractType(offerType) == ContractType.Offers) {
            MarsBaseOffers(marsBaseOffersAddress).cancelOffer(offerId, msg.sender);
        } else {
            MarsBaseMinimumOffers(marsBaseMinimumOffersAddress).cancelOffer(offerId, msg.sender);
        }

        emit OfferCancelled(offerId, msg.sender, block.timestamp);
    }

    function acceptOffer(uint256 offerId, address tokenBob, uint256 amountBob, OfferType offerType) public {
        uint256 amountAlice = 0;
        if (contractType(offerType) == ContractType.Offers) {
            if (offerType == OfferType.FullPurchase || offerType == OfferType.LimitedTime) {
                amountAlice = MarsBaseOffers(marsBaseOffersAddress).acceptOffer(offerId, tokenBob, amountBob, msg.sender);
            } else {
                amountAlice = MarsBaseOffers(marsBaseOffersAddress).acceptOfferPart(offerId, tokenBob, amountBob, msg.sender);
            }
        } else {
            amountAlice = MarsBaseMinimumOffers(marsBaseMinimumOffersAddress).acceptOfferPartWithMinimum(offerId, tokenBob, amountBob, msg.sender);
        }

        emit OfferAccepted(offerId, msg.sender, block.timestamp, amountAlice, amountBob, tokenBob);
    }

    function changeOfferPricePart(uint256 offerId, address[] calldata tokenBob, uint256[] calldata amountBob, uint256 smallestChunkSize, OfferType offerType) public {
        if (contractType(offerType) == ContractType.Offers) {
            MarsBaseOffers(marsBaseOffersAddress).changeOfferPricePart(offerId, tokenBob, amountBob, smallestChunkSize, msg.sender);
        } else {
            MarsBaseMinimumOffers(marsBaseMinimumOffersAddress).changeOfferPricePart(offerId, tokenBob, amountBob, smallestChunkSize, msg.sender);
        }

        emit OfferModified(offerId, msg.sender, block.timestamp);
    }

    function changeOfferPrice(uint256 offerId, address[] calldata tokenBob, uint256[] calldata amountBob, OfferType offerType) public {
        if (contractType(offerType) == ContractType.Offers) {
            MarsBaseOffers(marsBaseOffersAddress).changeOfferPrice(offerId, tokenBob, amountBob, msg.sender);
        } else {
            MarsBaseMinimumOffers(marsBaseMinimumOffersAddress).changeOfferPrice(offerId, tokenBob, amountBob, msg.sender);
        }

        emit OfferModified(offerId, msg.sender, block.timestamp);
    }
}