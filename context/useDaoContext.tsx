import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import   { TransactionRequest }  from "@ethersproject/abstract-provider";
import { BlockchainTransaction } from "types/ethers";
import {PaymentTransactions} from 'types/index'

//import { contractABI, contractAddress } from '../constants/constants';



const contractABI = "";
const contractAddress = "";

const { ethereum } = window;






const useDaoContext = () => {
    
  const createEthereumContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);


  return transactionsContract;
};

// Provides transaction information here 

  const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);

  const [safeDetails, setSafeDetails] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentTransactionReceipt, setPaymentTransactionReceipt] = useState({});
  const [paidTokenAmount, setPaidTokenAmount] = useState(0);


  // Connecting to the Smart Contract
  // Pull transaction
  // Using options 1
  // Using Option 2 for Etherscan
  
  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = await createEthereumContract();
        const availableTransactions = await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map((transaction:BlockchainTransaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / (10 ** 18)
        }));

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
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

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        getAllTransactions();
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
        const transactionsContract = await createEthereumContract();
        const currentTransactionCount = await transactionsContract.getTransactionCount();

        window.localStorage.setItem("transactionCount", currentTransactionCount);
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

 const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const createProposal = async (title: string, description: string) => {
    try {
      if (ethereum) {
        const contract = await createEthereumContract();
        setIsLoading(true);
        
        const proposalTx = await contract.createProposal(title, description);
        await proposalTx.wait();
        
        setIsLoading(false);
        return proposalTx.hash;
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const voteOnProposal = async (vote: string) => {
    try {
      if (ethereum) {
        const contract = await createEthereumContract();
        setIsLoading(true);
        
        const voteTx = await contract.vote(vote === 'yes');
        await voteTx.wait();
        
        setIsLoading(false);
        return voteTx.hash;
      }
    } catch (error) {
      console.error("Error voting on proposal:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const executeProposal = async () => {
    try {
      if (ethereum) {
        const contract = await createEthereumContract();
        setIsLoading(true);
        
        const executeTx = await contract.executeProposal();
        await executeTx.wait();
        
        setIsLoading(false);
        return executeTx.hash;
      }
    } catch (error) {
      console.error("Error executing proposal:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const approveProposal = async () => {
    try {
      if (ethereum) {
        const contract = await createEthereumContract();
        setIsLoading(true);
        
        const approveTx = await contract.approveProposal();
        await approveTx.wait();
        
        setIsLoading(false);
        return approveTx.hash;
      }
    } catch (error) {
      console.error("Error approving proposal:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const rejectProposal = async () => {
    try {
      if (ethereum) {
        const contract = await createEthereumContract();
        setIsLoading(true);
        
        const rejectTx = await contract.rejectProposal();
        await rejectTx.wait();
        
        setIsLoading(false);
        return rejectTx.hash;
      }
    } catch (error) {
      console.error("Error rejecting proposal:", error);
      setIsLoading(false);
      throw error;
    }
  };
  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = await createEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [{
            from: currentAccount,
            to: addressTo,
            gas: "0x5208",
            value: ethers.utils.formatEther(parsedAmount),
          }],
        });

        const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount = await transactionsContract.getTransactionCount();

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

  // Enhanced payment function based on useTransactionContext
  const sendPayment = async ({ data, username, address, amount, timestamp, ...rest }: PaymentTransactions) => {
    setIsPaid(false);
    try {
      if (ethereum) {
        const transactionsContract = await createEthereumContract();
        setIsPaid(true);

        const amountOfTokens = ethers.utils.parseEther(amount.toString());
        
        console.log("Payment amount in tokens:", amountOfTokens);

        // Pay the fee
        const paymentAmountTx = await transactionsContract.payfee(rest.USDprice);
        const paymentReceipt = await paymentAmountTx.wait();

        console.log("Payment fee receipt:", paymentReceipt);
        console.log("Payment fee hash:", paymentReceipt.transactionHash);

        // Listen for payment event
        const filter = transactionsContract.filters.payfeeevent(rest.receipient, rest.USDprice);
        const results = await transactionsContract.queryFilter(filter);

        console.log("Payment event results:", results);

        const paymentReceiptAddress = paymentReceipt.events[0].args.sender.toString();
        const paymentPriceEvented = paymentReceipt.events[0].args.amount.toNumber();

        console.log('Payment sender address:', paymentReceiptAddress);
        console.log('Payment amount from event:', paymentPriceEvented);

        // Update states
        setPaidTokenAmount(amount);
        setPaymentTransactionReceipt(paymentReceipt);
        setIsPaid(true);

        // Update transaction count
        const transactionsCount = await transactionsContract.getTransactionCount();
        setTransactionCount(transactionsCount.toNumber());

      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.error("Error in sendPayment:", error);
      setIsPaid(false);
      throw error;
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };



  return {

        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
        sendPayment,
        createProposal,
       voteOnProposal,
      executeProposal,
       approveProposal,
        rejectProposal,
        safeDetails,
        isPaid,
        paymentTransactionReceipt,
        paidTokenAmount
      }
}


    export default useDaoContext;
