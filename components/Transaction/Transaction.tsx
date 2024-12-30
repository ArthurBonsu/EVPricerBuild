
import {InputGroup,  Text,Input, InputRightAddon,  Heading , Image , Stack} from "@chakra-ui/react";
import { FC, useEffect,  useCallback, useState, useContext } from 'react'
import { shortenAddress } from "../../constants/shortenAddress";
import dummyData from "../../constants/dummyData"
//STORES
import { useSwapStore  } from 'stores/ContextStores/useSwapStore'
import { useEthersStore  } from 'stores/ethersStore'
import { useSafeStore  } from 'stores/safeStore'
import { useTransactionStore } from 'stores/transactionStore';
import { useUserStore  } from 'stores/userStore'

//HOOKS
import  useEthers   from 'hooks/useEthers'
import  useFetch   from 'hooks/useFetch'
import  useLoadSafe   from 'hooks/useLoadSafe'


import useTransactions   from 'hooks/useTokenTransactions'

import getSafeInfo from 'hooks/useLoadSafe'
//Context 
import  useCrowdsourceContext   from 'context/useCrowdsourceContext'
import  useDaoContext   from 'context/useDaoContext'
import  useSwapContext   from 'context/useSwapContext'
import  useTransactionContext   from 'context/useTransactionContext'
import useTransferContext   from 'context/usegetAllTransactionsContext'


type TransactionsCardProps = {
  addressTo: string;
  addressFrom: string;
  timestamp: string;
  message: string;
  keyword: string;
  amount: number;
  url: string;
};

const TransactionsCard: React.FC<TransactionsCardProps> = ({ addressTo, addressFrom, timestamp, message, keyword, amount, url }) => {
  const gifUrl = useFetch({ keyword });

  return (
    <div className="bg-[#181918] m-4 flex flex-1
      2xl:min-w-[450px]
      2xl:max-w-[500px]
      sm:min-w-[270px]
      sm:max-w-[300px]
      min-w-full
      flex-col p-3 rounded-md hover:shadow-2xl"
    >
      <div className="flex flex-col items-center w-full mt-3">
        <div className="display-flex justify-start w-full mb-6 p-2">
          <a href={`https://ropsten.etherscan.io/address/${addressFrom}`} target="_blank" rel="noreferrer">
            <p className="text-white text-base">From: {shortenAddress(addressFrom)}</p>
          </a>
          <a href={`https://ropsten.etherscan.io/address/${addressTo}`} target="_blank" rel="noreferrer">
            <p className="text-white text-base">To: {shortenAddress(addressTo)}</p>
          </a>
          <p className="text-white text-base">Amount: {amount} ETH</p>
          {message && (
            <>
              <br />
              <p className="text-white text-base">Message: {message}</p>
            </>
          )}
        </div>
        <Image
          src={gifUrl || url}
          alt="nature"
          className="w-full h-64 2xl:h-96 rounded-md shadow-lg object-cover"
        />
        <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
          <p className="text-[#37c7da] font-bold">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};
const Transaction = () => {

    const { transactions, currentAccount } = useTransferContext();


    return (
        <Stack spacing={6}>
  
  <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        {currentAccount ? (
          <h3 className="text-white text-3xl text-center my-2">
            Latest Transactions
          </h3>
        ) : (
          <h3 className="text-white text-3xl text-center my-2">
            Connect your account to see the latest transactions
          </h3>
        )}
          Transaction Details
        <div className="flex flex-wrap justify-center items-center mt-10">
          {[...dummyData, ...transactions].reverse().map((transaction, i) => {
            const transactionWithKeyword: TransactionsCardProps = { 
              ...transaction, 
              keyword: transaction.message || 'default', 
              amount: parseFloat(transaction.amount.toString()), // Convert to string before parsing
              addressTo: '', // Add the missing properties
              addressFrom: '',
              url: '',
              timestamp: transaction.timestamp.toString() // Convert BigNumber to string
            };
            return <TransactionsCard key={i} {...transactionWithKeyword} />
          })}
        </div>
      </div>
    </div>
</Stack>
    )
}


export default Transaction;