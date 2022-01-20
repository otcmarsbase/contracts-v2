const MarsBaseMinimumOffers = artifacts.require("MarsBaseMinimumOffers");
const MarsBaseOffers = artifacts.require("MarsBaseOffers");
const TestCoin = artifacts.require("TestToken");
const USDTCoin = artifacts.require("USDTCoin");
const EPICCOin = artifacts.require("EPICCoin");

module.exports = function (deployer) {
  deployer.deploy(MarsBaseOffers);
  deployer.deploy(MarsBaseMinimumOffers);
  // deployer.deploy(TestCoin);
  // deployer.deploy(USDTCoin);
  // deployer.deploy(EPICCOin);
};