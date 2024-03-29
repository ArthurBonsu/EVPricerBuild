import supportedChains from 'constants/supportedChains'
import { Chain } from 'types/ethers'

// getting chains and chain types 
export const isChainSupported = (chainId: number) => !!supportedChains.find((chain: Chain) => chain.chainId === chainId)

export const getChainDetails = (chainId: number) => {
  const chainData = supportedChains.find((chain: Chain) => chain.chainId === chainId)

  if (!chainData) {
    throw new Error('Unsupported chain, please switch network.')
  }

  const API_KEY = process.env.NEXT_PUBLIC_INFURA_ID

  if (chainData.rpc_url.includes('infura.io') && chainData.rpc_url.includes('%API_KEY%') && API_KEY) {
    const rpcUrl = chainData.rpc_url.replace('%API_KEY%', API_KEY)

    return {
      ...chainData,
      rpc_url: rpcUrl,
    }
  }

  return chainData
  
}
