import { ethers, Signer, ContractFactory, Contract } from "ethers";
import { useState, useEffect, useCallback } from 'react';
import { enableModule } from 'utils/enableSafeModule';
import { executeModule } from 'utils/executeSafeModule';
import EthersAdapter from '@safe-global/safe-ethers-lib';
import { createSafe } from 'utils/createSafe';
import SafeServiceClient, { SafeInfoResponse } from '@safe-global/api-kit';
import Web3 from 'web3';
import { useSafeDetailsAndSetup, SafeInfoParam, executeTransParam } from '../hooks/useSafeDetails.ts';
import { isTxnExecutable, proposeTransaction, approveTransfer, rejectTransfer } from '../hooks/useSafeDetails.ts';

let safeAddressKeyList: string[];
let contractDeployedAddress = "0xF117D1a20aaAE476Df7e00d9aA81F59b22c93F90";
let provider: ethers.providers.Web3Provider;
let ethAdapter: any;

provider = new ethers.providers.Web3Provider(window.ethereum);
const owner = provider.getSigner(0);
let signer = new ethers.Wallet(String(process.env.RINKEBY_MNEMONIC), provider);

const { setUpMultiSigSafeAddress, addAddressToSafe, getSafeInfo, executeTransaction, getAllTransactions } = useSafeDetailsAndSetup;

interface UseSafeProps {
  safeAddress: string;
  userAddress: string;
}

export const useLoadSafe = ({ safeAddress, userAddress }: UseSafeProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [safe, setSafe] = useState<SafeInfoResponse | null>(null);
  const [isCurrentUserAlreadySigned, setIsUserAlreadySigned] = useState<boolean>(false);
  const [hasReachedThreshold, setHasReachedThreshold] = useState<boolean>(false);
  const [userAddresses, setUserAddresses] = useState({});
  const [usedSafeAddress, setUsedSafeAddress] = useState<String>();
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
      const safeInfoParam: SafeInfoParam = {
        safeAddress,
        contractaddress: contractDeployedAddress,
      };
      const safeInfo = await getSafeInfo(safeInfoParam);
      setSafe(safeInfo);
    }
    setIsLoading(false);
  }, [safeAddress]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const safeInfoParam: SafeInfoParam = {
        safeAddress,
        contractaddress: contractDeployedAddress,
      };
      const txs = await getAllTransactions(safeInfoParam);
      setTransactions(txs);
    };
    fetchTransactions();
  }, [safeAddress]);

  const checkIsSigned = useCallback(async (transactionHash: string) => {
    setIsLoading(true);
    const safeInfoParam: SafeInfoParam = {
      safeAddress,
      contractaddress: contractDeployedAddress,
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
    const executable = await isTxnExecutable({ safeAddress, transaction });
    return executable;
  };

  const proposeTxn = async (transaction: any) => {
    const proposedTxn = await proposeTransaction({ safeAddress, transaction });
    return proposedTxn;
  };

  const approveTxn = async (transactionHash: string) => {
    const approvedTxn = await approveTransfer({ safeAddress, transactionHash });
    return approvedTxn;
  };

  const rejectTxn = async (transactionHash: string) => {
    const rejectedTxn = await rejectTransfer({ safeAddress, transactionHash });
    return rejectedTxn;
  };

  const executeSafeTransaction = async () => {
    setIsLoading(true);
    const transaction = { /* transaction data */ };
    const executable = await checkIfTxnExecutable(transaction);
    if (executable) {
      const proposedTxn = await proposeTxn(transaction);
      const approvedTxn = await approveTxn(proposedTxn.hash);
      const executeTransParam: executeTransParam = {
        safeAddress,
        provider: provider,
        signer: owner._address,
        transaction: transaction,
        hashtxn: transaction.hash,
      };
      
      const response = await executeTransaction(executeTransParam);
      setIsLoading(false);
      return response;
    } else {
      const rejectedTxn = await rejectTxn(transaction.hash);
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
  };
};

export default useLoadSafe;
