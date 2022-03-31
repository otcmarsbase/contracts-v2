/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  Overrides,
  BigNumberish,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { TetherToken, TetherTokenInterface } from "../TetherToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_initialSupply",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_decimals",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "AddedBlackList",
    type: "event",
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
        indexed: false,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "Deprecate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_blackListedUser",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_balance",
        type: "uint256",
      },
    ],
    name: "DestroyedBlackFunds",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Issue",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "feeBasisPoints",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "maxFee",
        type: "uint256",
      },
    ],
    name: "Params",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "Pause",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Redeem",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "RemovedBlackList",
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
    anonymous: false,
    inputs: [],
    name: "Unpause",
    type: "event",
  },
  {
    inputs: [],
    name: "MAX_UINT",
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
    name: "_totalSupply",
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
        name: "_evilUser",
        type: "address",
      },
    ],
    name: "addBlackList",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "remaining",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "allowed",
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
        name: "_spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "who",
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
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balances",
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
    name: "basisPointsRate",
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
        name: "_upgradedAddress",
        type: "address",
      },
    ],
    name: "deprecate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "deprecated",
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
        name: "_blackListedUser",
        type: "address",
      },
    ],
    name: "destroyBlackFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_maker",
        type: "address",
      },
    ],
    name: "getBlackListStatus",
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
    name: "getOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isBlackListed",
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
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "issue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "maximumFee",
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
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "redeem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_clearedUser",
        type: "address",
      },
    ],
    name: "removeBlackList",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newBasisPoints",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "newMaxFee",
        type: "uint256",
      },
    ],
    name: "setParams",
    outputs: [],
    stateMutability: "nonpayable",
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
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
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
  {
    inputs: [],
    name: "upgradedAddress",
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
];

const _bytecode =
  "0x60806040526000805460ff60a01b1916815560038190556004556000196006553480156200002c57600080fd5b5060405162001933380380620019338339810160408190526200004f9162000236565b600080546001600160a01b03191633179055600184905582516200007b906008906020860190620000c3565b50815162000091906009906020850190620000c3565b50600a555050600080546001600160a01b0316815260026020526040902055600b805460ff60a01b19169055620002ef565b828054620000d190620002b2565b90600052602060002090601f016020900481019282620000f5576000855562000140565b82601f106200011057805160ff191683800117855562000140565b8280016001018555821562000140579182015b828111156200014057825182559160200191906001019062000123565b506200014e92915062000152565b5090565b5b808211156200014e576000815560010162000153565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200019157600080fd5b81516001600160401b0380821115620001ae57620001ae62000169565b604051601f8301601f19908116603f01168101908282118183101715620001d957620001d962000169565b81604052838152602092508683858801011115620001f657600080fd5b600091505b838210156200021a5785820183015181830184015290820190620001fb565b838211156200022c5760008385830101525b9695505050505050565b600080600080608085870312156200024d57600080fd5b845160208601519094506001600160401b03808211156200026d57600080fd5b6200027b888389016200017f565b945060408701519150808211156200029257600080fd5b50620002a1878288016200017f565b606096909601519497939650505050565b600181811c90821680620002c757607f821691505b60208210811415620002e957634e487b7160e01b600052602260045260246000fd5b50919050565b61163480620002ff6000396000f3fe608060405234801561001057600080fd5b50600436106101805760003560e01c806306fdde03146101855780630753c30c146101a3578063095ea7b3146101b85780630e136b19146101cb5780630ecb93c0146101ef57806318160ddd1461020257806323b872dd1461021857806326976e3f1461022b57806327e235e31461024b578063313ce5671461026b57806335390714146102745780633eaaf86b1461027d5780633f4ba83a1461028657806359bf1abe1461028e5780635c658165146102ba5780635c975abb146102e557806370a08231146102f95780638456cb591461030c578063893d20e8146103145780638da5cb5b1461032557806395d89b4114610338578063a9059cbb14610340578063c0324c7714610353578063cc872b6614610366578063db006a7514610379578063dd62ed3e1461038c578063dd644f721461039f578063e47d6060146103a8578063e4997dc5146103cb578063e5b5019a146103de578063f2fde38b146103e7578063f3bdc228146103fa575b600080fd5b61018d61040d565b60405161019a919061126b565b60405180910390f35b6101b66101b13660046112d7565b61049b565b005b6101b66101c63660046112f2565b610510565b600b546101df90600160a01b900460ff1681565b604051901515815260200161019a565b6101b66101fd3660046112d7565b6105b5565b61020a61061f565b60405190815260200161019a565b6101b661022636600461131c565b6106b9565b600b5461023e906001600160a01b031681565b60405161019a9190611358565b61020a6102593660046112d7565b60026020526000908152604090205481565b61020a600a5481565b61020a60045481565b61020a60015481565b6101b661075a565b6101df61029c3660046112d7565b6001600160a01b031660009081526007602052604090205460ff1690565b61020a6102c836600461136c565b600560209081526000928352604080842090915290825290205481565b6000546101df90600160a01b900460ff1681565b61020a6103073660046112d7565b6107bd565b6101b661086e565b6000546001600160a01b031661023e565b60005461023e906001600160a01b031681565b61018d6108d8565b6101b661034e3660046112f2565b6108e5565b6101b661036136600461139f565b6109a3565b6101b66103743660046113c1565b610a3a565b6101b66103873660046113c1565b610b0b565b61020a61039a36600461136c565b610bca565b61020a60035481565b6101df6103b63660046112d7565b60076020526000908152604090205460ff1681565b6101b66103d93660046112d7565b610c89565b61020a60065481565b6101b66103f53660046112d7565b610cf0565b6101b66104083660046112d7565b610d35565b6008805461041a906113da565b80601f0160208091040260200160405190810160405280929190818152602001828054610446906113da565b80156104935780601f1061046857610100808354040283529160200191610493565b820191906000526020600020905b81548152906001019060200180831161047657829003601f168201915b505050505081565b6000546001600160a01b031633146104b257600080fd5b600b80546001600160a01b0383166001600160a81b031990911617600160a01b1790556040517fcc358699805e9a8b7f77b522628c7cb9abd07d9efb86b6fb616af1609036a99e90610505908390611358565b60405180910390a150565b604061051d81600461142b565b36101561052957600080fd5b600b54600160a01b900460ff16156105a657600b5460405163aee92d3360e01b81526001600160a01b039091169063aee92d339061056f90339087908790600401611443565b600060405180830381600087803b15801561058957600080fd5b505af115801561059d573d6000803e3d6000fd5b50505050505050565b6105b08383610df2565b505050565b6000546001600160a01b031633146105cc57600080fd5b6001600160a01b03811660009081526007602052604090819020805460ff19166001179055517f42e160154868087d6bfdc0ca23d96a1c1cfa32f1b72ba9ba27b69b98a0d819dc90610505908390611358565b600b54600090600160a01b900460ff16156106b257600b60009054906101000a90046001600160a01b03166001600160a01b03166318160ddd6040518163ffffffff1660e01b81526004016020604051808303816000875af1158015610689573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106ad9190611467565b905090565b5060015490565b600054600160a01b900460ff16156106d057600080fd5b6001600160a01b03831660009081526007602052604090205460ff16156106f657600080fd5b600b54600160a01b900460ff161561074f57600b54604051638b477adb60e01b81523360048201526001600160a01b03858116602483015284811660448301526064820184905290911690638b477adb9060840161056f565b6105b0838383610ea6565b6000546001600160a01b0316331461077157600080fd5b600054600160a01b900460ff1661078757600080fd5b6000805460ff60a01b191681556040517f7805862f689e2f13df9f062ff482ad3ad112aca9e0847911ed832e158c525b339190a1565b600b54600090600160a01b900460ff161561084b57600b546040516370a0823160e01b81526001600160a01b03909116906370a0823190610802908590600401611358565b6020604051808303816000875af1158015610821573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108459190611467565b92915050565b6001600160a01b038216600090815260026020526040902054610845565b919050565b6000546001600160a01b0316331461088557600080fd5b600054600160a01b900460ff161561089c57600080fd5b6000805460ff60a01b1916600160a01b1781556040517f6985a02210a168e66602d3235cb6db0e70f92b3ba4d376a33c0f3d9434bff6259190a1565b6009805461041a906113da565b600054600160a01b900460ff16156108fc57600080fd5b3360009081526007602052604090205460ff161561091957600080fd5b600b54600160a01b900460ff161561099557600b5460405163370c4c0560e11b81526001600160a01b0390911690636e18980a9061095f90339086908690600401611443565b600060405180830381600087803b15801561097957600080fd5b505af115801561098d573d6000803e3d6000fd5b505050505050565b61099f828261107f565b5050565b6000546001600160a01b031633146109ba57600080fd5b601482106109c757600080fd5b603281106109d457600080fd5b6003829055600a80546109e691611564565b6109f09082611570565b60048190556003546040517fb044a1e409eac5c48e5af22d4af52670dd1a99059537a78b31b48c6500a6354e92610a2e928252602082015260400190565b60405180910390a15050565b6000546001600160a01b03163314610a5157600080fd5b600154610a5e828261142b565b11610a6857600080fd5b600080546001600160a01b0316815260026020526040902054610a8b828261142b565b11610a9557600080fd5b600080546001600160a01b031681526002602052604081208054839290610abd90849061142b565b925050819055508060016000828254610ad6919061142b565b90915550506040518181527fcb8241adb0c3fdb35b70c24ce35c5eb0c17af7431c99f827d44a445ca624176a90602001610505565b6000546001600160a01b03163314610b2257600080fd5b806001541015610b3157600080fd5b600080546001600160a01b0316815260026020526040902054811115610b5657600080fd5b8060016000828254610b68919061158f565b9091555050600080546001600160a01b031681526002602052604081208054839290610b9590849061158f565b90915550506040518181527f702d5967f45f6513a38ffc42d6ba9bf230bd40e8f53b16363c7eb4fd2deb9a4490602001610505565b600b54600090600160a01b900460ff1615610c5e57600b54604051636eb1769f60e11b81526001600160a01b03858116600483015284811660248301529091169063dd62ed3e906044016020604051808303816000875af1158015610c33573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c579190611467565b9050610845565b6001600160a01b03808416600090815260056020908152604080832093861683529290522054610c57565b6000546001600160a01b03163314610ca057600080fd5b6001600160a01b03811660009081526007602052604090819020805460ff19169055517fd7e9ec6e6ecd65492dce6bf513cd6867560d49544421d0783ddf06e76c24470c90610505908390611358565b6000546001600160a01b03163314610d0757600080fd5b6001600160a01b03811615610d3257600080546001600160a01b0319166001600160a01b0383161790555b50565b6000546001600160a01b03163314610d4c57600080fd5b6001600160a01b03811660009081526007602052604090205460ff16610d7157600080fd5b6000610d7c826107bd565b6001600160a01b0383166000908152600260205260408120819055600180549293508392909190610dae90849061158f565b9091555050604080516001600160a01b0384168152602081018390527f61e6e66b0d6339b2980aecc6ccc0039736791f0ccde9ed512e789a7fbdd698c69101610a2e565b6040610dff81600461142b565b361015610e0b57600080fd5b8115801590610e3c57503360009081526005602090815260408083206001600160a01b038716845290915290205415155b15610e4657600080fd5b3360008181526005602090815260408083206001600160a01b03881680855290835292819020869055518581529192917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6060610eb381600461142b565b361015610ebf57600080fd5b6001600160a01b038416600090815260056020908152604080832033845290915281205460035490919061271090610ef79086611570565b610f0191906115a6565b9050600454811115610f1257506004545b600654821015610f4b57610f26848361158f565b6001600160a01b03871660009081526005602090815260408083203384529091529020555b6000610f57828661158f565b6001600160a01b038816600090815260026020526040902054909150610f7e90869061158f565b6001600160a01b038089166000908152600260205260408082209390935590881681522054610fae90829061142b565b6001600160a01b038716600090815260026020526040902055811561103b57600080546001600160a01b0316815260026020526040902054610ff190839061142b565b600080546001600160a01b039081168252600260209081526040808420949094559154925185815292811692908a16916000805160206115df833981519152910160405180910390a35b856001600160a01b0316876001600160a01b03166000805160206115df8339815191528360405161106e91815260200190565b60405180910390a350505050505050565b604061108c81600461142b565b36101561109857600080fd5b60006110bb6127106110b5600354866111df90919063ffffffff16565b9061121b565b90506004548111156110cc57506004545b60006110d88483611230565b336000908152600260205260409020549091506110f59085611230565b33600090815260026020526040808220929092556001600160a01b03871681522054611121908261124c565b6001600160a01b03861660009081526002602052604090205581156111aa57600080546001600160a01b0316815260026020526040902054611163908361124c565b600080546001600160a01b039081168252600260209081526040808420949094559154925185815292169133916000805160206115df833981519152910160405180910390a35b6040518181526001600160a01b0386169033906000805160206115df8339815191529060200160405180910390a35050505050565b6000826111ee57506000610845565b60006111fa8385611570565b90508261120785836115a6565b14611214576112146115c8565b9392505050565b60008061122883856115a6565b949350505050565b600082821115611242576112426115c8565b611214828461158f565b600080611259838561142b565b905083811015611214576112146115c8565b600060208083528351808285015260005b818110156112985785810183015185820160400152820161127c565b818111156112aa576000604083870101525b50601f01601f1916929092016040019392505050565b80356001600160a01b038116811461086957600080fd5b6000602082840312156112e957600080fd5b611214826112c0565b6000806040838503121561130557600080fd5b61130e836112c0565b946020939093013593505050565b60008060006060848603121561133157600080fd5b61133a846112c0565b9250611348602085016112c0565b9150604084013590509250925092565b6001600160a01b0391909116815260200190565b6000806040838503121561137f57600080fd5b611388836112c0565b9150611396602084016112c0565b90509250929050565b600080604083850312156113b257600080fd5b50508035926020909101359150565b6000602082840312156113d357600080fd5b5035919050565b600181811c908216806113ee57607f821691505b6020821081141561140f57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b6000821982111561143e5761143e611415565b500190565b6001600160a01b039384168152919092166020820152604081019190915260600190565b60006020828403121561147957600080fd5b5051919050565b600181815b808511156114bb5781600019048211156114a1576114a1611415565b808516156114ae57918102915b93841c9390800290611485565b509250929050565b6000826114d257506001610845565b816114df57506000610845565b81600181146114f557600281146114ff5761151b565b6001915050610845565b60ff84111561151057611510611415565b50506001821b610845565b5060208310610133831016604e8410600b841016171561153e575081810a610845565b6115488383611480565b806000190482111561155c5761155c611415565b029392505050565b600061121483836114c3565b600081600019048311821515161561158a5761158a611415565b500290565b6000828210156115a1576115a1611415565b500390565b6000826115c357634e487b7160e01b600052601260045260246000fd5b500490565b634e487b7160e01b600052600160045260246000fdfeddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa26469706673582212203c056725e60656b0e92e953834a2a049d55fcadff58dffb2a245b44e61b39d9d64736f6c634300080c0033";

type TetherTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TetherTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TetherToken__factory extends ContractFactory {
  constructor(...args: TetherTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "TetherToken";
  }

  deploy(
    _initialSupply: BigNumberish,
    _name: string,
    _symbol: string,
    _decimals: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TetherToken> {
    return super.deploy(
      _initialSupply,
      _name,
      _symbol,
      _decimals,
      overrides || {}
    ) as Promise<TetherToken>;
  }
  getDeployTransaction(
    _initialSupply: BigNumberish,
    _name: string,
    _symbol: string,
    _decimals: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _initialSupply,
      _name,
      _symbol,
      _decimals,
      overrides || {}
    );
  }
  attach(address: string): TetherToken {
    return super.attach(address) as TetherToken;
  }
  connect(signer: Signer): TetherToken__factory {
    return super.connect(signer) as TetherToken__factory;
  }
  static readonly contractName: "TetherToken";
  public readonly contractName: "TetherToken";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TetherTokenInterface {
    return new utils.Interface(_abi) as TetherTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TetherToken {
    return new Contract(address, _abi, signerOrProvider) as TetherToken;
  }
}
