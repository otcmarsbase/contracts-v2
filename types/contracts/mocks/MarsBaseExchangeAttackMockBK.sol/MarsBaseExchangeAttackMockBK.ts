/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type BN from "bn.js";
import type { ContractOptions } from "web3-eth-contract";
import type { EventLog } from "web3-core";
import type { EventEmitter } from "events";
import type {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "../../../types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type OwnershipTransferred = ContractEventLog<{
  previousOwner: string;
  newOwner: string;
  0: string;
  1: string;
}>;

export interface MarsBaseExchangeAttackMockBK extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): MarsBaseExchangeAttackMockBK;
  clone(): MarsBaseExchangeAttackMockBK;
  methods: {
    acceptOffer(
      offerId: number | string | BN,
      tokenBob: string,
      amountBob: number | string | BN
    ): PayableTransactionObject<void>;

    approve(
      token: string,
      spender: string,
      amount: number | string | BN
    ): NonPayableTransactionObject<void>;

    approveUSDT(
      token: string,
      spender: string,
      amount: number | string | BN
    ): NonPayableTransactionObject<void>;

    changeOwner(newOwner: string): NonPayableTransactionObject<void>;

    createOffer(
      tokenAlice: string,
      tokenBob: string[],
      amountAlice: number | string | BN,
      amountBob: (number | string | BN)[],
      offerParameters: [
        boolean,
        boolean,
        boolean,
        number | string | BN,
        number | string | BN,
        number | string | BN,
        number | string | BN,
        number | string | BN
      ]
    ): PayableTransactionObject<void>;

    exchange(): NonPayableTransactionObject<string>;

    exploit(offerId: number | string | BN): PayableTransactionObject<void>;

    owner(): NonPayableTransactionObject<string>;

    renounceOwnership(): NonPayableTransactionObject<void>;

    transferOwnership(newOwner: string): NonPayableTransactionObject<void>;
  };
  events: {
    OwnershipTransferred(cb?: Callback<OwnershipTransferred>): EventEmitter;
    OwnershipTransferred(
      options?: EventOptions,
      cb?: Callback<OwnershipTransferred>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "OwnershipTransferred", cb: Callback<OwnershipTransferred>): void;
  once(
    event: "OwnershipTransferred",
    options: EventOptions,
    cb: Callback<OwnershipTransferred>
  ): void;
}
