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

export type Pause = ContractEventLog<{}>;
export type Unpause = ContractEventLog<{}>;

export interface Pausable extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): Pausable;
  clone(): Pausable;
  methods: {
    owner(): NonPayableTransactionObject<string>;

    pause(): NonPayableTransactionObject<void>;

    paused(): NonPayableTransactionObject<boolean>;

    transferOwnership(newOwner: string): NonPayableTransactionObject<void>;

    unpause(): NonPayableTransactionObject<void>;
  };
  events: {
    Pause(cb?: Callback<Pause>): EventEmitter;
    Pause(options?: EventOptions, cb?: Callback<Pause>): EventEmitter;

    Unpause(cb?: Callback<Unpause>): EventEmitter;
    Unpause(options?: EventOptions, cb?: Callback<Unpause>): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "Pause", cb: Callback<Pause>): void;
  once(event: "Pause", options: EventOptions, cb: Callback<Pause>): void;

  once(event: "Unpause", cb: Callback<Unpause>): void;
  once(event: "Unpause", options: EventOptions, cb: Callback<Unpause>): void;
}
