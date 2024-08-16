import React, { useEffect, useState } from "react";
import { Contract, ethers, Signer, BigNumberish} from "ethers";

let contractABI = ""; // Populate with your contract's ABI
let contractAddress = " "; // Populate with your contract's address

import { SwapNewTokenTransaction } from 'types/ethers';
const chai = require("chai");
const BN = require('bn.js');
chai.use(require('chai-bn')(BN));
const chaiaspromised = require("chai-as-promised");
const { Wallet } = require("ethers");
const { ethereum } = window;
require("@nomiclabs/hardhat-web3");
import { Provider } from "@ethersproject/providers";
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';

interface SwapProp {
  transactionObject: SwapNewTokenTransaction;
  tokenAname: string;
  symbolA: string;
  tokenBname: string;
  symbolB: string;
  amount: number;
  newamount: string;
  newcontract: Contract;
}

interface sendTransactionProp {
  signer: Signer;
  provider: Web3Provider;
  transactionObject: SwapNewTokenTransaction;
  newcontract: Contract;
}

const useSwapContext = () => {
  const createEthereumContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)   
          
    const signer = await provider.getSigner();
    const swapContract = new ethers.Contract(contractAddress, contractABI, signer);
    return { swapContract, signer, provider };
  };

  let accounts: Array<string>;
  const [formData, setformData] = useState({ tokenAname: "", symbolA: "", tokenBname: "", symbolB: "", amount: 0, newamount: 0 });
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountsretrieved, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [origamount, setTokenAmount] = useState(0);
  const [newtokenamount, setNewTokenAmount] = useState(0);
  const [transactions, setSwapTransactions] = useState({ tokenAname: "", symbolA: "", tokenBname: "", symbolB: "", amount: 0, newamount: 0, swaphash: "", from: "", to: "" });
  const [transactioninfocase, setTransactionInfo] = useState({});
  const [transactionCount, setTransactionCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const swapTKA = async ({ tokenAname, symbolA, tokenBname, symbolB, amount }: SwapProp) => {
    try {
      if (ethereum) {
        const { swapContract, signer, provider } = await createEthereumContract();
        const amountoftokens = ethers.utils.parseEther(amount.toString());

        console.log("This is the amount of tokens", amountoftokens);

        const newswaptransaction = await swapContract.swapTKA(amountoftokens);
        const newtransaction = await newswaptransaction.wait();
        setSwapTransactions(newswaptransaction);

        const filter = swapContract.filters.eventswapTKA(0); // Updated to correct filter usage
        const results = await swapContract.queryFilter(filter);

        console.log(results);

        const counterretrieved = newtransaction.events[0].args.swapTKAcounter.toNumber();
        const initialamount = newtransaction.events[0].args.initialamount.toNumber();
        const newtokenamount = newtransaction.events[0].args.amountafter.toNumber();
        console.log('counterretrieved', counterretrieved);
        console.log('initialamount', initialamount);
        console.log('newtokenamount', newtokenamount);

        const transactionObject = {
          tokenAname,
          symbolA,
          tokenBname,
          symbolB,
          amount,
          newamount: newtokenamount,
          swaphash: newtransaction.transactionHash,
          from: accounts[0],
          to: newtransaction.to
        };

        setTransactionInfo(transactionObject);
        setformData({ tokenAname, symbolA, tokenBname, symbolB, amount, newamount: newtokenamount });
      
        await sendTransaction({ signer, provider: provider as any, transactionObject, newcontract: swapContract });

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
    try {
      if (ethereum) {
        const { swapContract, signer, provider } = await createEthereumContract();
        const amountoftokens = ethers.utils.parseEther(amount.toString());

        console.log("This is the amount of tokens", amountoftokens);
        const newswapTKAtransaction = await swapContract.swapTKA(amountoftokens);
        const transactionreceipt = await newswapTKAtransaction.wait();

        console.log("Swap Transaction For TKA", newswapTKAtransaction);
        console.log('new TKA Transaction hash', newswapTKAtransaction.hash);
        setSwapTransactions(newswapTKAtransaction);

        const filter = swapContract.filters.eventswapTKA(0); // Updated to correct filter usage
        const results = await swapContract.queryFilter(filter);

        console.log(results);

        const counterretrieved = transactionreceipt.events[0].args.swapTKXcounter.toNumber();
        const initialamount = transactionreceipt.events[0].args.initialamount.toNumber();
        const newtokenamount = transactionreceipt.events[0].args.amountafter.toNumber();
        console.log('counterretrieved', counterretrieved);
        console.log('initialamount', initialamount);
        console.log('newtokenamount', newtokenamount);

        const transactionObject = {
          tokenAname,
          symbolA,
          tokenBname,
          symbolB,
          amount,
          newamount: newtokenamount,
          swaphash: newswapTKAtransaction.hash,
          from: accounts[0],
          to: newswapTKAtransaction.to
        };

        setformData({ tokenAname, symbolA, tokenBname, symbolB, amount, newamount: newtokenamount });
        setTokenAmount(amount);
        setNewTokenAmount(newtokenamount);
        setTransactionInfo(transactionObject);
        await sendTransaction({ signer, provider: provider as any, transactionObject, newcontract: swapContract });

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
        const { swapContract } = await createEthereumContract();
        const swapContractCount = await swapContract.getTransactionCount();

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

      let accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setAccounts(accounts);
      setCurrentAccount(accounts[0]);
      window.location.reload();
      return accounts;
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const sendTransaction = async ({ signer, provider, transactionObject, newcontract }: sendTransactionProp) => {
    try {
      if (ethereum) {
        const accounts = await connectWallet();
        await signer.connect(provider).sendTransaction(transactionObject);

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
    swapTKA,
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
  };
};

export default useSwapContext;
