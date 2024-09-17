import { useState, useEffect, useCallback } from 'react';
import Web3, { ContractAbi, TransactionReceipt }  from 'web3';
import React from 'react';
import { getPaymasterParams, types, Web3ZKsyncL2, ZKsyncPlugin } from 'web3-plugin-zksync';
import ZkSyncContractPaymasterPlugin from "./plugin";
import { MUSDT_ADDRESS } from './constants';
import { waitTxByHashConfirmation } from 'web3-plugin-zksync/lib/utils';
import toast from 'react-hot-toast';

declare let window: any;

const usePaymasterAsync = (contractAddress: string, contractAbi: ContractAbi, _paymasterAddress?: string) => {
  const [web3, setWeb3] = useState<Web3>();
  const [account, setAccount] = useState<string>();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [paymaster, setPaymaster] = useState(_paymasterAddress);
  const [plugin, setPlugin] = useState<ZkSyncContractPaymasterPlugin>();



  useEffect(() => {
    const initializeWeb3 = async () => {
      console.log('Initializing Web3...');
      if (typeof window.ethereum !== 'undefined') {
        try {await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const l2= Web3ZKsyncL2.initWithDefaultProvider(types.Network.Sepolia)
        const plugin = new ZkSyncContractPaymasterPlugin(window.ethereum);
        web3.registerPlugin(plugin);
        web3.registerPlugin(new ZKsyncPlugin(l2))
        setPlugin(plugin);

        if(!paymaster){
          setPaymaster(await web3.ZKsync.rpc.getTestnetPaymasterAddress() as string)
        }

        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        console.log('Accounts:', accounts);
        setWeb3(web3);

      } catch (error) {
        console.error('User denied account access', error);
        toast.error('Please connect your wallet.');
      }
      }
      else {
        toast.error('Please install MetaMask!');
      }
    };

    initializeWeb3();
  }, []);



  const writeContractWithPaymaster = useCallback(async (
    { functionName, args }: { functionName: string; args: any[] },
    { onBlockConfirmation, numConfirmations = 1 }: { onBlockConfirmation?: (txnReceipt: TransactionReceipt) => void, numConfirmations?: number }
  ): Promise<TransactionReceipt> => {
    if (!web3 || !account ||  !plugin) {
      toast('Please connect your wallet. No plugin');
      throw new Error('Web3 or account not initialized'); 
    }
    setIsPending(true);

    console.log('Writing to contract:', {functionName, account, args, contractAddress});

    const id = toast.loading("calling " + functionName);
    try {
      console.log('plugin ', plugin);
      const tx = await plugin.write(
        contractAddress,
        [...contractAbi],
        {
          methodName: functionName,
          args: args,
          from: account,
          customData: {
            gasPerPubdata: 50000,
            paymasterParams: getPaymasterParams(paymaster as string, {
              type: "ApprovalBased",
              minimalAllowance: 10,
              token: MUSDT_ADDRESS,
              innerInput: new Uint8Array(),
            }),
          }
        }
      );

      console.log('Transaction receipt:', tx);
      setIsPending(false);

      console.log("Waiting for transaction confirmation...");
      const explorerUrl = `https://sepolia.explorer.zksync.io/tx/${tx.hash}`;
      toast.loading(
        "Waiting for transaction confirmation..." + explorerUrl, { id }
      );
      const receipt = await waitTxByHashConfirmation(web3.eth, tx.hash, numConfirmations);
      console.log("Transaction confirmed!, ", explorerUrl);
      toast.success("Transaction confirmed! " + explorerUrl, { id });



      if (onBlockConfirmation) {
        onBlockConfirmation(receipt);
      }

      return receipt;
    } catch (error: any) {
      toast.error("Error writing to contract: " + error.message, { id });
      setIsPending(false);
      console.error('Error writing to contract:', error);
      throw error;
    }
  }, [web3, account, contractAddress, contractAbi, _paymasterAddress]);

  return {
    isPending,
    writeContractWithPaymaster,
  };
};

export default usePaymasterAsync;