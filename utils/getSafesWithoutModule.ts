import { ethers } from 'ethers'
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'


import Safe, { SafeFactory, SafeAccountConfig,EthSignSignature } from '@gnosis.pm/safe-core-sdk';
import SafeServiceClient from '@gnosis.pm/safe-service-client'
import  hre from 'hardhat'
const txServiceUrl = "https://safe-transaction.mainnet.gnosis.io/";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any


//get the safes that dont have modules here 

export const getSafesWithoutModule = async () => {
  const web3Provider = window.ethereum
  const provider = new ethers.providers.Web3Provider(web3Provider)
  const owner = provider.getSigner(0)
  const [signer] = await hre.ethers.getSigners();
const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: owner });
const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter });
  const signedUser = await owner.getAddress()
  const { safes } = await safeService.getSafesByOwner(signedUser)
  const getDisabledSafes = safes.map(async (safe: string) => await safeService.getSafeInfo(safe))
  const fetchAll = await Promise.all(getDisabledSafes)

  console.log(fetchAll.filter(({ modules }) => modules.length === 0))
}

export default getSafesWithoutModule

// this will just print out the safes with empty modules
