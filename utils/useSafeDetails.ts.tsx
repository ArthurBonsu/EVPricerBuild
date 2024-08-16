// useSafeDetails.ts
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { PaymentTransactions } from 'types';

// Set up the provider

interface SafeInfoParam {
  provider: Web3Provider
  signer: string
  safeAddress: string
  contractaddress: string 
}

interface executeTransParam {
  provider: Web3Provider
  signer: string
  safeAddress: string
  transaction:  PaymentTransactions
}
const provider: Web3Provider = new ethers.providers.Web3Provider(window.ethereum);

// Set up the contract ABI and bytecode
const contractAbi: ethers.ContractInterface = [
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_owners',
        type: 'address[]',
      },
      {
        internalType: 'uint256',
        name: '_threshold',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  // Add other ABI entries here
];

const contractBytecode: string = '0x...'; // Replace with the actual bytecode

// Set up the contract factory
const contractFactory: ethers.ContractFactory = new ethers.ContractFactory(contractAbi, contractBytecode, provider);





 // safe address
 // safe details
 // execute transactions details
 // safe contract 
 
// Set up the addresses array
const addresses: string[] = [];
 
 
  const useSafeDetailsAndSetup = {
  
   
    setUpMultiSigAddress: async (address: string) => {
      // Deploy the Safe contract instance
      const safeFactory = new ethers.ContractFactory(
        contractAbi,
        contractBytecode,
        provider
      );
      const safeContract = await safeFactory.deploy(address);
    
      // Wait for the contract to be deployed
      await safeContract.deployed();
    
      // Get the deployed contract address
      const deployedAddress = safeContract.address;
    
      // Store the deployed address in the addresses array
      addresses.push(deployedAddress);
    
      // Return the deployed address
      return deployedAddress;
    };


    addAddressToSafe: async (safeAddress: string, newAddress: string) => {
      // Get the Safe contract instance
      const safeContract = new ethers.Contract(safeAddress, contractAbi, provider);
    
      // Add the new address to the Safe contract
      const tx = await safeContract.addOwner(newAddress);
      await tx.wait();
    
      // Return the updated list of addresses
      return addresses;
    };

    
  getSafeInfo: async ({provider, signer, safeAddress} : SafeInfoParam) => {
    const safeContract = new ethers.Contract(safeAddress, [
      'function getModules() public view returns (address[])',
    ]);
    const modules = await safeContract.getModules();
    return modules;
  },

  addAddressToSafe: async (safeAddress: string, newAddress: string) => {
    // Get the Safe contract instance
    const safeContract = new ethers.Contract(safeAddress, contractAbi, provider);
  
    // Add the new address to the Safe contract
    const tx = await safeContract.addOwner(newAddress);
    await tx.wait();
  
    // Return the updated list of addresses
    return addresses;
  };
  

  executeTransaction: async ({provider, signer, safeAddress, transaction} : executeTransParam) => {
    const safeContract = new ethers.Contract(safeAddress, [
      'function execTransaction(address to, uint256 value, bytes data) public',
    ]);

    // get transaction count
    const txCount = await ethers.providers.getTransactionCount();
    const tx = {
      to: safeAddress,
      value: 0,
      data: transaction.data,
      gasLimit: ethers.utils.hexlify(1000000),
      nonce: txCount,
    };
    const signedTx = await signer.signTransaction(tx);
    const receipt = await provider.sendTransaction(signedTx);
    return receipt;
  },
};

export default useSafeDetailsAndSetup;
