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

export type BidAccepted = ContractEventLog<{
  id: string;
  aliceAddress: string;
  aliceReceivedTotal: string;
  aliceFeeTotal: string;
  bobReceivedTotal: string;
  bobFeeTotal: string;
  offer: [
    boolean,
    string,
    string,
    [string, string, string[], string, string],
    string,
    string
  ];
  bid: [string, string, string, string, string];
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: [
    boolean,
    string,
    string,
    [string, string, string[], string, string],
    string,
    string
  ];
  7: [string, string, string, string, string];
}>;
export type BidCancelled = ContractEventLog<{
  offerId: string;
  bobAddress: string;
  tokenBob: string;
  reason: string;
  bidIdx: string;
  bidId: string;
  bid: [string, string, string, string, string];
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: [string, string, string, string, string];
}>;
export type BidCreated = ContractEventLog<{
  offerId: string;
  bobAddress: string;
  tokenBob: string;
  bidIdx: string;
  bidId: string;
  bid: [string, string, string, string, string];
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: [string, string, string, string, string];
}>;
export type OfferClosed = ContractEventLog<{
  id: string;
  aliceAddress: string;
  reason: string;
  offer: [
    boolean,
    string,
    string,
    [string, string, string[], string, string],
    string,
    string
  ];
  0: string;
  1: string;
  2: string;
  3: [
    boolean,
    string,
    string,
    [string, string, string[], string, string],
    string,
    string
  ];
}>;
export type OfferCreated = ContractEventLog<{
  id: string;
  aliceAddress: string;
  tokenAlice: string;
  params: [string, string, string[], string, string];
  0: string;
  1: string;
  2: string;
  3: [string, string, string[], string, string];
}>;

export interface IMarsbaseBestBid extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): IMarsbaseBestBid;
  clone(): IMarsbaseBestBid;
  methods: {
    acceptBid(
      offerId: number | string | BN,
      bidIdx: number | string | BN
    ): NonPayableTransactionObject<void>;

    cancelBid(
      offerId: number | string | BN,
      bidIdx: number | string | BN
    ): NonPayableTransactionObject<void>;

    cancelOffer(
      offerId: number | string | BN
    ): NonPayableTransactionObject<void>;

    createBid(
      offerId: number | string | BN,
      tokenBob: string,
      amountBob: number | string | BN
    ): PayableTransactionObject<void>;

    createOffer(
      offer: [
        string,
        number | string | BN,
        string[],
        number | string | BN,
        number | string | BN
      ]
    ): PayableTransactionObject<void>;

    getActiveOffers(): NonPayableTransactionObject<
      [
        boolean,
        string,
        string,
        [string, string, string[], string, string],
        string,
        string
      ][]
    >;
  };
  events: {
    BidAccepted(cb?: Callback<BidAccepted>): EventEmitter;
    BidAccepted(
      options?: EventOptions,
      cb?: Callback<BidAccepted>
    ): EventEmitter;

    BidCancelled(cb?: Callback<BidCancelled>): EventEmitter;
    BidCancelled(
      options?: EventOptions,
      cb?: Callback<BidCancelled>
    ): EventEmitter;

    BidCreated(cb?: Callback<BidCreated>): EventEmitter;
    BidCreated(options?: EventOptions, cb?: Callback<BidCreated>): EventEmitter;

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

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "BidAccepted", cb: Callback<BidAccepted>): void;
  once(
    event: "BidAccepted",
    options: EventOptions,
    cb: Callback<BidAccepted>
  ): void;

  once(event: "BidCancelled", cb: Callback<BidCancelled>): void;
  once(
    event: "BidCancelled",
    options: EventOptions,
    cb: Callback<BidCancelled>
  ): void;

  once(event: "BidCreated", cb: Callback<BidCreated>): void;
  once(
    event: "BidCreated",
    options: EventOptions,
    cb: Callback<BidCreated>
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
}
