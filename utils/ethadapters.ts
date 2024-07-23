import Web3 from 'web3';
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

// Create adapter to capture the provider and the signer
export const ethAdaptername = async () => {
  // Initialize Web3 with the provider injected by MetaMask
  const web3Provider = window.ethereum;
  const web3 = new Web3(web3Provider);

  // Get accounts and set the first account as the signer
  const accounts = await web3.eth.getAccounts();
  const owner = accounts[0];

  // Initialize the EthersAdapter with the Web3 provider and signer
  const ethAdapter = new EthersAdapter({
    web3,
    signerOrProvider: owner,
  });

  return {
    ethAdapter,
  };
};

export default ethAdaptername;
