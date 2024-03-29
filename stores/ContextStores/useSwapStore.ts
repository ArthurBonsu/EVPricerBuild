import create, { State } from 'zustand'

import { Web3Provider } from '@ethersproject/providers/lib'
import { SwapNewTokenTransaction  } from 'types/ethers'
import supportedChains from 'constants/supportedChains'
import { Chain } from 'types/ethers'

interface SwapStore extends State {
  account: string
  accounts: Array<String> 
  provider: Web3Provider | null 
  swaphash: SwapNewTokenTransaction['swaphash']
  setAccount: (account: SwapStore['account']) => void
  setProvider: (provider: SwapStore['provider']) => void
  setAccounts: (accounts: SwapStore['accounts']) => void
  setSwapTransactionHash: (swaptransaction: SwapStore['swaphash']) => void
  setSwapStore: (values: Omit<SwapStore, 'setProvider' | 'setAccount' | 'setProvider' | 'setSwapTransactionHash' | 'setSwapStore' >) => void
}

export const INITIAL_STATE = {
  account: '',
  accounts: [''],
  provider: null, 
  swaphash:  ''
}

export const useSwapStore = create<SwapStore>((set) => ({
  ...INITIAL_STATE,
  setAccount: (account) => set({ account }),
  setProvider: (provider) => set({ provider }),
  setAccounts: (accounts) => set({ accounts }),
  setSwapTransactionHash: (swaphash) => set( {swaphash} ),
  setSwapStore: (values) => set( values )

}))

