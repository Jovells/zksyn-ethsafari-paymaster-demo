import React, { useEffect, useLayoutEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Landing from './Landing';
import Products from './Products';
import PurchaseDetails from './PurchaseDetails';
import Web3 from 'web3';
import { formatCurrency } from './utils';
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
  const [network, setNetwork] = useState<any>('');
  const [balance, setBalance] = useState("0");
  const [web3, setWeb3] = useState<Web3>(null);
  const [pathname, setPathname] = useState(window.location.pathname)

  useLayoutEffect(() => {
    if(!isCorrectNetwork) {
      checkAndSetNetwork();
      return;
    }
    console.log('Correct:', isCorrectNetwork);
    toast.success('Connected to zkSync Sepolia!');
  },[])


  useLayoutEffect(() => {

    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {

 try {
     if (typeof window.ethereum !== 'undefined') {
       if (window.ethereum) {
         window.ethereum.on('chainChanged', (newChain) => {
           checkAndSetNetwork();
         });
       }
       if(!isCorrectNetwork){
         console.log("useeffect iscorrrect" ,isCorrectNetwork)
         return;
       }
     
       try {
         const web3 = new Web3(window.ethereum);
         setWeb3(web3);
       } catch (error) {
        throw new Error(error)
         toast.error('Please connect your wallet.');
       }
     } else {
       toast.error('Please install MetaMask!');
     }
 } catch (error) {
  console.log("error initilising web3", error)
  
 }
  };

  const connectWallet = async (): Promise<void> => {
    if (window.ethereum) {
      if(!web3){
        initializeWeb3();
      }
      try {
        const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        toast.error('Failed to connect wallet.');
      }
    } else {
      toast.error('Please install MetaMask.');
    }
  };

  const checkAndSetNetwork = async (): Promise<boolean> => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setNetwork(chainId);
      if (chainId === ZKSYNC_SEPOLIA_CHAIN_ID) {
        setIsCorrectNetwork(true);
        return true;
      } else {
        setIsCorrectNetwork(false);
        return false;
      }
    }else return false;
  };

  const switchNetwork = async (): Promise<void> => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ZKSYNC_SEPOLIA_CHAIN_ID }],
      });
      setIsCorrectNetwork(true);
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
          setIsCorrectNetwork(true);
        } catch (error) {
          toast.error('Failed to switch network.');
        }
      }
    }
  };

  useEffect(() => {
    if (account && web3) {
      fetchBalance(web3);
    }
  }, [account]);

  const fetchBalance = (web3:Web3) => {
    const contract = new web3.eth.Contract(stablecoinAbi, MUSDT_ADDRESS);
    contract.methods.balanceOf(account).call().then((balance: any) => {
      setBalance(formatCurrency(balance));
    });
  };
  console.log('pathname:', pathname, pathname.startsWith('/'));

  return (
    <Router>
      <div  className="min-h-screen bg-gradient-to-tr from-blue-900 via-[#1755f4] to-black text-white">
        <div style={{
      background:  "radial-gradient(75% 75% at 50% 50%, #000 0, transparent 100%), url(/cta.svg)"
    }} >
        <nav className="bg-opacity-80 backdrop-blur-md bg-black shadow-md py-3">
          <div className="container mx-auto px-6 flex justify-between items-center">
            <Link onClick={()=>setPathname("/")} to = {"/"} > <span className="text-l  flex font-bold text-white">
  
              Web3js ZkSync Demo</span> </Link>
            <div className="flex space-x-4">
              <Link to="/" onClick={()=>setPathname("/")} className={" hover:text-blue-300 transition ease-in-out" + (pathname === "/" ? " text-blue-300" : "text-white")}>Home</Link>
              <Link to="/products" onClick={()=>setPathname("/products")} className={" hover:text-blue-300 transition ease-in-out" + (pathname.startsWith('/products') ? " text-blue-300" : "text-white")} >Products</Link>
              <Link to="/purchase-history" onClick={()=>setPathname("/purchase-history")} className={" hover:text-blue-300 transition ease-in-out" + (pathname.startsWith('/purchase-history')? " text-blue-300":"text-white")}> History</Link>
            </div>
            {!account ? (
              <button 
                onClick={connectWallet} 
                className="py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full shadow-md hover:opacity-90 transition ease-in-out"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex flex-col items-center ">
                <p className="text-sm text-gray-300">Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
              </div>
            )}
          </div>
        </nav>

        {!isCorrectNetwork && network && (
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
        <header className="text-center mb-10">
        <div className='flex flex-col items-center'>
            <div className='flex items-center mb-6'>
                <Link to={"https://docs.zksync.io/" } target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition ease-in-out duration-300">
                <img src="/zksync-logo.png" alt="zkSync Logo" className="rounded-md mx-2 h-12 w-12 hover:scale-110 transition-transform duration-300" />
                </Link>
                <span className="font-light text-white"> | </span>
                <Link to={ "https://docs.web3js.org/"} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition ease-in-out duration-300">
                <img src="/web3js-logo.jpg" alt="Web3.js Logo" className="rounded-md h-12 mx-2 w-12 hover:scale-110 transition-transform duration-300" />
                </Link>
                <span className="font-light text-white"> | </span>
                <Link to={ "https://chainsafe.io//"} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition ease-in-out duration-300">
                <img src="/chainsafe-logo.jpg" alt="chainsfafe.js Logo" className="rounded-md h-12 mx-2 w-12 hover:scale-110 transition-transform duration-300" />
                </Link>
            </div>
          <h1 className="text-5xl mb-6 font-extrabold text-white mb-4 text-center">Web3js ZkSync Plugin Demo (With Paymaster)</h1>
            <div className="flex space-x-4 m-2">
            <Link className="text-blue-400 text-xl font-bold hover:text-blue-600 transition ease-in-out duration-300" to="https://github.com/jovells">By Jovells</Link>
            <span>|</span>
              <Link className="text-blue-400 text-lg hover:text-blue-600 transition ease-in-out duration-300" to="https://github.com/jovells">GitHub</Link>
              <Link className="text-blue-400 text-lg hover:text-blue-600 transition ease-in-out duration-300" to="https://x.com/JovellsAppiah">X</Link>
              <Link className="text-blue-400 text-lg hover:text-blue-600 transition ease-in-out duration-300" to="https://linkedin.com/in/jovells">LinkedIn</Link>
            </div>
        </div>

        <p className="text-xl mt-3 text-gray-300">
          Seamless transactions with web3js ZkSync Plugin.
          <br></br>
           Buy goods and pay gas fees using stablecoins.
        </p>
      </header>

          <Toaster />
          {
          web3 && account && isCorrectNetwork ? <>
          <Routes>
          <Route path="/" element={ <Landing pathSetter={()=>setPathname("/")} account={account}  web3={web3} fetchBalance={fetchBalance} balance={balance} initializeWeb3={initializeWeb3} />} /> :
            <Route path="/products" element={<Products pathSetter={()=>setPathname("/products")}  account={account} web3={web3} fetchBalance={fetchBalance} balance={balance} initializeWeb3={initializeWeb3} />} />
            <Route path="/purchase-details" element={<PurchaseDetails pathSetter={()=>setPathname("/purchase-details")}  account={account} web3={web3} fetchBalance={fetchBalance} balance={balance} initializeWeb3={initializeWeb3} />} />
            <Route path="/purchase-history" element={<PastPurchases pathSetter={()=>setPathname("/purchase-history")}  account={account}/>} />
          </Routes>
          </>:
            <div className="flex flex-col h-svh items-center  ">
              <p className="text-lg bg-blue-950 rounded-md p-2 text-gray-300 mt-10">Please connect your wallet to continue</p>
            </div>
          }
        </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
