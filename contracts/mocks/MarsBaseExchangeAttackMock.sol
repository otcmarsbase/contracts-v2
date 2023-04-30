// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Address.sol';

import 'hardhat/console.sol';
import "../MarsBaseCommon.sol";

interface IMarsBaseExchange {
    function createOffer(
        address tokenAlice,
        address[] calldata tokenBob,
        uint256 amountAlice,
        uint256[] calldata amountBob,
        MarsBaseCommon.OfferParams calldata offerParameters
    ) external payable;

    function acceptOffer(
        uint256 offerId,
        address tokenBob,
        uint256 amountBob
    ) external payable;

    function closeExpiredOffer(uint256 offerId) external;
}

contract MarsBaseExchangeAttackMock is Ownable {
    using Address for address;
    IMarsBaseExchange public exchange;

    constructor(IMarsBaseExchange _exchange) {
        exchange = _exchange;
    }

    function createOffer(
        address tokenAlice,
        address[] calldata tokenBob,
        uint256 amountAlice,
        uint256[] calldata amountBob,
        MarsBaseCommon.OfferParams calldata offerParameters
    ) external payable {
        exchange.createOffer{value: amountAlice}(tokenAlice, tokenBob, amountAlice, amountBob, offerParameters);
    }

    function acceptOffer(
        uint256 offerId,
        address tokenBob,
        uint256 amountBob
    ) external payable {
        for (uint256 i; i < 5; i++){
            exchange.acceptOffer{value: amountBob}(offerId, tokenBob, amountBob);
        }
    }
    
    function exploit(uint256 offerId) external payable {
        exchange.closeExpiredOffer(offerId);
    }


    function changeOwner(address newOwner) external onlyOwner {
        _transferOwnership(newOwner);
    }

    receive() external payable {
        if(address(exchange).balance >= 1 ether && msg.sender.isContract()) {
            exchange.closeExpiredOffer(0);
        }
    }
}