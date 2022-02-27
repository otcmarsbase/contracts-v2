/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface BlackListInterface extends utils.Interface {
  contractName: "BlackList";
  functions: {
    "_totalSupply()": FunctionFragment;
    "addBlackList(address)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "balances(address)": FunctionFragment;
    "basisPointsRate()": FunctionFragment;
    "destroyBlackFunds(address)": FunctionFragment;
    "getBlackListStatus(address)": FunctionFragment;
    "getOwner()": FunctionFragment;
    "isBlackListed(address)": FunctionFragment;
    "maximumFee()": FunctionFragment;
    "owner()": FunctionFragment;
    "removeBlackList(address)": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transfer(address,uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "_totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "addBlackList",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(functionFragment: "balances", values: [string]): string;
  encodeFunctionData(
    functionFragment: "basisPointsRate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "destroyBlackFunds",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getBlackListStatus",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "getOwner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "isBlackListed",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "maximumFee",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "removeBlackList",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transfer",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "_totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addBlackList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balances", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "basisPointsRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "destroyBlackFunds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBlackListStatus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getOwner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isBlackListed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "maximumFee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeBlackList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "AddedBlackList(address)": EventFragment;
    "DestroyedBlackFunds(address,uint256)": EventFragment;
    "RemovedBlackList(address)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AddedBlackList"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DestroyedBlackFunds"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RemovedBlackList"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
}

export type AddedBlackListEvent = TypedEvent<[string], { _user: string }>;

export type AddedBlackListEventFilter = TypedEventFilter<AddedBlackListEvent>;

export type DestroyedBlackFundsEvent = TypedEvent<
  [string, BigNumber],
  { _blackListedUser: string; _balance: BigNumber }
>;

export type DestroyedBlackFundsEventFilter =
  TypedEventFilter<DestroyedBlackFundsEvent>;

export type RemovedBlackListEvent = TypedEvent<[string], { _user: string }>;

export type RemovedBlackListEventFilter =
  TypedEventFilter<RemovedBlackListEvent>;

export type TransferEvent = TypedEvent<
  [string, string, BigNumber],
  { from: string; to: string; value: BigNumber }
>;

export type TransferEventFilter = TypedEventFilter<TransferEvent>;

export interface BlackList extends BaseContract {
  contractName: "BlackList";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: BlackListInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    _totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    addBlackList(
      _evilUser: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    balanceOf(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    balances(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    basisPointsRate(overrides?: CallOverrides): Promise<[BigNumber]>;

    destroyBlackFunds(
      _blackListedUser: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getBlackListStatus(
      _maker: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getOwner(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isBlackListed(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    maximumFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    removeBlackList(
      _clearedUser: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    totalSupply(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transfer(
      _to: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  _totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  addBlackList(
    _evilUser: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  balanceOf(
    _owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  balances(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  basisPointsRate(overrides?: CallOverrides): Promise<BigNumber>;

  destroyBlackFunds(
    _blackListedUser: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getBlackListStatus(
    _maker: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getOwner(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isBlackListed(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  maximumFee(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  removeBlackList(
    _clearedUser: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  totalSupply(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transfer(
    _to: string,
    _value: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    _totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    addBlackList(_evilUser: string, overrides?: CallOverrides): Promise<void>;

    balanceOf(_owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    balances(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    basisPointsRate(overrides?: CallOverrides): Promise<BigNumber>;

    destroyBlackFunds(
      _blackListedUser: string,
      overrides?: CallOverrides
    ): Promise<void>;

    getBlackListStatus(
      _maker: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    getOwner(overrides?: CallOverrides): Promise<string>;

    isBlackListed(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    maximumFee(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    removeBlackList(
      _clearedUser: string,
      overrides?: CallOverrides
    ): Promise<void>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
      _to: string,
      _value: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "AddedBlackList(address)"(_user?: null): AddedBlackListEventFilter;
    AddedBlackList(_user?: null): AddedBlackListEventFilter;

    "DestroyedBlackFunds(address,uint256)"(
      _blackListedUser?: null,
      _balance?: null
    ): DestroyedBlackFundsEventFilter;
    DestroyedBlackFunds(
      _blackListedUser?: null,
      _balance?: null
    ): DestroyedBlackFundsEventFilter;

    "RemovedBlackList(address)"(_user?: null): RemovedBlackListEventFilter;
    RemovedBlackList(_user?: null): RemovedBlackListEventFilter;

    "Transfer(address,address,uint256)"(
      from?: string | null,
      to?: string | null,
      value?: null
    ): TransferEventFilter;
    Transfer(
      from?: string | null,
      to?: string | null,
      value?: null
    ): TransferEventFilter;
  };

  estimateGas: {
    _totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    addBlackList(
      _evilUser: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    balanceOf(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    balances(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    basisPointsRate(overrides?: CallOverrides): Promise<BigNumber>;

    destroyBlackFunds(
      _blackListedUser: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getBlackListStatus(
      _maker: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getOwner(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isBlackListed(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    maximumFee(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    removeBlackList(
      _clearedUser: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    totalSupply(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transfer(
      _to: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    _totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    addBlackList(
      _evilUser: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    balanceOf(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    balances(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    basisPointsRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    destroyBlackFunds(
      _blackListedUser: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getBlackListStatus(
      _maker: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getOwner(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isBlackListed(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    maximumFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    removeBlackList(
      _clearedUser: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    totalSupply(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transfer(
      _to: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
