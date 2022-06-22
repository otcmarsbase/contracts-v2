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
} from "../types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type BidCancelled = ContractEventLog<{
  offerId: string;
  sender: string;
  blockTimestamp: string;
  0: string;
  1: string;
  2: string;
}>;
export type ContractMigrated = ContractEventLog<{}>;
export type Log = ContractEventLog<{
  log: string;
  0: string;
}>;
export type OfferAccepted = ContractEventLog<{
  offerId: string;
  sender: string;
  blockTimestamp: string;
  amountAliceReceived: string;
  amountBobReceived: string;
  tokenAddressAlice: string;
  tokenAddressBob: string;
  offerType: string;
  feeAlice: string;
  feeBob: string;
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
}>;
export type OfferCancelled = ContractEventLog<{
  offerId: string;
  sender: string;
  blockTimestamp: string;
  0: string;
  1: string;
  2: string;
}>;
export type OfferClosed = ContractEventLog<{
  offerId: string;
  reason: string;
  blockTimestamp: string;
  0: string;
  1: string;
  2: string;
}>;
export type OfferCreated = ContractEventLog<{
  offerId: string;
  sender: string;
  blockTimestamp: string;
  offer: [
    boolean,
    boolean,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    boolean[],
    string[],
    string[],
    string[],
    string[],
    string[],
    string[]
  ];
  0: string;
  1: string;
  2: string;
  3: [
    boolean,
    boolean,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    boolean[],
    string[],
    string[],
    string[],
    string[],
    string[],
    string[]
  ];
}>;
export type OfferModified = ContractEventLog<{
  offerId: string;
  sender: string;
  blockTimestamp: string;
  offerParameters: [
    boolean,
    boolean,
    boolean,
    string,
    string,
    string,
    string,
    string
  ];
  0: string;
  1: string;
  2: string;
  3: [boolean, boolean, boolean, string, string, string, string, string];
}>;

export interface MarsBaseExchangeOld extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): MarsBaseExchangeOld;
  clone(): MarsBaseExchangeOld;
  methods: {
    acceptOffer(
      offerId: number | string | BN,
      tokenBob: string,
      amountBob: number | string | BN
    ): PayableTransactionObject<void>;

    cancelBid(offerId: number | string | BN): NonPayableTransactionObject<void>;

    cancelExpiredOffers(): PayableTransactionObject<void>;

    cancelOffer(
      offerId: number | string | BN
    ): NonPayableTransactionObject<void>;

    cancelOffers(
      from: number | string | BN,
      to: number | string | BN
    ): PayableTransactionObject<void>;

    changeOfferParams(
      offerId: number | string | BN,
      tokenBob: string[],
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

    getAllOffers(): NonPayableTransactionObject<
      [
        boolean,
        boolean,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        boolean[],
        string[],
        string[],
        string[],
        string[],
        string[],
        string[]
      ][]
    >;

    getMinimumFee(): NonPayableTransactionObject<string>;

    getNextOfferId(): NonPayableTransactionObject<string>;

    getOffer(
      offerId: number | string | BN
    ): NonPayableTransactionObject<
      [
        boolean,
        boolean,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        boolean[],
        string[],
        string[],
        string[],
        string[],
        string[],
        string[]
      ]
    >;

    getOwner(): NonPayableTransactionObject<string>;

    lockContract(): NonPayableTransactionObject<void>;

    migrateContract(): PayableTransactionObject<void>;

    offers(arg0: number | string | BN): NonPayableTransactionObject<{
      active: boolean;
      minimumMet: boolean;
      offerType: string;
      offerId: string;
      amountAlice: string;
      feeAlice: string;
      feeBob: string;
      smallestChunkSize: string;
      minimumSize: string;
      deadline: string;
      amountRemaining: string;
      offerer: string;
      payoutAddress: string;
      tokenAlice: string;
      0: boolean;
      1: boolean;
      2: string;
      3: string;
      4: string;
      5: string;
      6: string;
      7: string;
      8: string;
      9: string;
      10: string;
      11: string;
      12: string;
      13: string;
    }>;

    price(
      amountAlice: number | string | BN,
      offerAmountAlice: number | string | BN,
      offerAmountBob: number | string | BN
    ): NonPayableTransactionObject<string>;

    setCommissionAddress(wallet: string): NonPayableTransactionObject<void>;

    setExchangerAddress(
      exchangeContract: string
    ): NonPayableTransactionObject<void>;

    setMinimumFee(
      _minimumFee: number | string | BN
    ): NonPayableTransactionObject<void>;

    setNextOfferId(
      _nextOfferId: number | string | BN
    ): NonPayableTransactionObject<void>;
  };
  events: {
    BidCancelled(cb?: Callback<BidCancelled>): EventEmitter;
    BidCancelled(
      options?: EventOptions,
      cb?: Callback<BidCancelled>
    ): EventEmitter;

    ContractMigrated(cb?: Callback<ContractMigrated>): EventEmitter;
    ContractMigrated(
      options?: EventOptions,
      cb?: Callback<ContractMigrated>
    ): EventEmitter;

    Log(cb?: Callback<Log>): EventEmitter;
    Log(options?: EventOptions, cb?: Callback<Log>): EventEmitter;

    OfferAccepted(cb?: Callback<OfferAccepted>): EventEmitter;
    OfferAccepted(
      options?: EventOptions,
      cb?: Callback<OfferAccepted>
    ): EventEmitter;

    OfferCancelled(cb?: Callback<OfferCancelled>): EventEmitter;
    OfferCancelled(
      options?: EventOptions,
      cb?: Callback<OfferCancelled>
    ): EventEmitter;

    OfferClosed(cb?: Callback<OfferClosed>): EventEmitter;
    OfferClosed(
      options?: EventOptions,
      cb?: Callback<OfferClosed>
    ): EventEmitter;

    OfferCreated(cb?: Callback<OfferCreated>): EventEmitter;
    OfferCreated(
      options?: EventOptions,
      cb?: Callback<OfferCreated>
    ): EventEmitter;

    OfferModified(cb?: Callback<OfferModified>): EventEmitter;
    OfferModified(
      options?: EventOptions,
      cb?: Callback<OfferModified>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "BidCancelled", cb: Callback<BidCancelled>): void;
  once(
    event: "BidCancelled",
    options: EventOptions,
    cb: Callback<BidCancelled>
  ): void;

  once(event: "ContractMigrated", cb: Callback<ContractMigrated>): void;
  once(
    event: "ContractMigrated",
    options: EventOptions,
    cb: Callback<ContractMigrated>
  ): void;

  once(event: "Log", cb: Callback<Log>): void;
  once(event: "Log", options: EventOptions, cb: Callback<Log>): void;

  once(event: "OfferAccepted", cb: Callback<OfferAccepted>): void;
  once(
    event: "OfferAccepted",
    options: EventOptions,
    cb: Callback<OfferAccepted>
  ): void;

  once(event: "OfferCancelled", cb: Callback<OfferCancelled>): void;
  once(
    event: "OfferCancelled",
    options: EventOptions,
    cb: Callback<OfferCancelled>
  ): void;

  once(event: "OfferClosed", cb: Callback<OfferClosed>): void;
  once(
    event: "OfferClosed",
    options: EventOptions,
    cb: Callback<OfferClosed>
  ): void;

  once(event: "OfferCreated", cb: Callback<OfferCreated>): void;
  once(
    event: "OfferCreated",
    options: EventOptions,
    cb: Callback<OfferCreated>
  ): void;

  once(event: "OfferModified", cb: Callback<OfferModified>): void;
  once(
    event: "OfferModified",
    options: EventOptions,
    cb: Callback<OfferModified>
  ): void;
}
