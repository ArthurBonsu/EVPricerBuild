import React, { useEffect, useState } from "react";
import { ethers, Signer, BigNumberish, Contract, BrowserProvider } from "ethers";
import { PaymentTransactions, SimpleTransferTranscations, Receipients } from 'types/index';
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Provider } from "@ethersproject/providers";
import chai from "chai";
import BN from "bn.js";
import "chai-as-promised";
import { contractAddress } from '../constants/constants';

chai.use(require("chai-bn")(BN));

const { ethereum } = window;

let contractABI = "";
let contractAddress = "";

interface TransactionParams {
  username?: string;
  contractaddress: string;
  amount: number;
  comment?: string;
  timestamp: Date;
  receipient: string;
  receipients?: Array<string>;
  txhash: string;
  USDprice?: number;
  paymenthash?: string;
  owneraddress: string;
  newcontract?: Contract;
}

interface SimpleTransferParams {
  username?: string;
  contractaddress: string;
  amount: number;
  comment?: string;
  timestamp: Date;
  receipient: string;
  receipients?: Array<string>;
  txhash: string;
  USDprice?: number;
  paymenthash?: string;
  owneraddress: string;
  newcontract?: Contract;
}

interface SendTransactionProps {
  signer: Signer;
  provider:BrowserProvider;
  transactionObject?: PaymentTransactions;
  transactionRequest?: TransactionRequest;
  newcontract?: Contract;
}

const useTransactionContext = () => {
  const createEthereumContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const SimpleTransfer = new ethers.Contract(contractAddress, contractABI, signer);
    return { SimpleTransfer, signer, provider };
  };

  const [PaymentformData, setPaymentFormData] = useState<TransactionParams>({
    username: "",
    contractaddress: "",
    amount: 0,
    comment: "",
    timestamp: new Date(),
    receipient: "",
    receipients: [],
    txhash: "",
    USDprice: 0,
    paymenthash: "",
    owneraddress: ""
  });

  const [transferformData, setTransferFormData] = useState<TransactionParams>({
    username: "",
    contractaddress: "",
    amount: 0,
    comment: "",
    timestamp: new Date(),
    receipient: "",
    receipients: ["0x"],
    txhash: "",
    USDprice: 0,
    paymenthash: "",
    owneraddress: ""
  });

  const [currentAccount, setCurrentAccount] = useState("");
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount") || "0");
  const [paymentTransactionReceipt, setPayment] = useState({});
  const [transferTransaction, setTransfer] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [tokenTxReceipt, setTokenTxReceipt] = useState({});
  const [transferredTokenAmount, setTransferredTokenAmount] = useState(0);
  const [paidTokenAmount, setPaidTokenAmount] = useState(0);
  const [ourUSDPrice, setUSDPrice] = useState(0);
  const [accountsProvided, setAccountsProvided] = useState<string[]>([]);
  const [paymentTransactionRequest, setPaymentTransactionRequest] = useState<TransactionRequest>({});
  const [transferTransactionRequest, setTransferTransactionRequest] = useState<TransactionRequest>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setPaymentFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const sendPayment = async ({ username, amount, contractaddress, receipient, USDprice, txhash, paymenthash, owneraddress, timestamp }: TransactionParams) => {
    setIsPaid(false);
    try {
      if (ethereum) {
        const { SimpleTransfer, signer, provider } = await createEthereumContract();
        setIsPaid(true);

        const amountOfTokens = ethers.parseEther(amount.toString());

        console.log("This is the amount of tokens", amountOfTokens);

        const paymentAmountTx = await SimpleTransfer.payfee(USDprice);
        const paymentReceipt = await paymentAmountTx.wait();

        console.log("Payment Fee", paymentReceipt);
        console.log("Payment fee hash", paymentReceipt.transactionHash);

        const filter = SimpleTransfer.filters.payfeeevent(receipient, USDprice);
        const results = await SimpleTransfer.queryFilter(filter);

        console.log(results);

        const paymentReceiptAddress = paymentReceipt.events[0].args.sender.toString();
        const paymentPriceEvented = paymentReceipt.events[0].args.amount.toNumber();

        console.log('paymentAddress', paymentReceiptAddress);
        console.log('paymentPriceEvented', paymentPriceEvented);

        const transactionObject: PaymentTransactions = {
          username: username || "",
          address: contractaddress,
          amount: amount,
          comment: "",
          timestamp: new Date(),
          receipient: "",
          receipients: [""],
          txhash: txhash,
          USDprice: USDprice || 0,
          paymenthash: paymenthash || "",
          owneraddress: owneraddress
        };

        const transactionRequest: TransactionRequest = {
          to: owneraddress,
          from: contractaddress,
          nonce: await SimpleTransfer.getTransactionCount(),
          data: paymentReceipt.transactionHash,
          value: amountOfTokens
        };

        setPaymentFormData(transactionObject);
        setPaidTokenAmount(amount);
        setPayment(paymentReceipt);
        setPaymentTransactionRequest(transactionRequest);

        await sendTransaction({ signer, provider, transactionObject, transactionRequest, newcontract: SimpleTransfer });
        setIsPaid(true);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendSimpleTransfer = async ({ username, contractaddress, amount, comment, timestamp, receipient, receipients, txhash, USDprice, paymenthash, owneraddress }: SimpleTransferParams) => {
    try {
      if (ethereum) {
        const { SimpleTransfer, signer, provider } = await createEthereumContract();
        const amountOfTokens = ethers.parseEther(amount.toString());

        console.log("This is the amount of tokens", amountOfTokens);

        if (receipients) {
          receipients.forEach((item, index) => {
            receipient = receipients[index];
          });

          const submitTokenTx = await SimpleTransfer.transferFrom(contractaddress, receipient, amountOfTokens);
          const tokenSubmitTxReceipt = await submitTokenTx.wait();
          setTokenTxReceipt(tokenSubmitTxReceipt);

          const filter = SimpleTransfer.filters.transfer(0);
          const results = await SimpleTransfer.queryFilter(filter);

          console.log(results);

          const addressRetrieved = tokenSubmitTxReceipt.events[0].args.address.toString();
          const receipientRetrieved = tokenSubmitTxReceipt.events[0].args.receipient.toString();
          const newTokenAmount = tokenSubmitTxReceipt.events[0].args.amount.toNumber();

          console.log('addressRetrieved', addressRetrieved);
          console.log('receipientRetrieved', receipientRetrieved);
          console.log('newTokenAmount', newTokenAmount);

          const transactionObject: SimpleTransferParams = {
            username: username || "",
            contractaddress: contractaddress,
            amount: amount,
            comment: comment || "",
            timestamp: timestamp,
            receipient: receipient,
            receipients: receipients || [],
            txhash: txhash,
            USDprice: USDprice || 0,
            paymenthash: paymenthash || "",
            owneraddress: owneraddress
          };

          const transactionRequest: TransactionRequest = {
            from: contractaddress,
            to: receipient,
            value: amountOfTokens,
            nonce: await SimpleTransfer.getTransactionCount(),
          };

          setTransferFormData({
            username: username || '',
            contractaddress: contractaddress,
            amount: amount,
            comment: comment || '',
            timestamp: timestamp,
            receipient: receipient,
            receipients: receipients || [],
            txhash: txhash,
            USDprice: USDprice || 0,
            paymenthash: paymenthash || '',
            owneraddress: owneraddress
          });
          await sendTransaction({ signer, provider, transactionRequest, newcontract: SimpleTransfer });
          setTransferredTokenAmount(amount);
          setTransferTransactionRequest(transactionRequest);
        }
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        useTransactionContext();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionsExist = async () => {
    try {
      if (ethereum) {
        const { SimpleTransfer } = await createEthereumContract();
        const SimpleTransferCount = await SimpleTransfer.getTransactionCount();
        window.localStorage.setItem("transactionCount", SimpleTransferCount.toString());
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setAccountsProvided(accounts);
      setCurrentAccount(accounts[0]);
      window.location.reload();
      return accounts;
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const sendTransaction = async ({ signer, provider, transactionRequest, newcontract }: SendTransactionProps) => {
    try {
      if (ethereum) {
        await connectWallet();
        if (transactionRequest) {
          await signer.sendTransaction(transactionRequest);
        }

        if (newcontract) {
          const transactionsCount = await newcontract.getTransactionCount();
          setTransactionCount(transactionsCount.toNumber());
        }

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
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, [transactionCount]);

  return {
    sendPayment,
    sendSimpleTransfer,
    transactionCount,
    connectWallet,
    currentAccount,
    isLoading,
    sendTransaction,
    handleChange,
    PaymentformData,
    transferformData,
    paymentTransactionReceipt,
    transferTransaction,
    isPaid,
    tokenTxReceipt,
    transferredTokenAmount,
    paidTokenAmount,
    ourUSDPrice,
    accountsProvided
  };
};

export default useTransactionContext;
