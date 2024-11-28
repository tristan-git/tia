export const EstateManagerFactoryAbi = [
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
        name: "admin",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "manager",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "estateManager",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "rnbCode",
        type: "bytes32",
      },
    ],
    name: "EstateManagerCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "factoryAddress",
        type: "address",
      },
    ],
    name: "FactoryDeployed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "estateManager",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "moduleAddress",
        type: "address",
      },
    ],
    name: "ModuleRegisteredInManager",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "admin",
        type: "address",
      },
      {
        internalType: "address",
        name: "manager",
        type: "address",
      },
      {
        internalType: "string",
        name: "rnbCode",
        type: "string",
      },
    ],
    name: "createEstateManager",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "deployedManagers",
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
    name: "getDeployedManagers",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "estateManager",
        type: "address",
      },
      {
        internalType: "string",
        name: "moduleName",
        type: "string",
      },
      {
        internalType: "address",
        name: "moduleAddress",
        type: "address",
      },
    ],
    name: "registerModuleInManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
