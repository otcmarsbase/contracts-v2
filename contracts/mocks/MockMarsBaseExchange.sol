// // SPDX-License-Identifier: MIT
// pragma solidity >=0.4.22 <0.9.0;

// import "../MarsBaseExchange.sol";

// contract MockMarsBaseExchange is MarsBaseExchange {  
  
//   uint256 public fakeBlockTimeStamp;

//   constructor(address offersAddress, address minimumOffersAddress) MarsBaseExchange(offersAddress, minimumOffersAddress) {}

//   // override Cars.getTime()
//   function getTime() override internal view returns (uint256) {
//     return fakeBlockTimeStamp;
//   }

//   function _mock_setBlockTimeStamp(uint256 value) public {
//     fakeBlockTimeStamp = value;
//   }

// }