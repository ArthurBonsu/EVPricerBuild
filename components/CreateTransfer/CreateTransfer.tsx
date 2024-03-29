import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { ethers } from 'ethers';
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';
import SafeServiceClient from '@gnosis.pm/safe-service-client';

const { InfuraProvider, JsonRpcProvider } = ethers.providers;

const CreateTransfer: React.FC = () => {
  const [signer, setSigner] = useState<any>(null);

  useEffect(() => {
    const web3Provider = (window as any).ethereum;

    const connectSigner = async () => {
      try {
        let provider: ethers.providers.JsonRpcProvider | ethers.providers.InfuraProvider | undefined;
        if (web3Provider) {
          provider = new JsonRpcProvider(web3Provider); // Pass web3Provider to JsonRpcProvider constructor
          const signer = provider.getSigner(); // Get the signer from JsonRpcProvider
          setSigner(signer);
        } else {
          provider = new InfuraProvider('ropsten', 'YourInfuraProjectId');
          // Infura does not manage accounts, so we cannot get a signer from it
        }
      } catch (error) {
        console.error('Error connecting signer:', error);
      }
    };

    if (web3Provider) {
      connectSigner();
    } else {
      console.error('No web3Provider found.');
    }
  }, []); // Removed signer from dependencies to prevent infinite loop

  const onSubmit = async () => {
    if (!signer) {
      console.error('Signer not connected.');
      return;
    }

    const ethAdapter = new EthersAdapter({
      ethers: ethers,
      signerOrProvider: signer
    });

    const safeService = new SafeServiceClient({
      txServiceUrl: 'https://safe-transaction.gnosis.io/ropsten',
      ethAdapter
    });
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

export default CreateTransfer;