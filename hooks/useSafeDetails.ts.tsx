import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { PaymentTransactions } from 'types';

// Define interfaces
export interface SafeInfoParam {
  provider?: Web3Provider;
  signer?: string;
  safeAddress: string;
  contractaddress?: string;
}

export interface executeTransParam {
  provider?: Web3Provider;
  signer?: string;
  safeAddress: string;
  transaction: PaymentTransactions;
  hashtxn?: string;
}

const useSafeDetailsAndSetup = () => {
  // Define the provider
  const provider: Web3Provider = new ethers.providers.Web3Provider(window.ethereum);
  
  // Define the contract ABI and bytecode
  const contractAbi: ethers.ContractInterface = [
    // Add ABI entries here
  ];
  
  // Get the signer
  const signer = provider.getSigner();
  
  const contractBytecode: string = '0x...'; // Replace with actual bytecode
  
  // Define the addresses array
  const addresses: string[] = [];
  const transactionPull : PaymentTransactions[] = [];

  const setUpMultiSigSafeAddress = async (address: string) => {
    const safeFactory = new ethers.ContractFactory(contractAbi, contractBytecode, signer);
    const safeContract = await safeFactory.deploy(address);
    await safeContract.deployed();
    const deployedAddress = safeContract.address;
    addresses.push(deployedAddress);
    return deployedAddress;
  };

  const addAddressToSafe = async (safeAddress: string, newAddress: string) => {
    const safeContract = new ethers.Contract(safeAddress, contractAbi, provider);
    const tx = await safeContract.addOwner(newAddress);
    await tx.wait();
    return addresses;
  };

  const getSafeInfo = async ({ safeAddress }: SafeInfoParam) => {
    const safeContract = new ethers.Contract(safeAddress, contractAbi, provider);
    const tx = await safeContract.functions.getModules();
    const modules = await tx.wait();
    return modules;
  };

  const executeTransaction = async ({ safeAddress, transaction }: executeTransParam) => {
    const safeContract = new ethers.Contract(safeAddress, contractAbi, provider);
    const tx = {
      to: safeAddress,
      value: 0,
      data: transaction.data,
      gasLimit: ethers.utils.hexlify(1000000),
      nonce: await provider.getTransactionCount(safeAddress),
    };
    const receipt = await provider.sendTransaction(tx.data);
    await safeContract.functions.storeTransaction(
      safeAddress,
      receipt.timestamp,
      transaction.data,
      true,
      receipt.hash
    );
    return receipt;
  };

  const getAllTransactions = async ({ safeAddress }: SafeInfoParam) => {
    const safeContract = new ethers.Contract(safeAddress, contractAbi, provider);
    const transactions = await safeContract.functions.getMultiSigTransactions();
    transactionPull.push(transactions);
    return transactions;
  };

  const isTxnExecutable = async ({ safeAddress, transaction }: executeTransParam) => {
    const safeContract = new ethers.Contract(safeAddress, contractAbi, provider);
    const executable = await safeContract.functions.isTransactionExecutable(transaction);
    return executable;
  };

  const proposeTransaction = async ({ safeAddress, transaction }: executeTransParam) => {
    const safeContract = new ethers.Contract(safeAddress, contractAbi, provider);
    const tx = await safeContract.functions.proposeTransaction(transaction);
    await tx.wait();
    return tx;
  };

  const approveTransfer = async ({ safeAddress, transaction }: executeTransParam) => {
    const safeContract = new ethers.Contract(safeAddress, contractAbi, provider);
    const tx = await safeContract.functions.approveTransaction(transaction);
    await tx.wait();
    return tx;
  };

  const rejectTransfer = async ({ safeAddress, transaction }: executeTransParam) => {
    const safeContract = new ethers.Contract(safeAddress, contractAbi, provider);
    const tx = await safeContract.functions.rejectTransaction(transaction);
    await tx.wait();
    return tx;
  };

  return {
    setUpMultiSigSafeAddress,
    addAddressToSafe,
    getSafeInfo,
    executeTransaction,
    getAllTransactions,
    isTxnExecutable,
    proposeTransaction,
    approveTransfer,
    rejectTransfer
  };
};

export default useSafeDetailsAndSetup;