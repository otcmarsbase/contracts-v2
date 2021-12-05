// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
    constructor() ERC20("Test", "TEST") {
        _mint(0xdC986e1E5Cb4F41a184eF03176257EdBb16b061e, 100000 * 10 ** decimals());
    }
}