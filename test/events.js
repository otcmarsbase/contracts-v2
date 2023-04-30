const { expect } = require('chai');

const excludeNumberKeys = (keys) =>
  keys.filter((x) => parseInt(x).toString() != x);

const checkEvent = (log, name, args, params = { exhaustive: true }) => {
  expect(log.name).eq(name, `[Event] ${log.name} != ${name}`);
  for (let key in args) {
    let val = log.args[key];
    let m = `[Event] ${name}.${key} != ${args[key]}`;
    if (typeof val === 'object' && ethers.BigNumber.isBigNumber(val))
      expect(val.toString()).eq(args[key], m);
    else expect(val).eql(args[key], m);
  }
  if (params.exhaustive)
    expect(excludeNumberKeys(Object.keys(log.args))).eql(
      Object.keys(args),
      'events keys are missing'
    );
};
const checkEventExists = (logs, name, predicate, args, params) => {
  if (typeof predicate !== 'function') {
    params = args;
    args = predicate;
    predicate = () => true;
  }
  let idx = logs.findIndex((x) => x.name == name && predicate(x.args));
  expect(idx).gt(-1, `[Event] ${name} not found`);
  let log = logs[idx];
  expect(log, `event ${name} not found with ${predicate.toString()}`).not
    .undefined;
  if (typeof args !== 'undefined') checkEvent(log, name, args, params);
  return idx;
};
const checkEventDoesntExist = (logs, name, predicate) => {
  if (typeof predicate !== 'function') predicate = () => true;

  let idx = logs.findIndex((x) => x.name == name && predicate(x.args));
  expect(idx).eq(
    -1,
    `[Event] ${name} found when it shouldn't exist ${predicate.toString()}`
  );
};
const erc20Abi = new ethers.utils.Interface([
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'function totalSupply() external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) external returns (bool)',
]);
const contractAbis = [
  'IMarsbaseExchange',
  'MarsBaseCommon',
  'MarsBaseExchange',
  'MarsbaseBestBid',
  'MarsbaseMarketplace',
].map(
  (x) =>
    new ethers.utils.Interface(
      JSON.parse(
        require('fs').readFileSync(
          require('path').resolve(`artifacts/contracts/${x}.sol/${x}.json`)
        )
      ).abi
    )
);
const tryParseLog =
  (...interfaces) =>
  (log) => {
    for (let interface of interfaces) {
      try {
        return interface.parseLog(log);
      } catch (e) {}
    }
    return log;
  };
const PUBLIC_ABIS = [erc20Abi, ...contractAbis];

module.exports = {
  checkEvent,
  checkEventExists,
  checkEventDoesntExist,
  tryParseLog,
  PUBLIC_ABIS,
};
