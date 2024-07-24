import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { ethers } from 'ethers';
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';
import SafeServiceClient from '@gnosis.pm/safe-service-client';

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


