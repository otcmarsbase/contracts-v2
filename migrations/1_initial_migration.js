const MarsBaseExchange = artifacts.require("MarsBaseExchange");
const TestCoin = artifacts.require("TestToken");
const USDTCoin = artifacts.require("USDTCoin");
const EPICCOin = artifacts.require("EPICCoin");

module.exports = function (deployer) {
  deployer.deploy(MarsBaseExchange);
  deployer.deploy(TestCoin);
  deployer.deploy(USDTCoin);
  deployer.deploy(EPICCOin);
};