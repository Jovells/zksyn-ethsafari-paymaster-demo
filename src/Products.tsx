import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Web3 from 'web3';
import { THE_GRAPH_URL, MUSDT_PAYMASTER_ADDRESS, DEWORLD_ADDRESS, MUSDT_ADDRESS } from './constants'; 
import usePaymasterAsync from './usePaymasterAsync'; 
import deworldAbi from './deworldAbi';
import stablecoinAbi from './stablecoinAbi';
import { formatUsd, getImage } from './utils';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  seller: string;
  sales: number;
  productImage: string;
}

interface MyProps  {
  account?: string | null;
  balance: string;
  web3: Web3 | null;
  initializeWeb3: () => void;
  fetchBalance: () => void;
}

const Products = ({ account, balance, web3, initializeWeb3 }: MyProps) => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const navigate = useNavigate();

  const { writeContractWithPaymaster: buyWithPaymasterAsync, isPending: isPaymasterPending } = usePaymasterAsync(
    DEWORLD_ADDRESS,
    deworldAbi, 
    MUSDT_PAYMASTER_ADDRESS
  );
  const { writeContractWithPaymaster: approveWithPaymasterAsync, isPending: isApprovePending } = usePaymasterAsync(
    MUSDT_ADDRESS,
    stablecoinAbi, 
    MUSDT_PAYMASTER_ADDRESS
  );

  async function fetchGraphQL(operationsDoc: string, operationName: string, variables: any) {
    setIsLoading(true);
    const response = await fetch(THE_GRAPH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: operationsDoc,
        variables,
        operationName,
      }),
    });
    setIsLoading(false);
    return await response.json();
  }

  const operation = `
    query MyQuery {
      products(where: { planet: "${searchParams.get('id')}" }) {
        id
        name
        price
        quantity
        seller
        sales
        productImage
      }
    }
  `;

  async function fetchMyQuery() {
    const { data, errors } = await fetchGraphQL(operation, 'MyQuery', {});
    if (errors) {
      console.error(errors);
      return [];
    }
    return data.products;
  }

  useEffect(() => {
    fetchMyQuery()
      .then((products) => setProducts(products))
      .catch((error) => toast.error('Error fetching products'));
  }, [searchParams]);

  const buyProduct = async (product: Product, itemQty: number) => {
    if (!web3 || !account) {
      toast.error('Wallet not connected');
      return;
    }
    setIsPending(true);
    try {
      const contract = new web3.eth.Contract(deworldAbi, DEWORLD_ADDRESS);
      const musdt = new web3.eth.Contract(stablecoinAbi, MUSDT_ADDRESS);
      
      await musdt.methods.approve(DEWORLD_ADDRESS, Number(product.price) * itemQty).send({ from: account });
      const tx = await contract.methods.purchaseProduct(product.id, itemQty).send({ from: account });
      return { tx, product };
    } catch (error) {
      console.error('Error purchasing product', error);
    } finally {
      setIsPending(false);
    }
  };

  const buyProductWithPayMaster = async (product: Product, itemQty: number) => {
    try {
      setIsPending(true);

      await approveWithPaymasterAsync(
        { functionName: 'approve', args: [DEWORLD_ADDRESS, product.price] },
        { onBlockConfirmation: (txnReceipt) => console.log('Approval Transaction blockHash', txnReceipt.transactionHash) }
      );

      const tx = await buyWithPaymasterAsync(
        { functionName: 'purchaseProduct', args: [product.id, itemQty] },
        { onBlockConfirmation: (txnReceipt) => console.log('Purchase Transaction hash', txnReceipt.transactionHash) }
      );
      return { tx, product };
    } catch (error) {
      console.error('Error buying product with Paymaster', error);
    } finally {
      setIsPending(false);
    }
  };

  async function buy(fn: (product: Product, quantity: number) => Promise<{ tx: any, product: Product } | undefined>, product: Product, quantity: number, gasToken: string) {
    if (!web3 || !account) {
      toast.error('Wallet not connected');
      initializeWeb3();
      return;
    }
    const previousBalances ={musdt: balance, eth: formatUsd(await web3.eth.getBalance(account), "", 18, 6)};
    const id = toast.loading(`Purchasing ${product.name} for ${formatUsd(quantity * product.price)} mUSDT... and paying gas fees with ${gasToken}`);
    try {
      const val = await fn(product, quantity);
      if (!val) return;
      const { tx } = val;
      toast.success(`Successfully purchased ${product.name}. Gas paid: ${tx.gasUsed} ETH`, { id });
      navigate('/purchase-details', { state: { product, tx , previousBalances} });
    } catch (error) {
      toast.error('Error purchasing product' + error, { id });
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Available Products</h1>

      {!web3 || !account ? (
        <div className="text-center">
          <p className="text-lg mb-4">Please connect your wallet to view products.</p>
          <button
            onClick={initializeWeb3}
            className="bg-violet-600 hover:bg-violet-800 px-6 py-3 rounded-lg text-white font-semibold transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <p className="text-lg">Connected Account: <span className="font-semibold">{account}</span></p>
            <p className="text-lg">Balance: <span className="font-semibold">{balance} mUSDT</span></p>
          </div>

          {isLoading ? (
            <p className="text-center text-gray-600">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-600">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-blue-950 shadow-lg rounded-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow">
                  <img src={getImage(product.productImage)} alt={product.name} onError={(e) => e.currentTarget.src = '/big.jpg'}  className="w-full h-64 object-cover rounded-md mb-4" />
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                    <p className="text-gray-100 mb-2">Price: {formatUsd(product.price)} mUSDT</p>
                    <p className="text-gray-100 mb-4">Available Quantity: {product.quantity - product.sales}</p>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => buy(buyProduct, product, 1, "eth")}
                      disabled={isPending || isLoading}
                      className="bg-sky-900 hover:bg-gray-800 text-white py-2 rounded-md font-semibold w-full transition-colors"
                    >
                      Buy and pay gas fees with ETH
                    </button>
                    <button
                      onClick={() => buy(buyProductWithPayMaster, product, 1, "Stablecoin")}
                      disabled={isPending || isPaymasterPending}
                      className="bg-blue-600 hover:bg-blue-800  text-white py-2 rounded-md font-semibold w-full transition-colors"
                    >
                      Pay and cover gas with mUSDT
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
