const MockMarsBaseExchange = artifacts.require("MockMarsBaseExchange");

module.exports = function(deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(MockMarsBaseExchange);
};
