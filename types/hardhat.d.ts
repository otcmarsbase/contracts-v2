/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "DAI",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DAI__factory>;
    getContractFactory(
      name: "EPICCoin",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.EPICCoin__factory>;
    getContractFactory(
      name: "MarsBase",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MarsBase__factory>;
    getContractFactory(
      name: "MarsBaseExchange",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MarsBaseExchange__factory>;
    getContractFactory(
      name: "TestToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestToken__factory>;
    getContractFactory(
      name: "USDT",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.USDT__factory>;
    getContractFactory(
      name: "BasicToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BasicToken__factory>;
    getContractFactory(
      name: "BlackList",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BlackList__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "ERC20Basic",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Basic__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "Pausable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Pausable__factory>;
    getContractFactory(
      name: "StandardToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.StandardToken__factory>;
    getContractFactory(
      name: "TetherToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TetherToken__factory>;
    getContractFactory(
      name: "UpgradedStandardToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UpgradedStandardToken__factory>;

    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "DAI",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DAI>;
    getContractAt(
      name: "EPICCoin",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.EPICCoin>;
    getContractAt(
      name: "MarsBase",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MarsBase>;
    getContractAt(
      name: "MarsBaseExchange",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MarsBaseExchange>;
    getContractAt(
      name: "TestToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TestToken>;
    getContractAt(
      name: "USDT",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.USDT>;
    getContractAt(
      name: "BasicToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.BasicToken>;
    getContractAt(
      name: "BlackList",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.BlackList>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "ERC20Basic",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Basic>;
    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "Pausable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Pausable>;
    getContractAt(
      name: "StandardToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.StandardToken>;
    getContractAt(
      name: "TetherToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TetherToken>;
    getContractAt(
      name: "UpgradedStandardToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UpgradedStandardToken>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
