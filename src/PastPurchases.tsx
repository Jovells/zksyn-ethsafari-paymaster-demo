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
}


const PastPurchases = ({account} : {account:string | null | undefined}) => {
  const location = useLocation();
  const [purchases, setPurchases] = useState([]);
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
    const operation = `
      query Purchases {
        purchases(where: { buyer: "${location.state?.product.buyer || account}" }) {
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
    setIsLoading(true);

    try {
      const { data, errors } = await fetchGraphQL(operation, 'Purchases', {});
      setIsLoading(false);
      if (errors) {
        toast.error('Failed to fetch purchase details');
        return;
      }
      setPurchases(data.purchases);
    } catch (error) {
      toast.error('Error fetching purchases');
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Past Purchases</h1>

      {isLoading && <p className="text-center text-gray-600">Loading past purchases...</p>}

      {!isLoading && purchases.length === 0 && <p className="text-center text-gray-600">No past purchases found.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!isLoading &&
          purchases.map((purchase : Purchase) => (
            <div key={purchase.id} className="card">
              <img
                src={getImage(purchase.product.productImage)}
                alt={purchase.product.name}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h2 className="text-xl font-semibold mb-2">{purchase.product.name}</h2>
              <p className="text-gray-600 mb-2">Price: {formatUsd(purchase.product.price)} mUSDT</p>
              <p className="text-gray-600 mb-4">
                Purchase Status: {purchase.isDelivered ? 'Delivered' : purchase.isRefunded ? 'Refunded' : 'Pending'}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PastPurchases;
