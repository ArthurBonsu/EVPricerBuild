import { ExecOptionsWithStringEncoding } from "child_process"
import TXRejectedError from "ganache-core/lib/utils/txrejectederror"

import ethers from 'ethers'
import { Icon, IconProps, Image } from '@chakra-ui/react';
import { Icons } from "next/dist/lib/metadata/types/metadata-types";
import { IconType } from "react-icons";
import { useEffect,useCallback,useContext  } from "react";

export interface Asset {
  symbol: string
  name: string
  decimals: string
  contractAddress: string
  balance?: string
}

export interface Chain {
  name: string
  shortName: string
  chain: string
  network: string
  chainId: number
  networkId: number
  rpc_url: string
  nativeCurrency: Asset
}
export interface  Transactions{

 amount: Number
 tx: string 
 recipient: string 
}

export interface BlockchainTransaction {
  receiver: string;
  sender: string;
  timestamp: ethers.BigNumber;
  message: string;
  keyword: string;
  amount: ethers.BigNumber;
}
export interface SwapTokenTransaction{
  amount: number
  tokentxhash: string 
  tokenname: string
  symbol: string
  logoUri:string 
  signer:string
  txdata?: string
}

export interface SwapNewTokenTransaction{
  tokenAname:string
  symbolA:string
  tokenBname: string
  symbolB: string
  amount: number 
  newamount: number
  swaphash: string 
  from: string 
  to: string  
}


export  interface TransactionDisplayProps {
  account: string; // replace with the actual type
  username: string; // replace with the actual type
  paymenthash: string; // replace with the actual type
  receipients: string[]; // replace with the actual type
  contractowneraddress: string; // replace with the actual type
  amount: number; // replace with the actual type
  usdPrice: number; // replace with the actual type
}


export interface ServiceProps{
  color: string,
  title: string,
  icon: React.ReactNode,
  subtitle: string 
}

export interface TransactionsCardProps {
  addressTo: string;
  addressFrom: string;
  timestamp: string;
  message: string;
  keyword: string;
  amount: number;
  url: string;
}

export interface SignUpProviders{
  signupname: string;
  userIcon : IconType; 
}

export interface SignInProviders {
  name :string 
  credentials?:string
  secret?:string 
}