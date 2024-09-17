export default  [
  {
    inputs: [
      {
        internalType: "address",
        name: "_MOCKUSDT_ADDRESS",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "purchaseId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "by",
        type: "address",
      },
    ],
    name: "AppealRaised",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "planetId",
        type: "uint256",
      },
    ],
    name: "ApprovalDeclined",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "planetId",
        type: "uint256",
      },
    ],
    name: "ApprovalGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "planetId",
        type: "uint256",
      },
    ],
    name: "ApprovalRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "purchaseId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
    ],
    name: "Delivered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "planetId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "planetName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "planetImage",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "planetDescription",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "ruler",
        type: "address",
      },
    ],
    name: "PlanetCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "productId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "planetId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "productImage",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "ProductAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "purchaseId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
    ],
    name: "Refund",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "purchaseId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
    ],
    name: "Release",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "purchaseId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "productId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
    ],
    name: "Sale",
    type: "event",
  },
  {
    inputs: [],
    name: "MOCKUSDT_ADDRESS",
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
    inputs: [
      {
        internalType: "string",
        name: "_productName",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_planetId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_productImage",
        type: "string",
      },
      {
        internalType: "address",
        name: "_seller",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "addProduct",
    outputs: [],
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
    name: "appeals",
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
        name: "",
        type: "address",
      },
    ],
    name: "approvalRequests",
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
        name: "_seller",
        type: "address",
      },
    ],
    name: "approveSeller",
    outputs: [],
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
    name: "approvedSellers",
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
        internalType: "string",
        name: "_planetName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_planetImage",
        type: "string",
      },
      {
        internalType: "string",
        name: "_planetDescription",
        type: "string",
      },
    ],
    name: "createPlanet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_seller",
        type: "address",
      },
    ],
    name: "declineSeller",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "start",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "end",
        type: "uint256",
      },
    ],
    name: "getBuyerPurchases",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "purchaseId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "productId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "buyer",
            type: "address",
          },
          {
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isReleased",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isDelivered",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isRefunded",
            type: "bool",
          },
        ],
        internalType: "struct Deworld.Purchase[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "start",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "end",
        type: "uint256",
      },
    ],
    name: "getPurchases",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "purchaseId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "productId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "buyer",
            type: "address",
          },
          {
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isReleased",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isDelivered",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isRefunded",
            type: "bool",
          },
        ],
        internalType: "struct Deworld.Purchase[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "start",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "end",
        type: "uint256",
      },
    ],
    name: "getSellerPurchases",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "purchaseId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "productId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "buyer",
            type: "address",
          },
          {
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isReleased",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isDelivered",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isRefunded",
            type: "bool",
          },
        ],
        internalType: "struct Deworld.Purchase[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_purchaseId",
        type: "uint256",
      },
    ],
    name: "markDelivered",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "numPlanets",
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
    name: "numProducts",
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
    name: "numPurchases",
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
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "planets",
    outputs: [
      {
        internalType: "uint256",
        name: "planetId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "planetName",
        type: "string",
      },
      {
        internalType: "string",
        name: "planetDescription",
        type: "string",
      },
      {
        internalType: "address",
        name: "ruler",
        type: "address",
      },
    ],
    stateMutability: "view",
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
    name: "products",
    outputs: [
      {
        internalType: "string",
        name: "productName",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "productId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "planetId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "sales",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_productId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
    ],
    name: "purchaseProduct",
    outputs: [],
    stateMutability: "payable",
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
    name: "purchases",
    outputs: [
      {
        internalType: "uint256",
        name: "purchaseId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "productId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isReleased",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isDelivered",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isRefunded",
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
        name: "_purchaseId",
        type: "uint256",
      },
    ],
    name: "raiseAppeal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_purchaseId",
        type: "uint256",
      },
    ],
    name: "refund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_purchaseId",
        type: "uint256",
      },
    ],
    name: "release",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_purchaseId",
        type: "uint256",
      },
    ],
    name: "releaseFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_planetId",
        type: "uint256",
      },
    ],
    name: "requestApproval",
    outputs: [],
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
    name: "rulerPlanets",
    outputs: [
      {
        internalType: "uint256",
        name: "planetId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "planetName",
        type: "string",
      },
      {
        internalType: "string",
        name: "planetDescription",
        type: "string",
      },
      {
        internalType: "address",
        name: "ruler",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const