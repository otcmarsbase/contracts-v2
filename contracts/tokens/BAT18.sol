// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract BAT18 is ERC20 {
    constructor() ERC20('Basic Attention Token', 'BAT') {
        _mint(msg.sender, 100000 * 18 ** decimals());
    }
}
