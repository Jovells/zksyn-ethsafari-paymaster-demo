import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MUSDT_ADDRESS, THE_GRAPH_URL } from './constants';
import { formatCurrency as formatCurrency, getImage } from './utils';
import stablecoinAbi from './stablecoinAbi';
import Web3, { TransactionReceipt } from 'web3';

interface Balance {
  eth: string;
  musdt: string;
}

interface MyProps {
  account?: string | null;
  balance: string;
  web3: Web3;
  initializeWeb3: () => void;
  fetchBalance: (web3: Web3) => void;
  pathSetter: () => void;

}

interface Product {
  createdAt: string;
  id: string;
  name: string;
  price: string;
  productImage: string;
  seller: string;
  updatedAt: string;
}

interface Purchase {
  amount: string;
  id: string;
  product: Product;
  isDelivered: boolean;
  isRefunded: boolean;
  isReleased: boolean;
} 

const PurchaseDetails = ({ account, balance, web3,  initializeWeb3, pathSetter }: MyProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, } = location as { state?: { product : Product, previousBalances: { eth: string, musdt: string}, amount: string, gasPaid: string, tx: TransactionReceipt }  };
  const searchParams = new URLSearchParams(location.search);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [newBalances, setNewBalances] = useState<Balance>({ eth: '0', musdt: '0' });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch purchases for the connected user
  async function fetchGraphQL(operationsDoc: string, operationName: string, variables: any) {
    setIsLoading(true);
    console.log('Fetching purchases...', account, operationsDoc, variables );
    const response = await fetch(THE_GRAPH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: operationsDoc, variables, operationName }),
    });
    setIsLoading(false);
    return await response.json();
  }

  useEffect(() => {

    pathSetter()
  }
  , []);

  const id = searchParams.get('id')
  console.log('id:', id);

  const fetchPurchases = async () => {
    const operation = `
      query Purchases {
        purchases(where: { ${id? `id : "${id}"` : "" } }, orderDirection: desc, orderBy: id ) {
          id
          isDelivered
          isRefunded
          amount
          isReleased
          product {
            id
            name
            price
            productImage
            quantity
          }
        }
      }
    `;

    try {
      const { data, errors } = await fetchGraphQL(operation, 'Purchases', {});
      if (errors) {
        console.error(errors);
        toast.error('Failed to fetch purchase details');
        return;
      }
      setPurchases(data.purchases);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast.error('Error fetching purchases');
    }
  };

  useEffect(() => {
    if(!state.product){
      fetchPurchases();
    }
  }, []);
  console.log('account:', account);
  async function fetchBalances() {
    const musdt = new web3.eth.Contract(stablecoinAbi, MUSDT_ADDRESS);
    console.log('musdt:', musdt);
    //this was causing an eror when reconnecting wallet
    const musdtBalance = await musdt.methods.balanceOf(account).call();
    console.log('musdtBalance:', musdtBalance);
    const ethBalance = await web3.eth.getBalance(account);
    console.log('eth:', musdt);
    //this was causing an error when reconnecting wallet
    setNewBalances({ musdt: formatCurrency(musdtBalance, 'mUsdt', 6, 6), eth: formatCurrency(ethBalance, 'eth', 18, 6) });
  }

  useEffect(() => {
    fetchBalances();
  }, []);

  console.log('Purchases:', purchases);
  console.log('State:', state);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-center">Purchase Details</h1>

      {isLoading && <p className="text-center text-gray-400">Loading purchase details...</p>}

      {!isLoading && purchases.length == 0 && !state.product && (
        <p className="text-center text-gray-400">No purchases found for this address.</p>
      )}

      {((!isLoading && purchases.length > 0) || state.product)  && (
        console.log('state.tx:', ((!isLoading && purchases.length > 0) || state.product) ),
        <div key={state?.product?.id || purchases[0]?.id} className="bg-violet-950 rounded-lg shadow-md p-6 mb-8">
          {/* Product Information */}
          <div className="flex items-center mb-6">
            <img
              src={getImage(state?.product.productImage)}
              alt={state?.product.name}
              onError={(e) => e.currentTarget.src = '/big.jpg'}
              className="w-28 h-28 object-cover rounded mr-6"
            />
            <div>
              <h2 className="text-2xl font-semibold mb-2">{state?.product.name || purchases[0]?.product.name}</h2>
              <p className="text-lg text-gray-300">Price: {formatCurrency( state?.product.price || purchases[0].product.price)} mUSDT</p>
              <p className="text-lg text-gray-300">Quantity: {state?.amount || purchases[0]?.amount}</p>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4">
            <p className="text-lg">Successfully purchased <span className="font-semibold">{state?.product.name || purchases[0].product.name}</span>. Funds are held in escrow.</p>
            {state?.gasPaid && <p className="text-lg">Gas Paid: <span className="font-semibold">{state.gasPaid} ETH</span></p>}

            {/* Balance Changes Section */}
            {state?.previousBalances && <div className="bg-indigo-900 p-4 rounded-md">
              <h3 className="text-xl font-semibold mb-2">Balance Changes</h3>
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="px-2 py-1">Currency</th>
                    <th className="px-2 py-1">Previous Balance</th>
                    <th className="px-2 py-1">New Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-2 py-1">ETH</td>
                    <td className="px-2 py-1">{state.previousBalances?.eth}</td>
                    <td className="px-2 py-1">{newBalances.eth}</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1">mUSDT</td>
                    <td className="px-2 py-1">{state.previousBalances?.musdt}</td>
                    <td className="px-2 py-1">{newBalances.musdt}</td>
                  </tr>
                </tbody>
              </table>
            </div>
}
            {/* Transaction Hash */}
            {state.tx && <p className="text-lg">Transaction Hash: <span className="font-mono text-sm">{state?.tx.transactionHash}</span></p>}

            {/* Purchase Status */}
            <p className="text-lg">
          Purchase Status: <span className="font-semibold">
          { state?.product ? "paid" : 
            purchases[0].isDelivered
              ? 'Delivered'
              : purchases[0].isRefunded
              ? 'Refunded'
              : purchases[0].isReleased
              ? 'Released'
              : 'Paid'}
          </span>
            </p>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <div className="text-center">
        <button
          onClick={() => navigate('/purchase-history')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300"
        >
          View Past Purchases
        </button>
      </div>
    </div>
  );
};

export default PurchaseDetails;
