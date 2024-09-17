import React from 'react';
import toast from 'react-hot-toast';
import Web3 from 'web3';
import stablecoinAbi from './stablecoinAbi';
import { MUSDT_ADDRESS } from './constants';
import { Link } from 'react-router-dom';

interface MyProps {
  account?: string | null;
  balance: string;
  web3: Web3 | null;
  initializeWeb3: () => void;
  fetchBalance: () => void;
}

const Landing = ({ account, balance, web3, initializeWeb3, fetchBalance }: MyProps) => {
  
  const mintStableCoin = async () => {
    if (!web3) {
      toast.error('Please connect your wallet');
      return initializeWeb3();
    }
    try {
      const contract = new web3.eth.Contract(stablecoinAbi, MUSDT_ADDRESS);

      // Minting logic
      await contract.methods.mint().send({
        from: account as string,
      });
      toast.success('Stablecoin minted successfully!');
      
      // Update balance
      fetchBalance();
    } catch (error) {
      console.log(error);
      toast.error('Failed to mint stablecoin');
    }
  };

  return (
    <div className="min-h-screen   text-white flex flex-col items-center justify-center space-y-12">
      <header className="text-center">
       <div> <h1 className="text-5xl font-extrabold text-white mb-4">zkSync Paymaster Demo </h1> <Link className="text-blue-400 text-xl font-bold  hover:text-blue-600 transition ease-in-out duration-300" to={"https://github.com/jovells"}> By Jovells</Link></div>
        <p className="text-xl mt-3 text-gray-300">
          Seamless transactions with zkSync. Mint stablecoins, view your balance, and explore the marketplace.
        </p>
      </header>

      <main className="w-full max-w-lg bg-black bg-opacity-60 px-32 rounded-xl py-16 shadow-lg text-center space-y-6">
        {/* Step 1: Mint mUSDT */}
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-white">Step 1: Mint mUSDT</h2>
          <p className="text-lg text-gray-300">
            To start, mint some mUSDT. You'll use this for purchases later.
          </p>
          <button 
            onClick={mintStableCoin} 
            className="w-full py-3 px-6 bg-gradient-to-r from-[#1755f4] to-blue-500 text-white font-semibold rounded-full shadow hover:opacity-90 transition ease-in-out"
          >
            Mint mUSDT
          </button>
          <p className="text-lg font-semibold text-white">
            Current Balance: <span className="text-blue-400">{balance} mUSDT</span>
          </p>
        </section>

        {/* Step 2: Visit the Products Page */}
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-white">Step 2: Visit the Products Page</h2>
          <p className="text-lg text-gray-300">
            Now, head over to our products page to see what you can buy using your freshly minted mUSDT.
          </p>
          <Link 
            to="/products?id=1" 
            className="w-full block py-3 px-6 bg-gradient-to-r from-[#1755f4] to-blue-500 text-white font-semibold rounded-full hover:bg-gray-700 transition ease-in-out"
          >
            Explore Products
          </Link>
        </section>

        {/* Step 3: Buy a Product */}
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-white">Step 3: Buy a Product</h2>
          <p className="text-lg text-gray-300">
            Select a product and pay with mUSDT (using Paymaster) or ETH for a regular transaction.
          </p>
          <Link 
            to="/products?id=1" 
            className="w-full block py-3 px-6 bg-gradient-to-r from-[#1755f4] to-blue-500 text-white font-semibold rounded-full shadow hover:opacity-90 transition ease-in-out"
          >
            Buy Product
          </Link>
        </section>

        {/* Step 4: View Purchase Details */}
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-white">Step 4: View Your Purchase and Compare Balances</h2>
          <p className="text-lg text-gray-300">
            After purchasing, view your purchase details. Compare your balances to see the effect of using Paymaster.
          </p>
          <Link 
            to="/purchase-history" 
            className="w-full block py-3 px-6 bg-gradient-to-r from-[#1755f4] to-blue-500 text-white font-semibold rounded-full hover:bg-gray-700 transition ease-in-out"
          >
            View Purchase History
          </Link>
        </section>
      </main>

      <footer className="text-center bg-gradient-to-r from-[#1755f4] to-blue-500 text-sm">
        Powered by zkSync | EthSafari 2024
      </footer>
    </div>
  );
};

export default Landing;
