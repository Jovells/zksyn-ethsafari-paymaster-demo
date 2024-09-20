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
          <p className="text-lg text-gray-300">
            mUSDT Address: <Link target="_blank"
            rel="noopener noreferrer" to="https://sepolia.explorer.zksync.io/address/0xff68f7561562C1F24A317d939B46741F76c4Ef55" className="text-amber-300">0xff68f7561562C1F24A317d939B46741F76c4Ef55</Link>
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
<p className="text-lg text-gray-300">
            Products contract address: <Link target="_blank"
            rel="noopener noreferrer" to="https://sepolia.explorer.zksync.io/address/0xEc969112DB5440c954CB60B4Bbd1159673eeE4C3" className="text-amber-300">0xEc969112DB5440c954CB60B4Bbd1159673eeE4C3</Link>
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
        Powered by zkSync Web3js Plugin | Chainsafe
      </footer>
    </div>
  );
};

export default Landing;
