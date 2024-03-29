import React, { useEffect, useState } from "react";
import { ContractFactory, ethers, Signer, BigNumber,Contract } from "ethers";

//import { contractABI, contractAddress } from '../constants/constants';
let contractABI= "";
let contractAddress = " "; 

import { SwapNewTokenTransaction  } from 'types/ethers'
const chai  = require("chai");
const BN =require('bn.js')
chai.use(require('chai-bn')(BN));
const chaiaspromised = require("chai-as-promised");
const { Wallet } = require("ethers");
const { ethereum } = window;
require("@nomiclabs/hardhat-web3")
import {Provider} from "@ethersproject/providers"


interface SwapProp{
  transactionObject:SwapNewTokenTransaction,
  tokenAname: string,
  symbolA:string, 
  tokenBname:string,
  symbolB:string,
  amount:number,
  newamount: string
  newcontract: Contract  
}


interface sendTransactionProp {
 signer: Signer 
provider: Provider 
transactionObject:SwapNewTokenTransaction
newcontract: Contract
}

const useSwapContext = () => {
    
 const createEthereumContract = () => {
  // Also like passing API key to infura this is normally done for wallet cases and things that work like Infura
  const provider = new ethers.providers.Web3Provider(ethereum);
   
  // is it calling this thhing Wallet now (since API is passed)
  //FOR SIGNERS
  const signer = provider.getSigner();
    
  // And making the signer the active we can retrieve the address inside
  let thisaccount = signer.connect(provider);
  thisaccount.getAddress();

  // WE USE THE REQUEST PROCESS



  const swapContract: Contract = new ethers.Contract(contractAddress, contractABI, signer);
  swapContract.connect(signer);
  return {swapContract, signer, provider, thisaccount} ;
};

  let accounts:Array<string> 
// Provides transaction information here 
// Picking these values from the form 
  const [formData, setformData] = useState({ tokenAname: "", symbolA: "",  tokenBname: "", symbolB: "", amount: 0, newamount: 0  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountsretrieved, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
 //  const [amount, setTokenAmount] = useState(localStorage.getItem("TokenSwapAmount"));

 const [origamount, setTokenAmount] = useState(0);  
 const [newtokenamount, setNewTokenAmount] = useState(0);
  const [transactions, setSwapTransactions] = useState({tokenAname:"",symbolA:"", tokenBname:"",symbolB:"",amount:0,newamount:0, swaphash: "",from: "",to:"" });
 
  const [transactioninfocase, setTransactionInfo] = useState({})
  const [transactionCount, setTransactionCount] = useState(0)
 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  // Connecting to the Smart Contract
  // Pull transaction
  // Using options 1
  // Using Option 2 for Etherscan
  
 const swapTKA = async ({ tokenAname, symbolA, tokenBname, symbolB, amount }: SwapProp) => {
  const swapcounter: number =0;
  try {
      if (ethereum) {
        const {swapContract, signer, provider, thisaccount} = createEthereumContract();
        const amountoftokens =  ethers.BigNumber.from(amount);
     
        console.log("This is the amount of tokens",amountoftokens );
 
        const newswaptransaction  = await swapContract.swapTKA(amountoftokens) ;
        const newtransaction =        newswaptransaction.wait()
        setSwapTransactions(newswaptransaction);
        
        const filter = swapContract.filters.eventswapTKA(swapcounter );
        const results = await swapContract.queryFilter(filter) ;

        
        console.log(results); 
       

         const counterretrieved:number = newtransaction.events[0].args.swapTKAcounter.toNumber();
         const initialamount:number = newtransaction.events[0].args.initialamount.toNumber();
         const newtokenamount:number = newtransaction.events[0].args.amountafter.toNumber();
         console.log('counterretrieved',counterretrieved); 
         console.log('initialamount',initialamount); 
         console.log('newtokenamount',newtokenamount); 
         
        const newcontract=swapContract;
        swapcounter+1;
        const transactionObject = {
        tokenAname:tokenAname,
        symbolA:symbolA,
        tokenBname: tokenBname,
        symbolB: symbolB,
        amount: amount, 
        newamount: newtokenamount ,
         swaphash: newtransaction.hash ,
        from: accounts[0] ,
        to: newtransaction.to 
       }
       
      setTransactionInfo(transactionObject);
      
      swapcounter+1;
   
    
      setformData({ tokenAname: tokenAname, symbolA: symbolA,   tokenBname:tokenBname, symbolB: symbolB, amount: amount, newamount: newtokenamount  }); 
     sendTransaction({signer,provider,transactionObject, newcontract});
     setTokenAmount(amount);
     setNewTokenAmount(newtokenamount);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const swapTKX = async ({ tokenAname, symbolA, tokenBname, symbolB, amount }: SwapProp) => {
        const swapcounter: number =0;
    try {
      if (ethereum) {
        const {swapContract, signer, provider} = createEthereumContract();
      
       const newcontract = swapContract;
        // passing in value here
        const amountoftokens =  ethers.BigNumber.from(amount);
     
        console.log("This is the amount of tokens",amountoftokens );
        const newswapTKAtransaction = await swapContract.swapTKA(amountoftokens) ;
        
       const transactionreceipt =     newswapTKAtransaction.wait();
       
          console.log ("Swap Transaction For TKA", newswapTKAtransaction);


          console.log ('new TKA Transaction hash' +  await newswapTKAtransaction.hash);
        setSwapTransactions(newswapTKAtransaction);
        swapcounter+1;
         
        const filter = swapContract.filters.eventswapTKA(swapcounter );
        const results = await swapContract.queryFilter(filter) ;

        
        console.log(results); 
       
         const counterretrieved:number = transactionreceipt.events[0].args.swapTKXcounter.toNumber();
         const initialamount:number = transactionreceipt.events[0].args.initialamount.toNumber();
         const newtokenamount:number = transactionreceipt.events[0].args.amountafter.toNumber();
         console.log('counterretrieved',counterretrieved); 
         console.log('initialamount',initialamount); 
         console.log('newtokenamount',newtokenamount); 

          const   transactionObject  = {
          tokenAname:tokenAname,
          symbolA:symbolA,
          tokenBname: tokenBname,
          symbolB: symbolB,
          amount: amount, 
          newamount: newtokenamount ,
          swaphash: newswapTKAtransaction.hash ,
          from: accounts[0],
          to: newswapTKAtransaction.to 
         }

         setformData({ tokenAname: tokenAname, symbolA: symbolA,   tokenBname:tokenBname, symbolB: symbolB, amount: amount, newamount: newtokenamount  }); 
         setTokenAmount(amount);
         setNewTokenAmount(newtokenamount);
        setTransactionInfo(transactionObject);
        sendTransaction({signer,provider,transactionObject, newcontract});
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };


  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      accounts = await ethereum.request({ method: "eth_accounts" });
     
      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        useSwapContext();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

   const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const {swapContract, signer, provider, thisaccount} = createEthereumContract();
        const swapContractCount = await swapContract.getTransactionCount();

        // transaction confirmation to know transaction signature

        window.localStorage.setItem("transactionCount", swapContractCount);
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

 const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

        // the blockchain accounts here
     let  accounts = await ethereum.request({ method: "eth_requestAccounts", });
     setAccounts(accounts)
      // the specific account
      setCurrentAccount(accounts[0]);
      window.location.reload();
      return accounts;

    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  
};

  const sendTransaction = async ({signer,provider, transactionObject,newcontract} :sendTransactionProp) => {
    try {
      if (ethereum) {     
      
      //  const parsedAmount = ethers.utils.parseEther(amount);
       // WE WILL NOT BE WORKING WITH PAYMENT PER SAY BUT JUST SIMPLE TOKEN SUBMISSION
          const accounts =   connectWallet();
            signer.connect(provider).sendTransaction(transactionObject);

        const transactionsCount = await newcontract.getTransactionCount();
            
        setTransactionCount(transactionsCount.toNumber());
        window.location.reload();
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };


  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, [transactionCount]);

  return {
        swapTKA ,
        swapTKX,
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
        accountsretrieved,
        origamount,
        newtokenamount
      }
}


    export default useSwapContext;
