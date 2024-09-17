import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Landing from './Landing';
import Products from './Products';
import PurchaseDetails from './PurchaseDetails';
import Web3 from 'web3';
import { formatUsd } from './utils';
import stablecoinAbi from './stablecoinAbi';
import { MUSDT_ADDRESS } from './constants';
import PastPurchases from './PastPurchases';

const ZKSYNC_SEPOLIA_CHAIN_ID = "0x12c"; // Chain ID for zkSync Sepolia (in hex)

interface EthereumWindow extends Window {
  ethereum?: any;
}

declare let window: EthereumWindow;

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);
  const [balance, setBalance] = useState("0");
  const [web3, setWeb3] = useState<Web3 | null>(null);

  useEffect(() => {
    checkNetwork();
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload(); // Reload on network change to re-check the network
      });
    }
    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        setWeb3(web3);
      } catch (error) {
        toast.error('Please connect your wallet.');
      }
    } else {
      toast.error('Please install MetaMask!');
    }
  };

  const connectWallet = async (): Promise<void> => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        checkNetwork();
      } catch (error) {
        toast.error('Failed to connect wallet.');
      }
    } else {
      toast.error('Please install MetaMask.');
    }
  };

  const checkNetwork = async (): Promise<void> => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId === ZKSYNC_SEPOLIA_CHAIN_ID) {
        setIsCorrectNetwork(true);
        toast.success('Connected to zkSync Sepolia!');
      } else {
        setIsCorrectNetwork(false);
        toast.error('Wrong network. Please switch to zkSync Sepolia.');
      }
    }
  };

  const switchNetwork = async (): Promise<void> => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ZKSYNC_SEPOLIA_CHAIN_ID }],
      });
      checkNetwork();
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: ZKSYNC_SEPOLIA_CHAIN_ID,
              chainName: 'zkSync Sepolia',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia.era.zksync.dev'],
              blockExplorerUrls: ['https://sepolia.explorer.zksync.io'], 
            }],
          });
          checkNetwork();
        } catch (error) {
          toast.error('Failed to switch network.');
        }
      }
    }
  };

  useEffect(() => {
    if (account && isCorrectNetwork) {
      fetchBalance();
    }
  }, [account]);

  const fetchBalance = () => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(stablecoinAbi, MUSDT_ADDRESS);
    contract.methods.balanceOf(account).call().then((balance: any) => {
      setBalance(formatUsd(balance));
    });
  };

  return (
    <Router>
      <div  className="min-h-screen bg-gradient-to-tr from-blue-900 via-[#1755f4] to-black text-white">
        <div style={{
      background:  "radial-gradient(75% 75% at 50% 50%, #000 0, transparent 100%), url(/cta.svg)"
    }} >
        <nav className="bg-opacity-80 backdrop-blur-md bg-black shadow-md py-3">
          <div className="container mx-auto px-6 flex justify-between items-center">
            <Link to = {"/"} > <h1 className="text-2xl font-bold text-white">zkSync Demo</h1> </Link>
            {!account ? (
              <button 
                onClick={connectWallet} 
                className="py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full shadow-md hover:opacity-90 transition ease-in-out"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-300">Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
                <p className="text-sm font-semibold text-blue-400">Balance: {balance} mUSDT</p>
              </div>
            )}
          </div>
        </nav>

        {!isCorrectNetwork && (
          <div className="bg-yellow-200 border-l-4 border-yellow-600 text-yellow-800 p-4 mb-4">
            <p className="font-bold">Wrong Network</p>
            <p>Please switch to zkSync Sepolia network.</p>
            <button 
              onClick={switchNetwork} 
              className="mt-2 py-2 px-4 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-500 transition ease-in-out"
            >
              Switch Network
            </button>
          </div>
        )}

        <div className="container mx-auto px-6 py-8">
          <Toaster />
          <Routes>
            <Route path="/" element={<Landing account={account} web3={web3} fetchBalance={fetchBalance} balance={balance} initializeWeb3={initializeWeb3} />} />
            <Route path="/products" element={<Products account={account} web3={web3} fetchBalance={fetchBalance} balance={balance} initializeWeb3={initializeWeb3} />} />
            <Route path="/purchase-details" element={<PurchaseDetails account={account} web3={web3} fetchBalance={fetchBalance} balance={balance} initializeWeb3={initializeWeb3} />} />
            <Route path="/past-purchases" element={<PastPurchases account={account}/>} />
          </Routes>
        </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
