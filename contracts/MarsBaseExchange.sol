// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./MarsBaseCommon.sol";
import "./MarsBaseOffers.sol";
import "./MarsBaseMinimumOffers.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MarsBaseExchange is MarsBaseCommon {
    address marsBaseOffersAddress;
    address marsBaseMinimumOffersAddress;
    address owner;

    struct MBAddresses {
        address offersContract;
        address minimumOffersContract;
    }

    constructor(address offersAddress, address minimumOffersAddress) {
        marsBaseOffersAddress = offersAddress;
        marsBaseMinimumOffersAddress = minimumOffersAddress;
        owner = msg.sender;
    }

    function getContractAddresses() public view returns (MBAddresses memory) {
        MBAddresses memory addresses;

        addresses.offersContract = marsBaseOffersAddress;
        addresses.minimumOffersContract = marsBaseMinimumOffersAddress;

        return addresses;
    }

    function setContractAddresses(MBAddresses calldata addresses) public {
        require(msg.sender == owner, "S7");

        marsBaseOffersAddress = addresses.offersContract;
        marsBaseMinimumOffersAddress = addresses.minimumOffersContract;
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

    function getOwner() public view returns (address) {
        return owner;
    }

    function cancelExpiredOffers() public {
        require(msg.sender == owner, "S7");

        MarsBaseOffers offersContract = MarsBaseOffers(marsBaseOffersAddress);
        MarsBaseMinimumOffers minimumOffersContract = MarsBaseMinimumOffers(marsBaseMinimumOffersAddress);
    
        offersContract.cancelExpiredOffers();
        minimumOffersContract.cancelExpiredOffers();
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

    function createOffer(address tokenAlice, address[] calldata tokenBob, uint256 amountAlice, uint256[] calldata amountBob, OfferParams calldata offerParameters) public {
        OfferType offerType = getOfferType(amountAlice, offerParameters);

        MBOffer memory offer;
        if (contractType(offerType) == ContractType.Offers) {
            offer = MarsBaseOffers(marsBaseOffersAddress).createOffer(msg.sender, tokenAlice, tokenBob, amountAlice, amountBob, offerParameters);
        } else {
            offer = MarsBaseMinimumOffers(marsBaseMinimumOffersAddress).createOffer(msg.sender, tokenAlice, tokenBob, amountAlice, amountBob, offerParameters);
        }

        emit OfferCreated(offer.offerId, msg.sender, block.timestamp, offer);
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

    function changeOfferParams(uint256 offerId, address[] calldata tokenBob, uint256[] calldata amountBob, OfferParams calldata offerParameters, OfferType offerType) public {
        if (contractType(offerType) == ContractType.Offers) {
            MarsBaseOffers(marsBaseOffersAddress).changeOfferParams(offerId, tokenBob, amountBob, offerParameters, msg.sender);
        } else {
            MarsBaseMinimumOffers(marsBaseMinimumOffersAddress).changeOfferParams(offerId, tokenBob, amountBob, offerParameters, msg.sender);
        }

        emit OfferModified(offerId, msg.sender, block.timestamp, offerParameters);
    }
}