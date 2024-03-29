import { ethers } from 'ethers'
const hre = require ("hardhat")
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'

export const ethAdaptername = async () => {
    const web3Provider = window.ethereum
    const provider = new hre.ethers.providers.Web3Provider(web3Provider)
    const owner = provider.getSigner(0)
    
   const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: owner
      })
      return {
        ethAdapter
      }

    }
export   default ethAdaptername