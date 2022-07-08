// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LOOKS is ERC20 {
    constructor() ERC20("LOOKS", "LOOKS") {
        _mint(msg.sender, 1000000000000000 * 10 ** decimals());
    }

    function decimals() public view virtual override returns (uint8) {
        return 8;
    }
}