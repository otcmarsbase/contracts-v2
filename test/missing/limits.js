const assert = require('assert/strict');
const BigNumber = require('bignumber.js');
const { expect } = require('chai');
const { ethers } = require('hardhat');
const { createOfferTokenToken } = require('../create-offer');
const {
  checkEvent,
  checkEventExists,
  checkEventDoesntExist,
} = require('../events');
const { mintAll, approveMany, expectBalances } = require('../token-utils');
const {
  prepareEnvironment,
  ZERO,
  getOfferIdFromTx,
  getOfferDataFromTx,
  skipTime,
} = require('../utils');

describe('limits', () => {
  it('maximum bids in an offer with held tokens -- payout');
  it('maximum bids in an offer with held tokens -- cancel');
  it('maximum bids in an offer with held tokens -- contract migrate');
});
