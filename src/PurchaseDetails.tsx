import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MUSDT_ADDRESS, THE_GRAPH_URL } from './constants';
import { formatUsd, getImage } from './utils';
import stablecoinAbi from './stablecoinAbi';

interface Balance {
  eth: string;
  musdt: string;
}

interface MyProps {
  account?: string | null;
  balance: string;
  web3: any;
  initializeWeb3: () => void;
  fetchBalance: () => void;
}

interface Product {
  createdAt: string;
  id: string;
  name: string;
  price: string;
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

const PurchaseDetails = ({ account, balance, web3, initializeWeb3, fetchBalance }: MyProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [newBalances, setNewBalances] = useState<Balance>({ eth: '0', musdt: '0' });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch purchases for the connected user
  async function fetchGraphQL(operationsDoc: string, operationName: string, variables: any) {
    setIsLoading(true);
    const response = await fetch(THE_GRAPH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: operationsDoc, variables, operationName }),
    });
    setIsLoading(false);
    return await response.json();
  }

  const fetchPurchases = async () => {
    const operation = `
      query Purchases {
        purchases(where: { buyer: "${location.state?.product.seller}" }) {
          id
          isDelivered
          isRefunded
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
    fetchPurchases();
  }, []);

  async function fetchBalances() {
    const musdt = new web3.eth.Contract(stablecoinAbi, MUSDT_ADDRESS);
    const ethBalance = await web3.eth.getBalance(account);
    const musdtBalance = await musdt.methods.balanceOf(account).call();
    setNewBalances({ musdt: formatUsd(musdtBalance, 'mUsdt', 6, 6), eth: formatUsd(ethBalance, 'eth', 18, 6) });
  }

  useEffect(() => {
    fetchBalances();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Purchase Details</h1>

      {isLoading && <p className="text-center text-gray-600">Loading purchase details...</p>}

      {!isLoading && purchases.length === 0 && (
        <p className="text-center text-gray-600">No purchases found for this address.</p>
      )}

      {!isLoading && purchases.length > 0 && (
        <div key={purchases[0].id} className="card mb-8">
          <div className="flex items-center mb-4">
            <img
              src={getImage(state?.product.productImage)}
              alt={state?.product.name}
              className="w-24 h-24 object-cover rounded mr-4"
            />
            <div>
              <h2 className="text-xl font-semibold">{purchases[0].product.name}</h2>
              <p className="text-gray-600">Price: {formatUsd(state?.product.price)} mUSDT</p>
              <p className="text-gray-600">Quantity: {state?.quantity}</p>
            </div>
          </div>
          <p className="mb-2">Successfully purchased {purchases[0].product.name}. Funds are held in escrow.</p>
          <p className="mb-2">
            Gas Paid: <span className="font-semibold">{state?.gasPaid} ETH</span>
          </p>
          <div className="bg-indigo-800 p-4 rounded mb-4">
            <h3 className="font-semibold mb-2">Balance Changes:</h3>
            <p>
              Previous Balances: <span className="font-semibold">ETH: {state.previousBalances.eth} | mUSDT: {state.previousBalances.musdt}</span>
            </p>
            <p>
              New Balances: <span className="font-semibold">ETH: {newBalances.eth} | mUSDT: {newBalances.musdt}</span>
            </p>
          </div>
          <p className="mb-2">
            Transaction Hash: <span className="font-mono text-sm">{state?.tx.transactionHash}</span>
          </p>
          <p className="mb-2">
            Purchase Status:{' '}
            <span className="font-semibold">
              {purchases[0].isDelivered
                ? 'Delivered'
                : purchases[0].isRefunded
                ? 'Refunded'
                : purchases[0].isReleased
                ? 'Released'
                : 'Escrowed'}
            </span>
          </p>
        </div>
      )}

      <button onClick={() => navigate('/past-purchases')} className="btn btn-secondary w-full">
        View Past Purchases
      </button>
    </div>
  );
};

export default PurchaseDetails;
