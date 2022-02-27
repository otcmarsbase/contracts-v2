/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Pausable, PausableInterface } from "../Pausable";

const _abi = [
  {
    anonymous: false,
    inputs: [],
    name: "Pause",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "Unpause",
    type: "event",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040526000805460ff60a01b1916905534801561001d57600080fd5b50600080546001600160a01b0319163317905561024b8061003f6000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80633f4ba83a1461005c5780635c975abb146100665780638456cb591461008f5780638da5cb5b14610097578063f2fde38b146100c2575b600080fd5b6100646100d5565b005b60005461007a90600160a01b900460ff1681565b60405190151581526020015b60405180910390f35b610064610138565b6000546100aa906001600160a01b031681565b6040516001600160a01b039091168152602001610086565b6100646100d03660046101e7565b6101a2565b6000546001600160a01b031633146100ec57600080fd5b600054600160a01b900460ff1661010257600080fd5b6000805460ff60a01b191681556040517f7805862f689e2f13df9f062ff482ad3ad112aca9e0847911ed832e158c525b339190a1565b6000546001600160a01b0316331461014f57600080fd5b600054600160a01b900460ff161561016657600080fd5b6000805460ff60a01b1916600160a01b1781556040517f6985a02210a168e66602d3235cb6db0e70f92b3ba4d376a33c0f3d9434bff6259190a1565b6000546001600160a01b031633146101b957600080fd5b6001600160a01b038116156101e457600080546001600160a01b0319166001600160a01b0383161790555b50565b6000602082840312156101f8578081fd5b81356001600160a01b038116811461020e578182fd5b939250505056fea2646970667358221220d4a5e7af9fe27f407edc0d0ab0e72ca943504666c0faad47f880e19b5d00a29964736f6c63430008030033";

type PausableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PausableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Pausable__factory extends ContractFactory {
  constructor(...args: PausableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "Pausable";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Pausable> {
    return super.deploy(overrides || {}) as Promise<Pausable>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Pausable {
    return super.attach(address) as Pausable;
  }
  connect(signer: Signer): Pausable__factory {
    return super.connect(signer) as Pausable__factory;
  }
  static readonly contractName: "Pausable";
  public readonly contractName: "Pausable";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PausableInterface {
    return new utils.Interface(_abi) as PausableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Pausable {
    return new Contract(address, _abi, signerOrProvider) as Pausable;
  }
}
