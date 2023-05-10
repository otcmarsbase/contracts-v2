// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract USDT is ERC20 {
    constructor() ERC20('USD Tether', 'USDT') {
        _mint(msg.sender, 1000000000000000 * 10 ** decimals());
    }
}
