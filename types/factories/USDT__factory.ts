/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { USDT, USDTInterface } from "../USDT";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604080518082018252600a8152692aa9a2102a32ba3432b960b11b6020808301918252835180850190945260048452631554d11560e21b9084015281519192916200006091600391620001a3565b50805162000076906004906020840190620001a3565b505050620000b0336200008e620000b660201b60201c565b6200009b90600a6200035e565b620000aa90620186a062000376565b620000bb565b620003f0565b601290565b6001600160a01b038216620001165760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640160405180910390fd5b80600260008282546200012a919062000398565b90915550506001600160a01b038216600090815260208190526040812080548392906200015990849062000398565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b828054620001b190620003b3565b90600052602060002090601f016020900481019282620001d5576000855562000220565b82601f10620001f057805160ff191683800117855562000220565b8280016001018555821562000220579182015b828111156200022057825182559160200191906001019062000203565b506200022e92915062000232565b5090565b5b808211156200022e576000815560010162000233565b634e487b7160e01b600052601160045260246000fd5b600181815b80851115620002a057816000190482111562000284576200028462000249565b808516156200029257918102915b93841c939080029062000264565b509250929050565b600082620002b95750600162000358565b81620002c85750600062000358565b8160018114620002e15760028114620002ec576200030c565b600191505062000358565b60ff84111562000300576200030062000249565b50506001821b62000358565b5060208310610133831016604e8410600b841016171562000331575081810a62000358565b6200033d83836200025f565b806000190482111562000354576200035462000249565b0290505b92915050565b60006200036f60ff841683620002a8565b9392505050565b600081600019048311821515161562000393576200039362000249565b500290565b60008219821115620003ae57620003ae62000249565b500190565b600181811c90821680620003c857607f821691505b60208210811415620003ea57634e487b7160e01b600052602260045260246000fd5b50919050565b6108b480620004006000396000f3fe608060405234801561001057600080fd5b50600436106100995760003560e01c806306fdde031461009e578063095ea7b3146100bc57806318160ddd146100df57806323b872dd146100f1578063313ce56714610104578063395093511461011357806370a082311461012657806395d89b411461014f578063a457c2d714610157578063a9059cbb1461016a578063dd62ed3e1461017d575b600080fd5b6100a66101b6565b6040516100b391906106f1565b60405180910390f35b6100cf6100ca366004610762565b610248565b60405190151581526020016100b3565b6002545b6040519081526020016100b3565b6100cf6100ff36600461078c565b61025e565b604051601281526020016100b3565b6100cf610121366004610762565b61030d565b6100e36101343660046107c8565b6001600160a01b031660009081526020819052604090205490565b6100a6610349565b6100cf610165366004610762565b610358565b6100cf610178366004610762565b6103f1565b6100e361018b3660046107ea565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6060600380546101c59061081d565b80601f01602080910402602001604051908101604052809291908181526020018280546101f19061081d565b801561023e5780601f106102135761010080835404028352916020019161023e565b820191906000526020600020905b81548152906001019060200180831161022157829003601f168201915b5050505050905090565b60006102553384846103fe565b50600192915050565b600061026b848484610522565b6001600160a01b0384166000908152600160209081526040808320338452909152902054828110156102f55760405162461bcd60e51b815260206004820152602860248201527f45524332303a207472616e7366657220616d6f756e74206578636565647320616044820152676c6c6f77616e636560c01b60648201526084015b60405180910390fd5b61030285338584036103fe565b506001949350505050565b3360008181526001602090815260408083206001600160a01b03871684529091528120549091610255918590610344908690610858565b6103fe565b6060600480546101c59061081d565b3360009081526001602090815260408083206001600160a01b0386168452909152812054828110156103da5760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084016102ec565b6103e733858584036103fe565b5060019392505050565b6000610255338484610522565b6001600160a01b0383166104605760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016102ec565b6001600160a01b0382166104c15760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016102ec565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6001600160a01b0383166105865760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016102ec565b6001600160a01b0382166105e85760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016102ec565b6001600160a01b038316600090815260208190526040902054818110156106605760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016102ec565b6001600160a01b03808516600090815260208190526040808220858503905591851681529081208054849290610697908490610858565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516106e391815260200190565b60405180910390a350505050565b600060208083528351808285015260005b8181101561071e57858101830151858201604001528201610702565b81811115610730576000604083870101525b50601f01601f1916929092016040019392505050565b80356001600160a01b038116811461075d57600080fd5b919050565b6000806040838503121561077557600080fd5b61077e83610746565b946020939093013593505050565b6000806000606084860312156107a157600080fd5b6107aa84610746565b92506107b860208501610746565b9150604084013590509250925092565b6000602082840312156107da57600080fd5b6107e382610746565b9392505050565b600080604083850312156107fd57600080fd5b61080683610746565b915061081460208401610746565b90509250929050565b600181811c9082168061083157607f821691505b6020821081141561085257634e487b7160e01b600052602260045260246000fd5b50919050565b6000821982111561087957634e487b7160e01b600052601160045260246000fd5b50019056fea2646970667358221220dc48fc3d276c6b51bc9f1e460cd3cd1b0f8c89046794509cad8d8bdddff075f064736f6c634300080c0033";

type USDTConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: USDTConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class USDT__factory extends ContractFactory {
  constructor(...args: USDTConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "USDT";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<USDT> {
    return super.deploy(overrides || {}) as Promise<USDT>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): USDT {
    return super.attach(address) as USDT;
  }
  connect(signer: Signer): USDT__factory {
    return super.connect(signer) as USDT__factory;
  }
  static readonly contractName: "USDT";
  public readonly contractName: "USDT";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): USDTInterface {
    return new utils.Interface(_abi) as USDTInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): USDT {
    return new Contract(address, _abi, signerOrProvider) as USDT;
  }
}
