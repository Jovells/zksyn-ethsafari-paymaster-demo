import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { THE_GRAPH_URL } from './constants';
import { formatUsd, getImage } from './utils';
import toast from 'react-hot-toast';

interface Product {
  createdAt: string;
  id: string;
  name: string;
  price: string;
  seller: string;
  updatedAt: string;
  productImage: string;
}

interface Purchase {
  amount: string;
  id: string;
  product: Product;
  isDelivered: boolean;
  isRefunded: boolean;
  isReleased: boolean;
  timestamp: string;
}

const PastPurchases = ({ account }: { account: string | null | undefined }) => {
  const location = useLocation();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    console.log('Fetching purchases...', account );
    const operation = `
      query Purchases {
        purchases(where: { buyer: "${location.state?.product.buyer || account?.toLocaleLowerCase()}"} , orderDirection: desc, orderBy: id ) {
          id
          isDelivered
          isRefunded
          amount
          isReleased
          timestamp
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
    setIsLoading(true);

    try {
      const { data, errors } = await fetchGraphQL(operation, 'Purchases', {});
      setIsLoading(false);
      if (errors) {
        console.log(errors);
        toast.error('Failed to fetch purchase details');
        return;
      }
      setPurchases(data.purchases);
    } catch (error) {
      toast.error('Error fetching purchases');
    }
  };

  useEffect(() => {
    if(!account) return;
    fetchPurchases();
  }, [account]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Past Purchases</h1>

      {isLoading && <p className="text-center text-gray-600">Loading past purchases...</p>}

      {!isLoading && purchases.length === 0 && <p className="text-center text-gray-600">No past purchases found.</p>}

      <div className="overflow-x-auto">
        {/* List Header */}
        <div className="hidden md:grid grid-cols-6 gap-6 bg-gray-900 text-white text-lg font-semibold py-3 px-6 rounded-t-lg">
          <div>Product</div>
          <div>Price</div>
          <div>Quantity</div>
          <div>Total</div>
          <div>Status</div>
          <div>Date</div>
        </div>

        {/* List of Purchases */}
        <div className="divide-y divide-gray-800">
          {!isLoading &&
            purchases.map((purchase: Purchase) => (
              <div key={purchase.id} className="grid grid-cols-1 md:grid-cols-6 gap-6 py-4 px-6 text-gray-200 items-center bg-gray-800 rounded-lg mb-2">
                {/* Product Image and Name */}
                <div className="flex items-center space-x-4">
                  <img
                    src={getImage(purchase.product.productImage)}
                    alt={purchase.product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <span className="font-semibold">{purchase.product.name}</span>
                </div>

                {/* Price */}
                <div className="text-lg font-semibold">{formatUsd(purchase.product.price)} mUSDT</div>

                {/* Quantity */}
                <div className="text-lg">{purchase.amount}</div>

                {/* Total Price */}
                <div className="text-lg font-semibold">
                  {formatUsd((parseFloat(purchase.product.price) * parseFloat(purchase.amount)).toString())} mUSDT
                </div>

                {/* Status */}
                <div className="mt-2 md:mt-0">
                  <span
                    className={`inline-block px-3 py-1 rounded-md font-semibold text-sm ${
                      purchase.isDelivered
                        ? 'bg-green-500 text-white'
                        : purchase.isRefunded
                        ? 'bg-red-500 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}
                  >
                    {purchase.isDelivered
                      ? 'Delivered'
                      : purchase.isRefunded
                      ? 'Refunded'
                      : 'Payment Made'}
                  </span>
                </div>

                {/* Purchase Date */}
                <div className="text-sm text-gray-400">
                  {new Date(Number(purchase.timestamp) * 1000).toLocaleDateString()}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PastPurchases;
