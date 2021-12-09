// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EPICCoin is ERC20 {
    constructor() ERC20("EPICCoin", "EPIC") {
        _mint(msg.sender, 100000 * 10 ** decimals());
    }
}