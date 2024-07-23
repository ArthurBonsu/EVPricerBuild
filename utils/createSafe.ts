import Web3 from 'web3';
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';
import Safe, { SafeFactory, SafeAccountConfig } from '@gnosis.pm/safe-core-sdk';

// Declare the window object to ensure TypeScript knows about the Ethereum provider
declare let window: any;

let newSafeAddress: string;
let owners: string[];

export const createSafe = async (threshold: number, extrauseraddreess?: string[]) => {
  // Initialize Web3 with the provider injected by MetaMask
  const web3Provider = window.ethereum;
  const web3 = new Web3(web3Provider);

  // Get accounts from the Web3 provider
  owners = await web3.eth.getAccounts();

  // Add any extra user addresses to the owners array
  if (extrauseraddreess) {
    extrauseraddreess.forEach(user => owners.push(user));
  }

  // Use the first account as the signer
  const owner = web3.eth.accounts.privateKeyToAccount(web3Provider._state.accounts[0]);

  // Initialize the EthersAdapter with the Web3 provider and signer
  const ethAdapter = new EthersAdapter({
    web3,
    signerOrProvider: owner,
  });

  // Create a SafeFactory instance
  const safeFactory: SafeFactory = await SafeFactory.create({ ethAdapter });

  // Configure the Safe account with the owners and threshold
  const safeAccountConfig: SafeAccountConfig = { owners, threshold };
  
  // Deploy the new Safe
  const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig });

  // Get the new Safe address
  newSafeAddress = safeSdk.getAddress();

  // Alert the user with the new Safe address
  alert(`New safe has been created ${newSafeAddress}`);

  return {
    ethAdapter,
    safeFactory,
    owners,
    safeAccountConfig,
    safeSdk,
    newSafeAddress,
    threshold,
  };
};

export default createSafe;
