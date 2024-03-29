import { Hash } from 'crypto'
import create, { State } from 'zustand'

export interface HashTransaction extends State {
  txhash: string | null
  txdata: string | null
  txamount: number | null
  txname: string | null
  txsymbol: string | null
  txsigner: string | null 
  txlogoUri: string | null 


  setTransaction: (txhash:HashTransaction['txhash']) => void
  setTransactionData: (txdata:HashTransaction['txdata']) => void
  setTransactionAmount: (txamount:HashTransaction['txamount']) => void
  setTransactionName: (txname:HashTransaction['txname']) => void
  setTransactionSymbol: (txsymbol:HashTransaction['txsymbol']) => void
  setTransactionSigner: (txsigner:HashTransaction['txsigner']) => void
  setTransactionTxLogoUri: (txlogoUri:HashTransaction['txlogoUri']) => void
  setEtherStore: (values: Omit<HashTransaction, 'setTransaction' | 'setTransactionData' | 'setTransactionAmount' | 'setTransactionName'| 'setTransactionSymbol' | 'setTransactionSigner' | 'setTransactionTxLogoUri'>) => void
}


 


export const useHashTransactionStore = create<HashTransaction>((set) => ({
  txhash: null,
  txdata: null,
  txamount: null,
  txname: null,
  txsymbol:  null,
  txsigner:  null, 
  txlogoUri:  null,
  tokenaddress: null,  
  setTransaction: (txhash) => set({ txhash }),  
  setTransactionData: (txdata) => set({ txdata }),
  setTransactionAmount: (txamount) => set({ txamount }),
  setTransactionName: (txname) => set({   txname }),
  setTransactionSymbol: (txsymbol) => set({ txsymbol }),
  setTransactionSigner: ( txsigner)=> set({ txsigner }),
  setTransactionTxLogoUri: ( txlogoUri) => set({   txlogoUri}),
  setEtherStore: (values) => set(values),
 
 

// use tx data 
}))

