// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./MarsBase.sol";
import "./MarsBaseCommon.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MarsBaseExchange {
    event OfferCreated(
        uint256 offerId,
        address sender,
        uint256 blockTimestamp,
        MarsBaseCommon.MBOffer offer
    );
    event OfferModified(
        uint256 offerId,
        address sender,
        uint256 blockTimestamp,
        MarsBaseCommon.OfferParams offerParameters
    );
    event OfferAccepted(
        uint256 offerId,
        address sender,
        uint256 blockTimestamp,
        uint256 amountBob,
        address tokenAddress,
        MarsBaseCommon.OfferType offerType
    );
    event OfferCancelled(
        uint256 offerId,
        address sender,
        uint256 blockTimestamp
    );
    event BidCancelled(uint256 offerId, address sender, uint256 blockTimestamp);

    // For testing usage
    event Log(uint256 log);

    address marsBaseOffersAddress;
    address marsBaseMinimumOffersAddress;
    address owner;

    uint256 nextOfferId;

    uint256 minimumFee = 10;

    address dexAddress;
    address commissionWallet;

    mapping(uint256 => MarsBaseCommon.MBOffer) public offers;

    constructor() {
        owner = msg.sender;
        commissionWallet = msg.sender;
    }

    struct MBAddresses {
        address offersContract;
        address minimumOffersContract;
    }

    function setDexAddress(address dex) public {
        require(msg.sender == owner, "S7");

        dexAddress = dex;
    }

    function setCommissionAddress(address wallet) public {
        require(msg.sender == owner, "S7");
        require(wallet != address(0), "T0");

        commissionWallet = wallet;
    }

    function setMinimumFee(uint256 _minimumFee) public {
        require(msg.sender == owner, "S7");

        minimumFee = _minimumFee;
    }

    function getOffer(uint256 offerId)
        public
        view
        returns (MarsBaseCommon.MBOffer memory)
    {
        return offers[offerId];
    }

    function getNextOfferId() public view returns (uint256) {
        return nextOfferId;
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

    function getOwner() public view returns (address) {
        return owner;
    }

    // function cancelExpiredOffers() public {
    //     require(msg.sender == owner, "S7");
    // }

    function getAllOffers()
        public
        view
        returns (MarsBaseCommon.MBOffer[] memory)
    {
        MarsBaseCommon.MBOffer[]
            memory openOffers = new MarsBaseCommon.MBOffer[](nextOfferId);
        uint256 counter = 0;

        for (uint256 index = 0; index < nextOfferId; index++) {
            if (getOffer(index).active == true) {
                openOffers[counter] = getOffer(index);
                counter++;
            }
        }

        return openOffers;
    }

    function createOffer(
        address tokenAlice,
        address[] calldata tokenBob,
        uint256 amountAlice,
        uint256[] calldata amountBob,
        MarsBaseCommon.OfferParams calldata offerParameters
    ) public payable {
        require(
            offerParameters.feeAlice + offerParameters.feeBob >= minimumFee,
            "M0"
        );

        offers[nextOfferId] = MarsBase.createOffer(
            nextOfferId,
            tokenAlice,
            tokenBob,
            amountAlice,
            amountBob,
            offerParameters
        );
        emit OfferCreated(
            nextOfferId,
            msg.sender,
            block.timestamp,
            offers[nextOfferId]
        );

        nextOfferId++;
    }

    function cancelOffer(uint256 offerId) public {
        offers[offerId] = MarsBase.cancelOffer(offers[offerId]);
        emit OfferCancelled(offerId, msg.sender, block.timestamp);
    }

    function price(
        uint256 amountAlice,
        uint256 offerAmountAlice,
        uint256 offerAmountBob
    ) public pure returns (uint256) {
        return MarsBase.price(amountAlice, offerAmountAlice, offerAmountBob);
    }

    function acceptOffer(
        uint256 offerId,
        address tokenBob,
        uint256 amountBob
    ) public payable {
        MarsBaseCommon.MBOffer memory offer = offers[offerId];
        MarsBaseCommon.OfferType offerType = offer.offerType;

        if (tokenBob == address(0)) {
            amountBob = msg.value;
        }

        if (
            MarsBase.contractType(offerType) ==
            MarsBaseCommon.ContractType.Offers
        ) {
            if (
                offerType == MarsBaseCommon.OfferType.FullPurchase ||
                offerType == MarsBaseCommon.OfferType.LimitedTime
            ) {
                offers[offerId] = MarsBase.acceptOffer(
                    offer,
                    tokenBob,
                    amountBob
                );
            } else {
                offers[offerId] = MarsBase.acceptOfferPart(
                    offer,
                    tokenBob,
                    amountBob
                );
            }
        } else {
            offers[offerId] = MarsBase.acceptOfferPartWithMinimum(
                offer,
                tokenBob,
                amountBob
            );
        }

        emit OfferAccepted(
            offerId,
            msg.sender,
            block.timestamp,
            amountBob,
            tokenBob,
            offerType
        );
    }

    function changeOfferParams(
        uint256 offerId,
        address[] calldata tokenBob,
        uint256[] calldata amountBob,
        MarsBaseCommon.OfferParams calldata offerParameters
    ) public {
        offers[offerId] = MarsBase.changeOfferParams(
            offers[offerId],
            tokenBob,
            amountBob,
            offerParameters
        );

        emit OfferModified(
            offerId,
            msg.sender,
            block.timestamp,
            offerParameters
        );
    }

    function cancelBid(uint256 offerId) public {
        offers[offerId] = MarsBase.cancelBid(offers[offerId]);

        emit BidCancelled(offerId, msg.sender, block.timestamp);
    }

    function cancelExpiredOffers() public payable {
        require(msg.sender == owner, "S8");

        for (uint256 index = 0; index < nextOfferId; index++) {
            if (
                block.timestamp >= offers[index].deadline &&
                offers[index].deadline != 0 &&
                MarsBase.contractType(offers[index].offerType) == MarsBaseCommon.ContractType.Offers
            ) {
                offers[index] = MarsBase.cancelExpiredOffer(offers[index]);
            } else {
                offers[index] = MarsBase.cancelExpiredMinimumOffer(offers[index]);
            }
        }
    }
}
