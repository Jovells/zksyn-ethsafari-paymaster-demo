
# Web3js zkSync Plugin Demo (With Paymaster)

## Overview

This project is a demo application showcasing how to use zkSync's Paymaster feature to make seamless transactions. The app allows users to mint stablecoins (`mUSDT`), view their balance, explore products, and make purchases using `mUSDT` or `ETH`. Users can even pay gas fees with either `ETH` or `mUSDT` using the Paymaster integration.

## Features

1. **Mint mUSDT**: Easily mint stablecoins (`mUSDT`) to use in transactions.
2. **Browse Products**: Explore products available for purchase in a decentralized marketplace.
3. **Purchase Products**: Use either `mUSDT` or `ETH` to buy products and pay gas fees.
4. **Paymaster Integration**: Option to pay gas fees using `mUSDT` via zkSync’s Paymaster.
5. **View Purchase History**: Track your past transactions and compare balances before and after purchases.

## Live Demo

[Web3js zkSync Plugin Demo (With Paymaster)](https://paymaster-demo.on-fleek.app)

## Technology Stack

- **React.js**: Frontend framework.
- **Web3.js**: Ethereum blockchain interaction.
- **zkSync**: Layer 2 scaling solution with Paymaster support.
- **Solidity**: Smart contract interactions (via zkSync).
- **TailwindCSS**: For styling the user interface.
- **MetaMask**: Ethereum wallet integration.

## Steps to Use the Application

### Step 1: Mint mUSDT

Mint stablecoins that you will use for purchases within the application.

- Click the "Mint mUSDT" button to generate some mUSDT.
- After minting, your wallet's balance will automatically update.
- You will need this balance to make purchases on the marketplace.

### Step 2: Explore the Products Page

Browse the available products for sale. These items can be purchased using your minted mUSDT.

- Click the "Explore Products" button to go to the marketplace.
- Products are fetched and displayed based on the selected planet.

### Step 3: Buy a Product

Select any product you want to purchase.

- Choose whether to pay gas fees using `ETH` or `mUSDT` (via zkSync’s Paymaster).
- Confirm the transaction to complete your purchase.

### Step 4: View Purchase History

After making a purchase, view the details of your transaction, including the gas fees paid and the method used for payment (ETH or mUSDT).

- Go to "Purchase History" to review your past purchases and compare the balances before and after each transaction.

## How to Run the Application Locally

### Prerequisites

- **Node.js**: Make sure you have Node.js (v14 or later) and npm installed. [Download Node.js](https://nodejs.org/en/download/)
- **MetaMask**: Install the MetaMask extension in your browser. [Install MetaMask](https://metamask.io/)
- **zkSync Wallet Setup**: Configure zkSync network in MetaMask or any compatible wallet.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/zksync-paymaster-demo.git
cd zksync-paymaster-demo
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The app will be accessible at `http://localhost:3000/`.

### Commands

- **`npm start`**: Start the development server.
- **`npm run build`**: Build the app for production.
- **`npm test`**: Run the test suite.
- **`npm run lint`**: Lint the codebase.

## Contracts Used

- **mUSDT Contract**: Handles minting and transfers of the mUSDT stablecoin.
- **Paymaster Contract**: Manages gas fee payments using mUSDT instead of ETH.

Ensure you have deployed and configured the necessary contracts on zkSync or another compatible blockchain network.

## User Interface

### Landing Page

- The landing page welcomes users with clear steps on how to get started.
- It provides actions to mint stablecoins, explore products, and purchase them.
  
### Product Page

- Products are displayed with key details such as price and available quantity.
- Users can buy items by paying gas fees in either `ETH` or `mUSDT` via the Paymaster.

### Purchase History Page

- Users can view past purchases along with transaction details and compare balances.

