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
import {FunctionFragment, Result, EventFragment} from "@ethersproject/abi";
import {Listener, Provider} from "@ethersproject/providers";
import {TypedEventFilter, TypedEvent, TypedListener, OnEvent} from "./common";

export interface TetherTokenInterface extends utils.Interface {
  contractName: "TetherToken";
  functions: {
    "MAX_UINT()": FunctionFragment;
    "_totalSupply()": FunctionFragment;
    "addBlackList(address)": FunctionFragment;
    "allowance(address,address)": FunctionFragment;
    "allowed(address,address)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "balances(address)": FunctionFragment;
    "basisPointsRate()": FunctionFragment;
    "decimals()": FunctionFragment;
    "deprecate(address)": FunctionFragment;
    "deprecated()": FunctionFragment;
    "destroyBlackFunds(address)": FunctionFragment;
    "getBlackListStatus(address)": FunctionFragment;
    "getOwner()": FunctionFragment;
    "isBlackListed(address)": FunctionFragment;
    "issue(uint256)": FunctionFragment;
    "maximumFee()": FunctionFragment;
    "name()": FunctionFragment;
    "owner()": FunctionFragment;
    "pause()": FunctionFragment;
    "paused()": FunctionFragment;
    "redeem(uint256)": FunctionFragment;
    "removeBlackList(address)": FunctionFragment;
    "setParams(uint256,uint256)": FunctionFragment;
    "symbol()": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transfer(address,uint256)": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "unpause()": FunctionFragment;
    "upgradedAddress()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "MAX_UINT", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "_totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "addBlackList",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "allowance",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "allowed",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(functionFragment: "balances", values: [string]): string;
  encodeFunctionData(
    functionFragment: "basisPointsRate",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(functionFragment: "deprecate", values: [string]): string;
  encodeFunctionData(
    functionFragment: "deprecated",
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
  encodeFunctionData(functionFragment: "issue", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "maximumFee",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "redeem",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "removeBlackList",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setParams",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transfer",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "upgradedAddress",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "MAX_UINT", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "_totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addBlackList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "allowed", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balances", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "basisPointsRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deprecate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deprecated", data: BytesLike): Result;
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
  decodeFunctionResult(functionFragment: "issue", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "maximumFee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redeem", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeBlackList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setParams", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "upgradedAddress",
    data: BytesLike
  ): Result;

  events: {
    "AddedBlackList(address)": EventFragment;
    "Approval(address,address,uint256)": EventFragment;
    "Deprecate(address)": EventFragment;
    "DestroyedBlackFunds(address,uint256)": EventFragment;
    "Issue(uint256)": EventFragment;
    "Params(uint256,uint256)": EventFragment;
    "Pause()": EventFragment;
    "Redeem(uint256)": EventFragment;
    "RemovedBlackList(address)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
    "Unpause()": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AddedBlackList"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Deprecate"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DestroyedBlackFunds"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Issue"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Params"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Pause"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Redeem"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RemovedBlackList"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unpause"): EventFragment;
}

export type AddedBlackListEvent = TypedEvent<[string], {_user: string}>;

export type AddedBlackListEventFilter = TypedEventFilter<AddedBlackListEvent>;

export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber],
  {owner: string; spender: string; value: BigNumber}
>;

export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;

export type DeprecateEvent = TypedEvent<[string], {newAddress: string}>;

export type DeprecateEventFilter = TypedEventFilter<DeprecateEvent>;

export type DestroyedBlackFundsEvent = TypedEvent<
  [string, BigNumber],
  {_blackListedUser: string; _balance: BigNumber}
>;

export type DestroyedBlackFundsEventFilter =
  TypedEventFilter<DestroyedBlackFundsEvent>;

export type IssueEvent = TypedEvent<[BigNumber], {amount: BigNumber}>;

export type IssueEventFilter = TypedEventFilter<IssueEvent>;

export type ParamsEvent = TypedEvent<
  [BigNumber, BigNumber],
  {feeBasisPoints: BigNumber; maxFee: BigNumber}
>;

export type ParamsEventFilter = TypedEventFilter<ParamsEvent>;

export type PauseEvent = TypedEvent<[], {}>;

export type PauseEventFilter = TypedEventFilter<PauseEvent>;

export type RedeemEvent = TypedEvent<[BigNumber], {amount: BigNumber}>;

export type RedeemEventFilter = TypedEventFilter<RedeemEvent>;

export type RemovedBlackListEvent = TypedEvent<[string], {_user: string}>;

export type RemovedBlackListEventFilter =
  TypedEventFilter<RemovedBlackListEvent>;

export type TransferEvent = TypedEvent<
  [string, string, BigNumber],
  {from: string; to: string; value: BigNumber}
>;

export type TransferEventFilter = TypedEventFilter<TransferEvent>;

export type UnpauseEvent = TypedEvent<[], {}>;

export type UnpauseEventFilter = TypedEventFilter<UnpauseEvent>;

export interface TetherToken extends BaseContract {
  contractName: "TetherToken";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TetherTokenInterface;

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
    MAX_UINT(overrides?: CallOverrides): Promise<[BigNumber]>;

    _totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    addBlackList(
      _evilUser: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<ContractTransaction>;

    allowance(
      _owner: string,
      _spender: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<ContractTransaction>;

    allowed(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    approve(
      _spender: string,
      _value: BigNumberish,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<ContractTransaction>;

    balanceOf(
      who: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<ContractTransaction>;

    balances(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    basisPointsRate(overrides?: CallOverrides): Promise<[BigNumber]>;

    decimals(overrides?: CallOverrides): Promise<[BigNumber]>;

    deprecate(
      _upgradedAddress: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<ContractTransaction>;

    deprecated(overrides?: CallOverrides): Promise<[boolean]>;

    destroyBlackFunds(
      _blackListedUser: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<ContractTransaction>;

    getBlackListStatus(
      _maker: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<ContractTransaction>;

    getOwner(
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<ContractTransaction>;

    isBlackListed(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    issue(
      amount: BigNumberish,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<ContractTransaction>;

    maximumFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    name(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    pause(
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<ContractTransaction>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    redeem(
      amount: BigNumberish,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<ContractTransaction>;

    removeBlackList(
      _clearedUser: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<ContractTransaction>;

    setParams(
      newBasisPoints: BigNumberish,
      newMaxFee: BigNumberish,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<ContractTransaction>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    totalSupply(
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<ContractTransaction>;

    transfer(
      _to: string,
      _value: BigNumberish,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<ContractTransaction>;

    transferFrom(
      _from: string,
      _to: string,
      _value: BigNumberish,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<ContractTransaction>;

    unpause(
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<ContractTransaction>;

    upgradedAddress(overrides?: CallOverrides): Promise<[string]>;
  };

  MAX_UINT(overrides?: CallOverrides): Promise<BigNumber>;

  _totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  addBlackList(
    _evilUser: string,
    overrides?: Overrides & {from?: string | Promise<string>}
  ): Promise<ContractTransaction>;

  allowance(
    _owner: string,
    _spender: string,
    overrides?: Overrides & {from?: string | Promise<string>}
  ): Promise<ContractTransaction>;

  allowed(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  approve(
    _spender: string,
    _value: BigNumberish,
    overrides?: Overrides & {from?: string | Promise<string>}
  ): Promise<ContractTransaction>;

  balanceOf(
    who: string,
    overrides?: Overrides & {from?: string | Promise<string>}
  ): Promise<ContractTransaction>;

  balances(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  basisPointsRate(overrides?: CallOverrides): Promise<BigNumber>;

  decimals(overrides?: CallOverrides): Promise<BigNumber>;

  deprecate(
    _upgradedAddress: string,
    overrides?: Overrides & {from?: string | Promise<string>}
  ): Promise<ContractTransaction>;

  deprecated(overrides?: CallOverrides): Promise<boolean>;

  destroyBlackFunds(
    _blackListedUser: string,
    overrides?: Overrides & {from?: string | Promise<string>}
  ): Promise<ContractTransaction>;

  getBlackListStatus(
    _maker: string,
    overrides?: Overrides & {from?: string | Promise<string>}
  ): Promise<ContractTransaction>;

  getOwner(
    overrides?: Overrides & {from?: string | Promise<string>}
  ): Promise<ContractTransaction>;

  isBlackListed(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  issue(
    amount: BigNumberish,
    overrides?: Overrides & {from?: string | Promise<string>}
  ): Promise<ContractTransaction>;

  maximumFee(overrides?: CallOverrides): Promise<BigNumber>;

  name(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  pause(
    overrides?: Overrides & {from?: string | Promise<string>}
  ): Promise<ContractTransaction>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  redeem(
    amount: BigNumberish,
    overrides?: Overrides & {from?: string | Promise<string>}
  ): Promise<ContractTransaction>;

  removeBlackList(
    _clearedUser: string,
    overrides?: Overrides & {from?: string | Promise<string>}
  ): Promise<ContractTransaction>;

  setParams(
    newBasisPoints: BigNumberish,
    newMaxFee: BigNumberish,
    overrides?: Overrides & {from?: string | Promise<string>}
  ): Promise<ContractTransaction>;

  symbol(overrides?: CallOverrides): Promise<string>;

  totalSupply(
    overrides?: Overrides & {from?: string | Promise<string>}
  ): Promise<ContractTransaction>;

  transfer(
    _to: string,
    _value: BigNumberish,
    overrides?: Overrides & {from?: string | Promise<string>}
  ): Promise<ContractTransaction>;

  transferFrom(
    _from: string,
    _to: string,
    _value: BigNumberish,
    overrides?: Overrides & {from?: string | Promise<string>}
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & {from?: string | Promise<string>}
  ): Promise<ContractTransaction>;

  unpause(
    overrides?: Overrides & {from?: string | Promise<string>}
  ): Promise<ContractTransaction>;

  upgradedAddress(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    MAX_UINT(overrides?: CallOverrides): Promise<BigNumber>;

    _totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    addBlackList(_evilUser: string, overrides?: CallOverrides): Promise<void>;

    allowance(
      _owner: string,
      _spender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    allowed(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      _spender: string,
      _value: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    balanceOf(who: string, overrides?: CallOverrides): Promise<BigNumber>;

    balances(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    basisPointsRate(overrides?: CallOverrides): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    deprecate(
      _upgradedAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    deprecated(overrides?: CallOverrides): Promise<boolean>;

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

    issue(amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    maximumFee(overrides?: CallOverrides): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    pause(overrides?: CallOverrides): Promise<void>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    redeem(amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    removeBlackList(
      _clearedUser: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setParams(
      newBasisPoints: BigNumberish,
      newMaxFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    symbol(overrides?: CallOverrides): Promise<string>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
      _to: string,
      _value: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    transferFrom(
      _from: string,
      _to: string,
      _value: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    unpause(overrides?: CallOverrides): Promise<void>;

    upgradedAddress(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "AddedBlackList(address)"(_user?: null): AddedBlackListEventFilter;
    AddedBlackList(_user?: null): AddedBlackListEventFilter;

    "Approval(address,address,uint256)"(
      owner?: string | null,
      spender?: string | null,
      value?: null
    ): ApprovalEventFilter;
    Approval(
      owner?: string | null,
      spender?: string | null,
      value?: null
    ): ApprovalEventFilter;

    "Deprecate(address)"(newAddress?: null): DeprecateEventFilter;
    Deprecate(newAddress?: null): DeprecateEventFilter;

    "DestroyedBlackFunds(address,uint256)"(
      _blackListedUser?: null,
      _balance?: null
    ): DestroyedBlackFundsEventFilter;
    DestroyedBlackFunds(
      _blackListedUser?: null,
      _balance?: null
    ): DestroyedBlackFundsEventFilter;

    "Issue(uint256)"(amount?: null): IssueEventFilter;
    Issue(amount?: null): IssueEventFilter;

    "Params(uint256,uint256)"(
      feeBasisPoints?: null,
      maxFee?: null
    ): ParamsEventFilter;
    Params(feeBasisPoints?: null, maxFee?: null): ParamsEventFilter;

    "Pause()"(): PauseEventFilter;
    Pause(): PauseEventFilter;

    "Redeem(uint256)"(amount?: null): RedeemEventFilter;
    Redeem(amount?: null): RedeemEventFilter;

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

    "Unpause()"(): UnpauseEventFilter;
    Unpause(): UnpauseEventFilter;
  };

  estimateGas: {
    MAX_UINT(overrides?: CallOverrides): Promise<BigNumber>;

    _totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    addBlackList(
      _evilUser: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<BigNumber>;

    allowance(
      _owner: string,
      _spender: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<BigNumber>;

    allowed(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      _spender: string,
      _value: BigNumberish,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<BigNumber>;

    balanceOf(
      who: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<BigNumber>;

    balances(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    basisPointsRate(overrides?: CallOverrides): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    deprecate(
      _upgradedAddress: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<BigNumber>;

    deprecated(overrides?: CallOverrides): Promise<BigNumber>;

    destroyBlackFunds(
      _blackListedUser: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<BigNumber>;

    getBlackListStatus(
      _maker: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<BigNumber>;

    getOwner(
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<BigNumber>;

    isBlackListed(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    issue(
      amount: BigNumberish,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<BigNumber>;

    maximumFee(overrides?: CallOverrides): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    pause(
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    redeem(
      amount: BigNumberish,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<BigNumber>;

    removeBlackList(
      _clearedUser: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<BigNumber>;

    setParams(
      newBasisPoints: BigNumberish,
      newMaxFee: BigNumberish,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<BigNumber>;

    transfer(
      _to: string,
      _value: BigNumberish,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<BigNumber>;

    transferFrom(
      _from: string,
      _to: string,
      _value: BigNumberish,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<BigNumber>;

    unpause(
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<BigNumber>;

    upgradedAddress(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    MAX_UINT(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    _totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    addBlackList(
      _evilUser: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<PopulatedTransaction>;

    allowance(
      _owner: string,
      _spender: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<PopulatedTransaction>;

    allowed(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    approve(
      _spender: string,
      _value: BigNumberish,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<PopulatedTransaction>;

    balanceOf(
      who: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<PopulatedTransaction>;

    balances(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    basisPointsRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deprecate(
      _upgradedAddress: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<PopulatedTransaction>;

    deprecated(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    destroyBlackFunds(
      _blackListedUser: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<PopulatedTransaction>;

    getBlackListStatus(
      _maker: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<PopulatedTransaction>;

    getOwner(
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<PopulatedTransaction>;

    isBlackListed(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    issue(
      amount: BigNumberish,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<PopulatedTransaction>;

    maximumFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pause(
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    redeem(
      amount: BigNumberish,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<PopulatedTransaction>;

    removeBlackList(
      _clearedUser: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<PopulatedTransaction>;

    setParams(
      newBasisPoints: BigNumberish,
      newMaxFee: BigNumberish,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupply(
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<PopulatedTransaction>;

    transfer(
      _to: string,
      _value: BigNumberish,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<PopulatedTransaction>;

    transferFrom(
      _from: string,
      _to: string,
      _value: BigNumberish,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<PopulatedTransaction>;

    unpause(
      overrides?: Overrides & {from?: string | Promise<string>}
    ): Promise<PopulatedTransaction>;

    upgradedAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
