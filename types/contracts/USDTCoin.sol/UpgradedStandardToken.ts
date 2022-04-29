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
} from "../../types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type Approval = ContractEventLog<{
  owner: string;
  spender: string;
  value: string;
  0: string;
  1: string;
  2: string;
}>;
export type Transfer = ContractEventLog<{
  from: string;
  to: string;
  value: string;
  0: string;
  1: string;
  2: string;
}>;

export interface UpgradedStandardToken extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): UpgradedStandardToken;
  clone(): UpgradedStandardToken;
  methods: {
    MAX_UINT(): NonPayableTransactionObject<string>;

    _totalSupply(): NonPayableTransactionObject<string>;

    allowance(
      _owner: string,
      _spender: string
    ): NonPayableTransactionObject<string>;

    allowed(arg0: string, arg1: string): NonPayableTransactionObject<string>;

    approve(
      _spender: string,
      _value: number | string | BN
    ): NonPayableTransactionObject<void>;

    approveByLegacy(
      from: string,
      spender: string,
      value: number | string | BN
    ): NonPayableTransactionObject<void>;

    balanceOf(_owner: string): NonPayableTransactionObject<string>;

    balances(arg0: string): NonPayableTransactionObject<string>;

    basisPointsRate(): NonPayableTransactionObject<string>;

    maximumFee(): NonPayableTransactionObject<string>;

    owner(): NonPayableTransactionObject<string>;

    totalSupply(): NonPayableTransactionObject<string>;

    transfer(
      _to: string,
      _value: number | string | BN
    ): NonPayableTransactionObject<void>;

    transferByLegacy(
      from: string,
      to: string,
      value: number | string | BN
    ): NonPayableTransactionObject<void>;

    transferFrom(
      _from: string,
      _to: string,
      _value: number | string | BN
    ): NonPayableTransactionObject<void>;

    transferFromByLegacy(
      sender: string,
      from: string,
      spender: string,
      value: number | string | BN
    ): NonPayableTransactionObject<void>;

    transferOwnership(newOwner: string): NonPayableTransactionObject<void>;
  };
  events: {
    Approval(cb?: Callback<Approval>): EventEmitter;
    Approval(options?: EventOptions, cb?: Callback<Approval>): EventEmitter;

    Transfer(cb?: Callback<Transfer>): EventEmitter;
    Transfer(options?: EventOptions, cb?: Callback<Transfer>): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "Approval", cb: Callback<Approval>): void;
  once(event: "Approval", options: EventOptions, cb: Callback<Approval>): void;

  once(event: "Transfer", cb: Callback<Transfer>): void;
  once(event: "Transfer", options: EventOptions, cb: Callback<Transfer>): void;
}
