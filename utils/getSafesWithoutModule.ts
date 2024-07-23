import { ethers } from 'ethers';
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';
import SafeServiceClient from '@gnosis.pm/safe-service-client';

const txServiceUrl = "https://safe-transaction.mainnet.gnosis.io/";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

// Get the safes that don't have modules
export const getSafesWithoutModule = async () => {
  const web3Provider = window.ethereum;
  const provider = new ethers.providers.Web3Provider(web3Provider);
  const owner = provider.getSigner(0);
  
  const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: owner });
  const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter });
  
  const signedUser = await owner.getAddress();
  const { safes } = await safeService.getSafesByOwner(signedUser);
  
  const getDisabledSafes = safes.map(async (safe: string) => await safeService.getSafeInfo(safe));
  const fetchAll = await Promise.all(getDisabledSafes);

  console.log(fetchAll.filter(({ modules }) => modules.length === 0));
};

export default getSafesWithoutModule;

// This will just print out the safes with empty modules
