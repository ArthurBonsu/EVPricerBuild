// useSafeDetails.ts
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { PaymentTransactions } from 'types';

// Define the provider
const provider: Web3Provider = new ethers.providers.Web3Provider(window.ethereum);

// Define the contract ABI and bytecode
const contractAbi: ethers.ContractInterface = [
  // Add ABI entries here
];

// Get the signer
const signer = provider.getSigner();

const contractBytecode: string = '0x...'; // Replace with the actual bytecode

// Define the addresses array
const addresses: string[] = [];

// Define the interfaces
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

// setUpMultiSigSafeAddress
// addAddressToSafe
// getSafeInfo
// executeTransaction
// getAllTransactions
// isTxnExecutable
// proposeTransaction
// approveTransfer
// rejectTransfer



export const useSafeDetailsAndSetup = {
  setUpMultiSigSafeAddress: async (address: string) => {
    // Deploy the Safe contract instance
    const safeFactory = new ethers.ContractFactory(contractAbi, contractBytecode, signer);
    const safeContract = await safeFactory.deploy(address);
    // Wait for the contract to be deployed
    await safeContract.deployed();
    // Get the deployed contract address
    const deployedAddress = safeContract.address;
    // Store the deployed address in the addresses array
    addresses.push(deployedAddress);
    // Return the deployed address
    return deployedAddress;
  },

  addAddressToSafe: async (safeAddress: string, newAddress: string) => {
    // Get the Safe contract instance
    const safeContract = new ethers.Contract(safeAddress, contractAbi, provider);
    // Add the new address to the Safe contract
    // that is there is a safe owner contract in there
    const tx = await safeContract.addOwner(newAddress);
    await tx.wait();
    // Return the updated list of addresses
    return addresses;
  },

  getSafeInfo: async ({ safeAddress }: SafeInfoParam) => {
    // Get the Safe contract instance
    const safeContract = new ethers.Contract(safeAddress, contractAbi, provider);
    // this will be a function within the smart contract that safe address, names of owners, transaction hashes stored and time.
    // we will retrieve from where storeTransaction in executeTransaction stores it 
    const tx = await safeContract.functions.getModules();
    const modules = await tx.wait();
    // Return the modules
    return modules;
  },

  executeTransaction: async ({ safeAddress, transaction }: executeTransParam) => {
    // Get the Safe contract instance
    const safeContract = new ethers.Contract(safeAddress, contractAbi, provider);
    // Create the transaction
    const tx = {
      to: safeAddress,
      value: 0,
      data: transaction.data,
      gasLimit: ethers.utils.hexlify(1000000),
      nonce: await provider.getTransactionCount(safeAddress),
    };
    const receipt = await provider.sendTransaction(tx.data);
    // Store the transaction data in the smart contract
    await safeContract.functions.storeTransaction(
      safeAddress,
      receipt.timestamp,
      transaction.data,
      true, // or false, depending on whether the transaction was signed
      receipt.hash
    );
    // Return the receipt
    return receipt;
  },

  getAllTransactions: async ({ safeAddress }: SafeInfoParam) => {
    // Get the Safe contract instance
    const safeContract = new ethers.Contract(safeAddress, contractAbi, provider);
    // Call the getMultiSigTransactions function on the contract
    // this could be transaction id and hashes stored in the smart contract 
    const transactions = await safeContract.functions.getMultiSigTransactions();
    // Return the transactions
    return transactions;
  },

  // Check if transaction is executable
  isTxnExecutable: async ({ safeAddress, transaction }: executeTransParam) => {
    // Get the Safe contract instance
    const safeContract = new ethers.Contract(safeAddress, contractAbi, provider);
    // Call the isTransactionExecutable function on the contract
    const executable = await safeContract.functions.isTransactionExecutable(transaction);
    return executable;
  },

  // Propose transaction
  proposeTransaction: async ({ safeAddress, transaction }: executeTransParam) => {
    // Get the Safe contract instance
    const safeContract = new ethers.Contract(safeAddress, contractAbi, provider);
    // Call the proposeTransaction function on the contract
    const tx = await safeContract.functions.proposeTransaction(transaction);
    await tx.wait();
    return tx;
  },

  // Approve transfer
  approveTransfer: async ({ safeAddress, transaction }: executeTransParam) => {
    // Get the Safe contract instance
    const safeContract = new ethers.Contract(safeAddress, contractAbi, provider);
    // Call the approveTransaction function on the contract
    const tx = await safeContract.functions.approveTransaction(transaction);
    await tx.wait();
    return tx;
  },

  // Reject transfer
  rejectTransfer: async ({ safeAddress, transaction }: executeTransParam) => {
    // Get the Safe contract instance
    const safeContract = new ethers.Contract(safeAddress, contractAbi, provider);
    // Call the rejectTransaction function on the contract
    const tx = await safeContract.functions.rejectTransaction(transaction);
    await tx.wait();
    return tx;
  },
};

//Create Safe
// Add User
// Create/ Propose  Transfer 
// Approve Transfer 
// Reject Transfer 
// Check if Transfer  Is Signed


export default useSafeDetailsAndSetup;


 
