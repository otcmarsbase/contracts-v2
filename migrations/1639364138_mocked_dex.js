const MockMarsBaseExchange = artifacts.require("MockMarsBaseExchange");
const MarsBaseExchange = artifacts.require("MarsBaseExchange");
const MarsBaseMinimumOffers = artifacts.require("MarsBaseMinimumOffers");
const MarsBaseOffers = artifacts.require("MarsBaseOffers");

module.exports = async function(deployer) {
  // Use deployer to state migration tasks.
  let offers = await MarsBaseOffers.deployed();
  let minimumOffers = await MarsBaseMinimumOffers.deployed();
  deployer.deploy(MarsBaseExchange, offers.address, minimumOffers.address);
  // deployer.deploy(MockMarsBaseExchange);
};
