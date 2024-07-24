import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { ethers } from 'ethers';
//import EthersAdapter from '@gnosis.pm/safe-ethers-lib';
import SafeServiceClient from '@gnosis.pm/safe-service-client';
import { ethAdaptername, signTransactionBrowserProvider, signTransactionSigner, interactWithContract, getBalance } from 'utils/ethadapters';


const CreateTransfer: React.FC = () => {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    const web3Provider = (window as any).ethereum;

    const connectSigner = async () => {
      try {
        if (web3Provider) {
          await web3Provider.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum)
                           
          const signer = await provider.getSigner();
          setSigner(signer);
        } else {
          const provider = new ethers.InfuraProvider('ropsten', 'YourInfuraProjectId');
          console.log('Connected to Infura provider');
          // Infura does not manage accounts, so we cannot get a signer from it
        }
      } catch (error) {
        console.error('Error connecting signer:', error);
      }
    };

    connectSigner();
  }, []);

  const onSubmit = async () => {
    
  const { ethAdapter, owner } = await ethAdaptername();
  const tx = await signTransactionBrowserProvider(ethAdapter, owner, '0x...', 1.0);
  // const result = await interactWithContract(ethAdapter, '0x...', [...], 'myFunction', ...args);
  const balance = await getBalance(ethAdapter, owner);
    if (!signer) {
      console.error('Signer not connected.');
      return;
    }

   
// Set up the Safe contract ABI and address
const safeAbi = ['']; // ABI of the Safe contract
const safeAddress = '0x...'; // Address of the Safe contract

// Create an ethers provider
const provider = new ethers.BrowserProvider(window.ethereum);

// Create a Safe contract instance
const safeContract = new ethers.Contract(safeAddress, safeAbi, provider);

// Implement Safe functionality (e.g., sending assets)
async function sendAsset(amount:Number, recipient:string ) {
  const tx = await safeContract.transfer(
    recipient,
    ethers.parseEther(amount.toString())
  );
  const sentTx = (await provider.getSigner()).sendTransaction(tx);
 // await provider.sendTransaction(signedTx);
}
    
    // Perform transfer logic using safeService
    // Example: await safeService.transfer();
  };

  return (
    <Box>
      {/* Your form components and submit button */}
      <button onClick={onSubmit}>Submit</button>
    </Box>
  );
};

export default CreateTransfer
