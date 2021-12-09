const Migrations = artifacts.require("Migrations");
const MarseBaseExchange = artifacts.require("MarsBaseExchange");
const TestCoin = artifacts.require("TestToken");
const USDTCoin = artifacts.require("USDTCoin");
const EPICCOin = artifacts.require("EPICCoin");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(MarseBaseExchange);
  deployer.deploy(TestCoin);
  deployer.deploy(USDTCoin);
  deployer.deploy(EPICCOin);
};