                
        import { useCallback, useState, useEffect } from 'react' 
        import useEthers  from 'hooks/useEthers'
        import { useEthersStore  } from 'stores/ethersStore'
        import {SwapTokenTransaction} from 'types/ethers'
      //   import hre, { ethers } from 'hardhat';
       //  import { TokenSwapcontractABI, TokenSwapcontractAddress } from 'constants/constants' 
         import { Signer, BigNumber, ContractFactory, Contract,ethers } from "ethers";
         import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
         import { TransactionResponse } from '@ethersproject/abstract-provider'
         import { TransactionReceipt } from '@ethersproject/abstract-provider'
         import {TokenDepositvalue,   TokenType, TokenTypesDetails, SwapTransactionType } from 'types/index'
         import { useSafeStore} from 'stores/safeStore'
        import { isAddress } from 'ethers/lib/utils';
        import useSafeSdk from 'hooks/useSafeSdk'
        import useSafeInfo, { useSafe } from 'hooks/useSafe'


  // Provider information to be provided
  let txdata:string;
     
  let firstabi:string = "TokenSwapcontractABI";
  let secondabi:string = "TAokenSwapcontractABI2 ";

  // Initialize Web3 provider
let provider = new ethers.providers.Web3Provider(window.ethereum);

// Request user permission to access their Ethereum account
async function requestAccount() {
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } catch (error) {
    console.error('Error requesting account access:', error);
  }
}

// Example usage: Get signer
async function getSigner() {
  // Request account access if not already granted
  if (!window.ethereum.selectedAddress) {
    await requestAccount();
  }

  // Get signer
  const signer = provider.getSigner();
  console.log('Signer:', signer);
}

// Call function to get signer
getSigner();
      
  interface useTransactionProps   {
  nonce: number
  amount: number 
  tokenname: string 
  symbol:string 
   logoUri: string 

 } 
         
         // getting address and state of address
     const address = useEthersStore((state) => state.address)
   //  const provider = useEthersStore((state) => state.provider) // could be used as an alternative
     const setAddress = useEthersStore((state) => state.setAddress)
     const setEtherStore = useEthersStore((state) => state.setEtherStore)

       
     const selectedSafe = useSafeStore((state) => state.selectedSafe)
     const isModuleEnabled = useSafeStore((state) => state.isModuleEnabled)
     const setIsModuleEnabled = useSafeStore((state) => state.setIsModuleEnabled)
   
         const {onConnect,  onDisconnect } = useEthers()
         const {signer, safeSdk, safeService, safeAddress,safeTransaction, approveTransfer, rejectTransfer} = useSafeSdk()
         const { enableSafeModule, safe,isCurrentUserAlreadySigned,safeTxHash, status,  checkIsSigned,refetch,checkIfWaitingForExecution,hasReachedThreshold,executeSafeModule} = useSafe({safeAddress, userAddress:address } );
     
     


    const  useTransactions = async ({ nonce,amount,tokenname, symbol, logoUri} : SwapTransactionType  ) => {
            let [tokentxhash, settokentxhash] = useState('')
         const [isLoading, setIsLoading] = useState (false)
           setIsLoading(true)
           onConnect()     
    
        
                                
      let SwapContract:Contract = new ethers.Contract(firstabi,secondabi, provider )
      let depositamount: BigNumber = BigNumber.from(amount)
        
     // let swapcontracttx: number = SwapContract.connect(provider).swapTKA(depositamount)
    
     let swapcontracttx:TransactionResponse = await SwapContract.swapTKA(depositamount)
   txdata = swapcontracttx.data  
      
     let swapcontracttxreceipt:Promise<TransactionReceipt>  = swapcontracttx.wait() 
     console.log ("contract receipt ", await swapcontracttxreceipt );
       
      tokentxhash = (await swapcontracttxreceipt).transactionHash
     
         
      const swapTransaction: SwapTokenTransaction ={                      
        amount: amount,
        tokentxhash: tokentxhash, 
        tokenname: tokenname,
        symbol: symbol, 
        signer: address,
        txdata:txdata,
        logoUri:logoUri
      }
     
     setIsLoading(false)
  
          
 // approve the transaction to be done
 return {amount,
  tokentxhash,
  tokenname,
  symbol,
   signer, 
  txdata, 
  logoUri, 
  swapTransaction
} 

}


export default useTransactions