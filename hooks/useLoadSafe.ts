import { ethers, Signer, ContractFactory, Contract } from "ethers";
import { useState, useEffect, useCallback } from 'react';
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

const {
  setUpMultiSigSafeAddress,
  addAddressToSafe,
  getSafeInfo,
  executeTransaction,
  getAllTransactions,
  isTxnExecutable,
  proposeTransaction,
  approveTransfer,
  rejectTransfer,
  removeOwner,
  updateThreshold,
  getOwners,
  getOwnerDetails,
  getTransactionCount,
  getUserTransactions,
  setPendingAddOwnerData,
  setIsPendingAddOwner,
  userAddToSafe,
  updateTransactionStatus,
  getSafeInfoUsed,
  getSafeOwners,
  getTransactionDetails,
  isOwnerAddress,
  getTotalWeight,
  getThreshold,
} = useSafeDetailsAndSetup;

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
  const [transactionStatus, setTransactionStatus] = useState({});

  const updateTransactionStatus = async (transaction: PaymentTransactions, status: string) => {
    setTransactionStatus((prevStatus) => ({ ...prevStatus, [transaction.txhash]: status }));
  };

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
      const safeInfo = await getSafeInfo({ safeAddress });
      setSafe(safeInfo);
    }
    setIsLoading(false);
  }, [safeAddress]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const safeInfoParam: SafeInfoParam = { safeAddress };
      const txs = await getAllTransactions(safeInfoParam);
      setTransactions(txs);
    };
    fetchTransactions();
  }, [safeAddress]);

  const checkIsSigned = useCallback(async (transactionHash: string) => {
    setIsLoading(true);
    const safeInfoParam: SafeInfoParam = { safeAddress };
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

  const executeSafeTransaction = async (transaction: PaymentTransactions) => {
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
      setTransactionStatus((prevStatus) => ({ ...prevStatus, [transaction.txhash]: 'complete' }));
      setIsLoading(false);
      return response;
    } else {
      const rejectedTxn = await rejectTxn(transaction.txhash);
      setTransactionStatus((prevStatus) => ({ ...prevStatus, [transaction.txhash]: 'rejected' }));
      setIsLoading(false);
      return rejectedTxn;
    }
  };

  const removeOwnerFromSafe = async (owner: string) => {
    setIsLoading(true);
    const result = await removeOwner({ safeAddress, owner });
    setIsLoading(false);
    return result;
  };

  const updateThresholdOfSafe = async (threshold: number) => {
    setIsLoading(true);
    const result = await updateThreshold({ safeAddress, threshold });
    setIsLoading(false);
    return result;
  };

  const getOwnersOfSafe = async () => {
    setIsLoading(true);
    const owners = await getOwners({ safeAddress });
    setIsLoading(false);
    return owners;
  };

  const getOwnerDetailsOfSafe = async (owner: string) => {
    setIsLoading(true);
    const ownerDetails = await getOwnerDetails({ safeAddress, owner });
    setIsLoading(false);
    return ownerDetails;
  };

  const getTransactionCountOfSafe = async () => {
    setIsLoading(true);
    const transactionCount = await getTransactionCount({ safeAddress });
    setIsLoading(false);
    return transactionCount;
  };

  const getUserTransactionsOfSafe = async (user: string) => {
    setIsLoading(true);
    const userTransactions = await getUserTransactions({ safeAddress, user });
    setIsLoading(false);
    return userTransactions;
  };

  const setPendingAddOwnerDataOfSafe = async (owner: string, timestamp: number) => {
    setIsLoading(true);
    const result = await setPendingAddOwnerData({ safeAddress, owner, timestamp });
    setIsLoading(false);
    return result;
  };

  const setIsPendingAddOwnerOfSafe = async (owner: string, status: boolean) => {
    setIsLoading(true);
    const result = await setIsPendingAddOwner({ safeAddress, owner, status });
    setIsLoading(false);
    return result;
  };

  const userAddToSafeAsync = async () => {
    setIsLoading(true);
    const result = await userAddToSafe();
    setIsLoading(false);
    return result;
  };

  const updateTransactionStatusOfSafe = async (transactionHash: string, status: string) => {
    setIsLoading(true);
    const result = await updateTransactionStatus({ safeAddress, transactionHash, status });
    setIsLoading(false);
    return result;
  };

  const getSafeInfoUsedOfSafe = async () => {
    setIsLoading(true);
    const safeInfoUsed = await getSafeInfoUsed();
    setIsLoading(false);
    return safeInfoUsed;
  };

  const getSafeOwnersOfSafe = async () => {
    setIsLoading(true);
    const safeOwners = await getSafeOwners({ safeAddress });
    setIsLoading(false);
    return safeOwners;
  };

  const getTransactionDetailsOfSafe = async (transactionId: number) => {
    setIsLoading(true);
    const transactionDetails = await getTransactionDetails({ safeAddress, transactionId });
    setIsLoading(false);
    return transactionDetails;
  };

  const isOwnerAddressOfSafe = async (owner: string) => {
    setIsLoading(true);
    const isOwner = await isOwnerAddress({ safeAddress, owner });
    setIsLoading(false);
    return isOwner;
  };

  const getTotalWeightOfSafe = async () => {
    setIsLoading(true);
    const totalWeight = await getTotalWeight({ safeAddress });
    setIsLoading(false);
    return totalWeight;
  };

  const getThresholdOfSafe = async () => {
    setIsLoading(true);
    const threshold = await getThreshold({ safeAddress });
    setIsLoading(false);
    return threshold;
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
    checkIfTxnExecutable,
    isCurrentUserAlreadySigned,
    refetch,
    hasReachedThreshold,
    userAddToSafe,
    executeSafeTransaction,
    getSafeInfoUsed,
    proposeTransaction: proposeTxn,
    approveTransfer: approveTxn,
    rejectTransfer: rejectTxn,
    updateTransactionStatus,
    removeOwnerFromSafe,
    updateThresholdOfSafe,
    getOwnersOfSafe,
    getOwnerDetailsOfSafe,
    getTransactionCountOfSafe,
    getUserTransactionsOfSafe,
    setPendingAddOwnerDataOfSafe,
    setIsPendingAddOwnerOfSafe,
    userAddToSafeAsync,
    updateTransactionStatusOfSafe,
    getSafeInfoUsedOfSafe,
    getSafeOwnersOfSafe,
    getTransactionDetailsOfSafe,
    isOwnerAddressOfSafe,
    getTotalWeightOfSafe,
    getThresholdOfSafe,
  };
};

export default useLoadSafe;