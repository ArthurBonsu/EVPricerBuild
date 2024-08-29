import { ethers, Signer, ContractFactory, Contract } from "ethers";
import { useState, useEffect, useCallback } from 'react';
import { enableModule } from 'utils/enableSafeModule';
import { executeModule } from 'utils/executeSafeModule';
import EthersAdapter from '@safe-global/safe-ethers-lib';
import { createSafe } from 'utils/createSafe';
import SafeServiceClient, { SafeInfoResponse } from '@safe-global/api-kit';
import Web3 from 'web3';

import useSafeDetailsAndSetup from '../hooks/useSafeDetails.ts';
import { SafeInfoParam, executeTransParam } from "../hooks/useSafeDetails.ts";
import { PaymentTransactions } from "types/index.js";


let safeAddressKeyList: string[];
let contractDeployedAddress = "0xF117D1a20aaAE476Df7e00d9aA81F59b22c93F90";
let provider: ethers.providers.Web3Provider;
let ethAdapter: any;

provider = new ethers.providers.Web3Provider(window.ethereum);
const owner = provider.getSigner(0);
let signer = new ethers.Wallet(String(process.env.RINKEBY_MNEMONIC), provider);

const {  setUpMultiSigSafeAddress,addAddressToSafe, getSafeInfo, executeTransaction, getAllTransactions, isTxnExecutable, proposeTransaction, approveTransfer, rejectTransfer } = useSafeDetailsAndSetup;

interface UseSafeProps {
  safeAddress: string;
  userAddress: string;
}

// create safe or setup multisig 
// add addre
//


export const useLoadSafe = ({ safeAddress, userAddress }: UseSafeProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [safe, setSafe] = useState<SafeInfoResponse | null>(null);
  const [isCurrentUserAlreadySigned, setIsUserAlreadySigned] = useState<boolean>(false);
  const [hasReachedThreshold, setHasReachedThreshold] = useState<boolean>(false);
  const [userAddresses, setUserAddresses] = useState({});
  const [usedSafeAddress, setUsedSafeAddress] = useState<String>();
  const [transaction, setTransaction] = useState<PaymentTransactions>({
    data: null,
    username: '',
    address: '',
    amount: 0,
    comment: '',
    timestamp: new Date(),
    receipient: '',
    receipients: [],
    txhash: '',
    USDprice: 0,
    paymenthash: '',
    owneraddress: '',
  });
  
  const [transactions, setTransactions] = useState([]);

  
  const userAddToSafe = async () => {
    setIsLoading(true);
    const addressAdded = await addAddressToSafe(safeAddress, userAddress);
    setUserAddresses(addressAdded);
    setIsLoading(false);
    return addressAdded;
  };

  const getSafeInfoUsed = useCallback(async () => {
    setIsLoading(true);
    if (safeAddress) {
      const safeInfo = await getSafeInfo({ 
        safeAddress, 
      });
      setSafe(safeInfo);
    }
    setIsLoading(false);
  }, [safeAddress]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const safeInfoParam: SafeInfoParam = {
        safeAddress
      };
      const txs = await getAllTransactions(safeInfoParam);
      setTransactions(txs);
    };
    fetchTransactions();
  }, [safeAddress]);

  //This is after transactions have been executed 
  const checkIsSigned = useCallback(async (transactionHash: string) => {
    setIsLoading(true);
    const safeInfoParam: SafeInfoParam = {
      safeAddress
    };
    const txs = await getAllTransactions(safeInfoParam);
    const retrievedTransaction = txs.results.find((tx: any) => tx.data.hash === transactionHash);

    const isSigned = retrievedTransaction?.isSigned;
    setIsUserAlreadySigned(isSigned);
    setIsLoading(false);
  }, [safeAddress, userAddress]);
  

  useEffect(() => {
    safeAddress && checkIsSigned('0x...transactionHash...');
  }, [userAddress, safe, safeAddress, checkIsSigned]);
  
  useEffect(() => {
    const asyncFunction = async () => {
      if (safeAddress) {
        await checkIsSigned('0x...transactionHash...');
      }
    };
    asyncFunction();
  }, [userAddress, safe, safeAddress, checkIsSigned]);
  useEffect(() => {
    checkIsSigned('0x...transactionHash...');
  }, [checkIsSigned, safeAddress]);
  

  const checkIfTxnExecutable = async (transaction: any) => {
    setTransaction(transaction);
    const executable = await isTxnExecutable({ safeAddress, transaction });
   
    return executable;
  };

const proposeTxn = async (transaction: any) => {
  setTransaction(transaction);
  const proposedTxn = await proposeTransaction({ safeAddress, transaction });
  
  return proposedTxn;
};

  const approveTxn = async (transaction: any) => {
    setTransaction(transaction);
    const approvedTxn = await approveTransfer({ safeAddress, transaction });

    return approvedTxn;
  };

  const rejectTxn = async (transaction: any) => {
    setTransaction(transaction);
    const rejectedTxn = await rejectTransfer({ safeAddress, transaction });
   
    return rejectedTxn;
  };

  const executeSafeTransaction = async () => {
    setIsLoading(true);
    
    const executable = await checkIfTxnExecutable(transaction);
    setTransaction(transaction);
    if (executable) {
      const proposedTxn = await proposeTxn(transaction);
      const approvedTxn = await approveTxn(transaction);
      const executeTransParam: executeTransParam = {
        safeAddress,
        provider: provider,
        signer: owner._address,
        transaction: transaction,
        hashtxn: transaction.txhash,
      };
      
      const response = await executeTransaction(executeTransParam);
      setIsLoading(false);
      return response;
    } else {
      const rejectedTxn = await rejectTxn(transaction.txhash);
      setIsLoading(false);
      return rejectedTxn;
    }
  };

  const refetch = {
    waiting: checkIsSigned,
    success: () => {
      getSafeInfoUsed();
      checkIsSigned('0x...transactionHash...');
    },
  };

  return {
    isLoading,
    safe,
    checkIsSigned,
    isCurrentUserAlreadySigned,
    refetch,
    hasReachedThreshold,
    userAddToSafe,
    executeSafeTransaction,
    getSafeInfoUsed
  };
};

export default useLoadSafe;
