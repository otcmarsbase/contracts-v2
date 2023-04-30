const assert = require('assert/strict');
const BigNumber = require('bignumber.js');
const { expect } = require('chai');
const { ethers } = require('hardhat');
const { prepareEnvironment, ZERO } = require('../utils');

describe('missing/price', () => {
  it('should correctly calculate price for small amounts', async () => {
    let { owner, alice, bob, dex } = await prepareEnvironment();

    let offerAmountAlice = 1;
    let offerAmountBob = 2;
    for (let [amountAlice, amountBob] of [
      [0, 0],
      [1, 2],
      [5, 10],
      [
        '999991465593435680596738785309628',
        '1999982931186871361193477570619256',
      ],
    ]) {
      let price = await dex.price(
        amountAlice,
        offerAmountAlice,
        offerAmountBob
      );
      // console.log(`${amountAlice} ${amountBob} = ${price}`)
      expect(
        await dex.price(amountAlice, offerAmountAlice, offerAmountBob)
      ).equal(amountBob);
    }
  });
  it('should correctly calculate price for small fractional amounts', async () => {
    let { owner, alice, bob, dex } = await prepareEnvironment();

    let offerAmountAlice = 2;
    let offerAmountBob = 1;
    for (let [amountAlice, amountBob] of [
      [0, 0],
      [1, 0],
      [2, 1],
      [3, 1],
      [5, 2],
      [10, 5],
      [
        '1999982931186871361193477570619256',
        '999991465593435680596738785309628',
      ],
      [
        '1999982931186871361193477570619255',
        '999991465593435680596738785309627',
      ],
    ]) {
      let price = await dex.price(
        amountAlice,
        offerAmountAlice,
        offerAmountBob
      );
      // console.log(`${amountAlice} ${amountBob} = ${price}`)
      expect(
        await dex.price(amountAlice, offerAmountAlice, offerAmountBob)
      ).equal(amountBob);
    }
  });
  it('should correctly calculate price for big alice and small bob', async () => {
    let { owner, alice, bob, dex } = await prepareEnvironment();

    let offerAmountAlice = 2 + '0'.repeat(33);
    let offerAmountBob = 1;
    for (let [amountAlice, amountBob] of [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [5, 0],
      [10, 0],
      [`1${'0'.repeat(33)}`, 0],
      [`1${'9'.repeat(33)}`, 0],
      [`2${'0'.repeat(33)}`, 1],
      [`2${'0'.repeat(32)}1`, 1],
      [`3${'9'.repeat(33)}`, 1],
      [`4${'0'.repeat(33)}`, 2],
      [`4${'0'.repeat(32)}1`, 2],
    ]) {
      let price = await dex.price(
        amountAlice,
        offerAmountAlice,
        offerAmountBob
      );
      // console.log(`${amountAlice} ${amountBob} = ${price}`)
      expect(
        await dex.price(amountAlice, offerAmountAlice, offerAmountBob),
        `${amountAlice} ${amountBob} = ${price}`
      ).equal(amountBob);
    }
    offerAmountAlice = 1 + '0'.repeat(33);
    offerAmountBob = 2;
    for (let [amountAlice, amountBob] of [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [5, 0],
      [10, 0],
      [`4${'9'.repeat(31)}9`, 0], // 0.499999 = 0
      [`5${'0'.repeat(31)}0`, 1], // 0.500000 = 1
      [`5${'0'.repeat(31)}1`, 1], // 0.500001 = 1
      [`9${'9'.repeat(31)}9`, 1], // 0.999999 = 1
      [`10${'0'.repeat(31)}0`, 2], // 1.00000 = 2
      [`10${'0'.repeat(31)}1`, 2], // 1.00001 = 2

      [`14${'9'.repeat(31)}9`, 2], // 1.499999 = 2
      [`15${'0'.repeat(31)}0`, 3], // 1.500000 = 3
      [`15${'0'.repeat(31)}1`, 3], // 1.500001 = 3
      [`19${'9'.repeat(31)}9`, 3], // 1.999999 = 3

      [`20${'0'.repeat(31)}0`, 4], // 2.00000 = 4
    ]) {
      let price = await dex.price(
        amountAlice,
        offerAmountAlice,
        offerAmountBob
      );
      // console.log(`${amountAlice} ${amountBob} = ${price}`)
      expect(
        await dex.price(amountAlice, offerAmountAlice, offerAmountBob),
        `${amountAlice} ${amountBob} = ${price}`
      ).equal(amountBob);
    }
  });
  it('should correctly calculate price for small alice and big bob', async () => {
    let { owner, alice, bob, dex } = await prepareEnvironment();

    const _000_ = '0'.repeat(31);
    const _999_ = '9'.repeat(31);

    let offerAmountAlice = 2;
    let offerAmountBob = `10${_000_}0`;
    for (let [amountAlice, amountBob] of [
      [0, 0],
      [1, `5${_000_}0`],
      [2, `10${_000_}0`],
      [3, `15${_000_}0`],
      [5, `25${_000_}0`],
      [10, `50${_000_}0`],

      [`1${_000_}`, `5${_000_}${_000_}0`],
      [`2${_000_}`, `10${_000_}${_000_}0`],
      [`1${_999_}`, `${_999_}5${_000_}0`],
    ]) {
      let price = await dex.price(
        amountAlice,
        offerAmountAlice,
        offerAmountBob
      );
      // console.log(`${amountAlice} ${amountBob} = ${price}`)
      expect(
        await dex.price(amountAlice, offerAmountAlice, offerAmountBob),
        `${amountAlice} ${amountBob} = ${price}`
      ).equal(amountBob);
    }
  });
  it('should correctly calculate price for equally small alice and bob', async () => {
    let { owner, alice, bob, dex } = await prepareEnvironment();

    const _000_ = '0'.repeat(31);
    const _999_ = '9'.repeat(31);
    const THREES = '3'.repeat(31);

    let offerAmountAlice = 1;
    let offerAmountBob = 1;
    for (let [amountAlice, amountBob] of [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
      [5, 5],
      [10, 10],

      [`1${_000_}`, `1${_000_}`],
      [`2${_000_}`, `2${_000_}`],
      [`1${_999_}`, `1${_999_}`],
      [`5${_000_}${_000_}0`, `5${_000_}${_000_}0`],
      [`10${_000_}${_000_}0`, `10${_000_}${_000_}0`],
      [`${_999_}5${_000_}0`, `${_999_}5${_000_}0`],
      [
        '999991465593435680596738785309628',
        '999991465593435680596738785309628',
      ],
      [
        '1999982931186871361193477570619256',
        '1999982931186871361193477570619256',
      ],
    ]) {
      let price = await dex.price(
        amountAlice,
        offerAmountAlice,
        offerAmountBob
      );
      // console.log(`${amountAlice} ${amountBob} = ${price}`)
      expect(
        await dex.price(amountAlice, offerAmountAlice, offerAmountBob),
        `${amountAlice} ${amountBob} = ${price}`
      ).equal(amountBob);
    }
  });
  it('should correctly calculate price for equally big alice and bob', async () => {
    let { owner, alice, bob, dex } = await prepareEnvironment();

    const _000_ = '0'.repeat(31);
    const _999_ = '9'.repeat(31);
    const THREES = '3'.repeat(31);

    let offerAmountAlice = `1${_000_}0`;
    let offerAmountBob = `1${_000_}0`;
    for (let [amountAlice, amountBob] of [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
      [5, 5],
      [10, 10],

      [`1${_000_}`, `1${_000_}`],
      [`2${_000_}`, `2${_000_}`],
      [`1${_999_}`, `1${_999_}`],
      [`5${_000_}${_000_}0`, `5${_000_}${_000_}0`],
      [`10${_000_}${_000_}0`, `10${_000_}${_000_}0`],
      [`${_999_}5${_000_}0`, `${_999_}5${_000_}0`],
      [
        '999991465593435680596738785309628',
        '999991465593435680596738785309628',
      ],
      [
        '1999982931186871361193477570619256',
        '1999982931186871361193477570619256',
      ],
    ]) {
      let price = await dex.price(
        amountAlice,
        offerAmountAlice,
        offerAmountBob
      );
      // console.log(`${amountAlice} ${amountBob} = ${price}`)
      expect(
        await dex.price(amountAlice, offerAmountAlice, offerAmountBob),
        `${amountAlice} ${amountBob} = ${price}`
      ).equal(amountBob);
    }
  });
  it('should correctly calculate price for big alice and bob (a > b)', async () => {
    let { owner, alice, bob, dex } = await prepareEnvironment();

    const _000_ = '0'.repeat(31);
    const _999_ = '9'.repeat(31);
    const THREES = '3'.repeat(31);

    let offerAmountAlice = `20${_000_}0`;
    let offerAmountBob = `10${_000_}0`;
    for (let [amountAlice, amountBob] of [
      [0, 0],
      [1, 0],
      [2, 1],
      [3, 1],
      [5, 2],
      [10, 5],

      [`9${_999_}9`, `4${_999_}9`],
      [`10${_000_}0`, `5${_000_}0`],
      [`10${_000_}9`, `5${_000_}4`],

      [`110${_000_}`, `55${_000_}`],
      [`109${_999_}`, `54${_999_}`],

      [`10${_000_}${_000_}0`, `5${_000_}${_000_}0`],

      [
        '1999982931186871361193477570619256',
        '999991465593435680596738785309628',
      ],
      [
        '1999982931186871361193477570619255',
        '999991465593435680596738785309627',
      ],
    ]) {
      let price = await dex.price(
        amountAlice,
        offerAmountAlice,
        offerAmountBob
      );
      // console.log(`${amountAlice} ${amountBob} = ${price}`)
      expect(
        await dex.price(amountAlice, offerAmountAlice, offerAmountBob),
        `${amountAlice} ${amountBob} = ${price}`
      ).equal(amountBob);
    }
  });
  it('should correctly calculate price for big alice and bob (a < b)', async () => {
    let { owner, alice, bob, dex } = await prepareEnvironment();

    const _000_ = '0'.repeat(31);
    const _999_ = '9'.repeat(31);
    const THREES = '3'.repeat(31);

    let offerAmountAlice = `10${_000_}0`;
    let offerAmountBob = `20${_000_}0`;
    for (let [amountAlice, amountBob] of [
      [0, 0],
      [1, 2],
      [2, 4],
      [3, 6],
      [5, 10],
      [10, 20],

      [`9${_999_}9`, `19${_999_}8`],
      [`10${_000_}0`, `20${_000_}0`],
      [`10${_000_}0`, `20${_000_}0`],
      [`10${_000_}1`, `20${_000_}2`],
      [`10${_000_}09`, `20${_000_}18`],

      [`10${_000_}${_000_}0`, `20${_000_}${_000_}0`],

      [
        '999991465593435680596738785309628',
        '1999982931186871361193477570619256',
      ],
      [
        '999991465593435680596738785309627',
        '1999982931186871361193477570619254',
      ],
    ]) {
      let price = await dex.price(
        amountAlice,
        offerAmountAlice,
        offerAmountBob
      );
      // console.log(`${amountAlice} ${amountBob} = ${price}`)
      expect(
        await dex.price(amountAlice, offerAmountAlice, offerAmountBob),
        `${amountAlice} ${amountBob} = ${price}`
      ).equal(amountBob);
    }
  });
});
