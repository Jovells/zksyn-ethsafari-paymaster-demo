import React from 'react';
import toast from 'react-hot-toast';
import Web3 from 'web3';
import stablecoinAbi from './stablecoinAbi';
import { MUSDT_ADDRESS } from './constants';
import { Link } from 'react-router-dom';

interface MyProps {
  account?: string | null;
  balance: string;
  web3: Web3;
  initializeWeb3: () => void;
  fetchBalance: (web3: Web3) => void;
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
      fetchBalance(web3);
    } catch (error) {
      console.log(error);
      toast.error('Failed to mint stablecoin');
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center space-y-12">
      <header className="text-center">
        <div className='flex flex-col items-center'>
            <div className='flex items-center mb-6'>
                <Link to={"https://docs.zksync.io/" } target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition ease-in-out duration-300">
                <img src="/zksync-logo.png" alt="zkSync Logo" className="rounded-md mx-2 h-12 w-12 hover:scale-110 transition-transform duration-300" />
                </Link>
                <span className="font-light text-white"> | </span>
                <Link to={ "https://docs.web3js.org/"} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition ease-in-out duration-300">
                <img src="/web3js-logo.jpg" alt="Web3.js Logo" className="rounded-md h-12 mx-2 w-12 hover:scale-110 transition-transform duration-300" />
                </Link>
            </div>
          <h1 className="text-5xl mb-6 font-extrabold text-white mb-4 text-center">Web3js ZkSync Plugin Demo (With Paymaster)</h1>
          <Link className="text-blue-400 text-xl font-bold hover:text-blue-600 transition ease-in-out duration-300" to="https://github.com/jovells">By Jovells</Link>
        </div>
        <p className="text-xl mt-3 text-gray-300">
          Seamless transactions with web3js ZkSync Plugin.
          <br></br>
           Mint stablecoins, view your balance, and buy goods without having to load gas on your wallet.
        </p>
      </header>

      <main className="w-full max-w-4xl bg-black bg-opacity-60 p-16 rounded-xl  shadow-lg  space-y-6">
        {/* Step 0: Get ETH from zkSync Sepolia Faucet */}
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-white">Step 0: Get ETH from zkSync Sepolia Faucet</h2>
          <p className="text-lg text-gray-300">
            Before starting, you need some ETH to pay for transaction fee when minting statblecoins to test. 
            <br/>
            Get ETH from the zkSync Sepolia faucet.
          </p>
          <a
            href="https://docs.zksync.io/ecosystem/network-faucets"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-xl font-bold hover:text-blue-600 transition ease-in-out duration-300" 
          >
            Get ETH from Faucet
          </a>
        </section>

        {/* Step 1: Mint mUSDT */}
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-white">Step 1: Mint mUSDT</h2>
          <p className="text-lg text-gray-300">
            To start, mint some mUSDT. You'll use this for purchases later.
          </p>
          <p className="text-lg font-semibold text-white">
            Current Balance: <span className="text-amber-300">{balance} mUSDT</span>
          </p>
          <button 
            onClick={mintStableCoin} 
            className="w-64 block py-3 px-6 bg-gradient-to-r from-[#1755f4] to-blue-500 text-white font-semibold rounded-full shadow hover:opacity-70 transition ease-in-out"
          >
            Mint mUSDT
          </button>
        </section>

        {/* Step 2: Visit the Products Page */}
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-white">Step 2: Visit the Products Page</h2>
          <p className="text-lg text-gray-300">
            Now, head over to our products page to see what you can buy using your freshly minted mUSDT.
          </p>
          <Link 
            to="/products?id=1" 
            className="flex justify-center w-64  py-3 px-6 bg-gradient-to-r from-[#1755f4] to-blue-500 text-white font-semibold rounded-full hover:opacity-70 transition ease-in-out"
          >
            Explore Products
          </Link>
        </section>

        {/* Step 3: Buy a Product */}
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-white">Step 3: Buy a Product</h2>
          <p className="text-lg text-gray-300">
            Select a product and pay with mUSDT (using Paymaster) or ETH for a regular transaction.
          <br/>
  To complete your purchase, you will be prompted to perform two transactions: 
  <br/>
  1. To set an allowance for the smart contract.
  <br/>
  2. To make the actual payment.
</p>

        </section>

        {/* Step 4: View Purchase Details */}
        <section className="space-y-4">
          <h2 className="text-3xl font-semibold text-white">Step 4: View Your Purchase and Compare Balances</h2>
          <p className="text-lg text-gray-300">
            After purchasing, view your purchase details. Compare your balances to see the effect of using Paymaster.
          </p>
          <Link 
            to="/purchase-history" 
            className=" w-64 flex justify-center py-3 px-6 bg-gradient-to-r from-[#1755f4] to-blue-500 text-white font-semibold rounded-full hover:opacity-70 transition ease-in-out"
          >
            View Purchase History
          </Link>
        </section>
      </main>

      <footer className="text-center bg-gradient-to-r from-[#1755f4] to-blue-500 text-sm">
        Powered by zkSync Web3js Plugin
      </footer>
    </div>
  );
};

export default Landing;
