import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Web3, { Transaction, TransactionReceipt } from 'web3';
import { THE_GRAPH_URL, MUSDT_PAYMASTER_ADDRESS, DEWORLD_ADDRESS, MUSDT_ADDRESS } from './constants'; 
import  usePaymasterAsync  from './usePaymasterAsync'; 
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
  initializeWeb3: ()=>{}
  fetchBalance: ()=>void
}

interface EthereumWindow extends Window {
    ethereum?: any;
  }

  declare let window: EthereumWindow;


const Products = ({account, balance, web3,  initializeWeb3} : MyProps) => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const navigate = useNavigate();
  
  // Load Web3 and user's account

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

  // GraphQL query function
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

  // GraphQL query to fetch products
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

  // Fetch products from the GraphQL API
  async function fetchMyQuery() {
    const { data, errors } = await fetchGraphQL(operation, 'MyQuery', {});
    if (errors) {
      console.error(errors);
      return [];
    }
    console.log('Products:', data.products);
    return data.products;
  }

  // Load products based on the search parameter (planetId)
  useEffect(() => {
    const currentId = searchParams.get('id');

    fetchMyQuery()
      .then((products) => setProducts(products))
      .catch((error) => toast.error('Error fetching products'));
  }, [searchParams]);

  // Regular contract interaction for purchasing a product
  const buyProduct = async (product: Product, itemQty: number)  =>{
    
    if (!web3 || !account) {
      toast.error('Wallet not connected');
      throw new Error('Web3 or account not initialized');
    }

    setIsPending(true);
    try {
      const contract = new web3.eth.Contract(deworldAbi, DEWORLD_ADDRESS);
      const musdt = new web3.eth.Contract(stablecoinAbi, MUSDT_ADDRESS);
      
      // Call the smart contract function for purchasing a product
       await musdt.methods.approve(DEWORLD_ADDRESS, Number(product.price) * itemQty)
      .send({
        from: account,
      });

      const tx = await contract.methods
        .purchaseProduct(product.id, itemQty)
        .send({
          from: account});

      console.log('Transaction hash:', tx.transactionHash);
         // Calculate gas paid


    return ({tx, product});

        }
        catch (error) {
    // Store or pass gasPaid as needed    } catch (error) {
      console.error('Error purchasing product', error);
    } finally {
      setIsPending(false);
    }

    
  };

  if (!web3 || !account) {
    return (
      <div>
        <h1>Products</h1>
        <p>Please connect your wallet.</p>
        <button onClick={initializeWeb3}></button>
      </div>
      )
  }

  // Purchase product using Paymaster
  const buyProductWithPayMaster = async (product: Product, itemQty: number)  => {
    try {
      setIsPending(true);

      // Approve the Paymaster
      await approveWithPaymasterAsync(
        {
          functionName: 'approve',
          args: [DEWORLD_ADDRESS, product.price],
        },
        {
          onBlockConfirmation: (txnReceipt) => {
            console.log('📦 Approval Transaction blockHash', txnReceipt.transactionHash);
          },
        }
      );

      // Buy product with Paymaster
      const tx = await buyWithPaymasterAsync(
        {
          functionName: 'purchaseProduct',
          args: [product.id, itemQty],
        },
        {
          onBlockConfirmation: (txnReceipt) => {
            console.log('📦 Purchase Transaction hash', txnReceipt.transactionHash);
          },
        }
      );
      console.log('TransactionR:', tx);

 return ({tx, product})

    } catch (error) {
      console.error('Error buying product with Paymaster', error);
    } finally {
      setIsPending(false);
    }
  };

async function buy(fn: (product : Product, quantity: number) => Promise<{tx : TransactionReceipt, product: Product } | undefined >, product: Product,  quantity: number, gasToken: string) {
  if (!web3 || !account) {
    toast.error('Wallet not connected');
    initializeWeb3();
    return;
  }
  const  previousBalances = { musdt: balance, eth: formatUsd(await web3.eth.getBalance(account), 'eth', 18 , 6) };
  const id  = toast.loading(`Purchasing ${product.name} for ${formatUsd(quantity * product.price)} mUSDT... and paying gas fees with ${gasToken}`);
  try{
  const val = await fn(product, quantity);
  if (!val) {
    return;
  }
  const {tx} = val;

  console.log('tx', tx);
  const gasUsed = Number(tx.gasUsed|| 0);
  const effectiveGasPrice = Number(tx.effectiveGasPrice    || web3.utils.toWei('10', 'gwei'));
  const gasPaid = web3.utils.fromWei((gasUsed * effectiveGasPrice).toString(), 'ether');
  
  
  
  const state = { product, gasPaid, quantity , tx , previousBalances};

  toast.success(`Successfully purchased ${product.name}. Gas paid: ${gasPaid} ETH` , { id });
  console.log('state', state);
  navigate('/purchase-details', { state });
}catch(error){
  toast.error('Error purchasing product' + error, { id });
  console.log('Error purchasing product', error);
}

}

return (
  <div className="max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold mb-8">Products</h1>

    {!web3 || !account ? (
      <div className="card">
        <p className="mb-4">Please connect your wallet to view products.</p>
        <button onClick={initializeWeb3} className="btn btn-primary">
          Connect Wallet
        </button>
      </div>
    ) : (
      <>
        <div className="mb-8">
          <p className="text-lg">Connected Account: <span className="font-semibold">{account}</span></p>
          <p className="text-lg">Balance: <span className="font-semibold">{balance} mUSDT</span></p>
        </div>

        {isLoading && <p className="text-center text-gray-600">Loading products...</p>}

        {!isLoading && products.length === 0 && (
          <p className="text-center text-gray-600">No products found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!isLoading &&
            products.length > 0 &&
            products.map((product) => (
              <div key={product.id} className="card">
                <img src={getImage(product.productImage)} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-200 mb-2">Price: {formatUsd(product.price)} mUSDT</p>
                <p className="text-gray-200 mb-4">Available Quantity: {product.quantity - product.sales}</p>
                <div className="space-y-2">
                  <button 
                    onClick={() => buy(buyProduct, product, 1, "eth")} 
                    disabled={isPending || isLoading}
                    className="btn btn-primary w-full"
                  >
                    Buy and pay gas fees with ETH
                  </button>
                  <button 
                    onClick={() => buy(buyProductWithPayMaster, product, 1, "Stablecoin")} 
                    disabled={isPending || isPaymasterPending}
                    className="btn btn-secondary w-full"
                  >
                    Pay and pay gas fees with mUSDT
                  </button>
                </div>
              </div>
            ))}
        </div>
      </>
    )}
  </div>
);
};

export default Products;
