import React,{ useCallback, useState, useEffect, useContext } from 'react'
import { chakra, Heading , Stack} from "@chakra-ui/react";

import { ethers } from 'ethers'
const hre = require("hardhat")
import { Button, ButtonProps, Flex, useDisclosure, AlertDialog,Alert,  AlertDialogBody,  AlertDialogCloseButton,  AlertDialogContent,
  AlertDialogFooter,  AlertDialogHeader,  AlertDialogOverlay,   UseDisclosureReturn, Select,FormErrorMessage, FormControl, FormLabel,
  NumberInput,NumberInputField, NumberIncrementStepper,NumberDecrementStepper,NumberInputStepper, Input,IconButton, AlertIcon, Grid,
    Box,  Text,  InputGroup,  InputRightAddon, FormHelperText,Wrap,  WrapItem, VisuallyHidden, VisuallyHiddenInput, Accordion,AccordionItem,AccordionButton,
    AccordionPanel, AccordionIcon } from '@chakra-ui/react'
    
    import { RiArrowDownSLine } from 'react-icons/ri'
import {  createSwapFormSchema, createSwapTransferFormSchema,  } from '../../validation'
  import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";
import { PlusSmIcon, MinusSmIcon } from '@heroicons/react/outline'
import { useFormContext, useFieldArray ,useForm} from 'react-hook-form'
import { CreateSwapTransferInput, CreateTransferInput, SimpleTokenList } from 'types'
import supportedNetworkOptions from 'constants/supportedNetworkOptions'
//STORES
import { useSwapStore  } from 'stores/ContextStores/useSwapStore'
import { useEthersStore  } from 'stores/ethersStore'
import { useSafeStore  } from 'stores/safeStore'
import { useTransactionStore } from 'stores/transactionStore';
import { useUserStore  } from 'stores/userStore';
import { PaymentTransactions } from "types";



//HOOKS
import  useEthers   from 'hooks/useEthers'
import  useFetch   from 'hooks/useFetch'
import  useLoadSafe   from 'hooks/useLoadSafe'


import useTransactions   from 'hooks/useTransactions'

import getSafeInfo from 'hooks/useLoadSafe'
//Context 
import  useCrowdsourceContext   from 'context/useCrowdsourceContext'
import  useDaoContext   from 'context/useDaoContext'
import  useSwapContext   from 'context/useSwapContext'
import  useTransactionContext   from 'context/useTransactionContext'
import useTransferContext   from 'context/useTransferContext'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";


 
import { motion } from 'framer-motion';
import Router from 'next/router'
import { useQuery } from 'react-query'
import queries from "services/queries";
//import { TransactionDisplayProps } from '../../types/ethers';


// Update the SwapProp interface to include the newcontract property
import { SwapProp } from 'types/index';



interface TransactionDisplayProps {
  account: string;
  tokenAname: string;
  symbolA: string;
  tokenBname: string;
  symbolB: string;
  amount: number;
  newamount: number;
  swaphash: string;
  from: string;
  to: string;
}

interface OnSubmitProps {
  tokenAname: string;
  symbolA: string;
  tokenBname: string;
  symbolB: string;
  amount: number;
  newamount?:number;
  newcontract?:number;
}


interface CreateSwapTransferFormProps {
    disclosure: UseDisclosureReturn
    onSubmit: (data: { recipients: Array<CreateSwapTransferInput> }) => void
    isLoading?: boolean
  }
interface SwapCardServiceProps{

  color:string,
  title: string,
  icon: {},
  subtitle: string 
  
}

 const ListOfTokens: SimpleTokenList[] = [

  { tokenname: 'TokenABC',
    symbol: 'ABC'
     },
  {  
    tokenname: 'TokenXYZ',
    symbol: 'XYZ',
   

  },
  
]



  // onchange handling, to post text

  // submission

 //const { tokenuri } = useQuery(`tokenuri}`, queries.getTokenUri('tokenuri'), {
 // enabled: !!tokenuri,
 // cacheTime: 100,
//})
// THE BEAUTIFUL DYNAMIC VIEW HERE CAN BE USED FOR OTHER NAVIGATION VIEW, RIGHT NOW WWE WANT ONLY ONE CARD
  /*
const TransactionDisplay = ({ color, title, icon , subtitle }) => (
  <div className="flex flex-row justify-start items-start white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-xl">
    <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}>
      {icon}
    </div>
    <div className="ml-5 flex flex-col flex-1">
      <h3 className="mt-2 text-white text-lg">{title}</h3>
      <p className="mt-1 text-white text-sm md:w-9/12">
        {subtitle}
      </p>
    </div>
  </div>
);

const SwapTransferService: React.FC<SwapCardServiceProps> = ({
   

  }) => {


    return (
      <div className="flex w-full justify-center items-center gradient-bg-services">
      <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
        <div className="flex-1 flex flex-col justify-start items-start">
          <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient ">
            Services that we
            <br />
            continue to improve
          </h1>
          <p className="text-left my-2 text-white font-light md:w-9/12 w-11/12 text-base">
            The best choice for buying and selling your crypto assets, with the
            various super friendly services we offer
          </p>
        </div>
  
        <div className="flex-1 flex flex-col justify-start items-center">
          <SwapTransferService
            color="bg-[#2952E3]"
            title="Security gurantee"
            icon={<BsShieldFillCheck fontSize={21} className="text-white" />}
            subtitle="Security is guranteed. We always maintain privacy and maintain the quality of our products"
          />
          <SwapTransferService
            color="bg-[#8945F8]"
            title="Best exchange rates"
            icon={<BiSearchAlt fontSize={21} className="text-white" />}
            subtitle="Security is guranteed. We always maintain privacy and maintain the quality of our products"
          />
          <SwapTransferService
            color="bg-[#F84550]"
            title="Fastest transactions"
            icon={<RiHeart2Fill fontSize={21} className="text-white" />}
            subtitle="Security is guranteed. We always maintain privacy and maintain the quality of our products"
          />
        </div>
      </div>
    </div>
  
);
    }
*/

const TransactionDisplay: React.FC<TransactionDisplayProps> = ({ 
  account, 
  tokenAname, 
  symbolA, 
  tokenBname, 
  symbolB,  
  amount,
  newamount, 
  swaphash,
  from, 
  to  
}) => {
  return (
    <Stack spacing={6}>
      <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <Heading as='h1' size='4xl' noOfLines={1}> View Transactions From user:  {account} </Heading>
        <>
          <Text as='b'>First Token: {tokenAname} </Text>
          <Text as='i'>SYMB A: {symbolA}</Text>
          <Text as='u'>Second Token: {tokenBname}</Text>
          <Text as='abbr'>SYMB B: {symbolB}</Text>
          <Text as='cite'>Amount: {amount}</Text>
          <Text as='del'>New Amount: {newamount}</Text>
          <Text as='em'>Transaction Hash: {swaphash}</Text>
          <Text as='ins'>From Address: {from}</Text>
          <Text as='kbd'>To: {to}</Text>
        </>
      </Box>
    </Stack>
  )
}

const SwapTransfer:  React.FC<CreateSwapTransferInput> = ( {tokenAname, symbolA,tokenBname,symbolB, amount} :CreateSwapTransferInput) => {

   /*const schema = yup.object({
  symbol: yup.string().required(),
  tokenstring: yup.string().required(),
  decimals: yup.string().required(),
  logoUri: yup.string().required(),
  address: yup.string().required(),
}).required();
*/
const [isLoading, setIsLoading] = useState(false)
const [isSwapping, setIsSwapping] = useState(true)
const [isTyping, setIsTyping] = useState(true)  
const [transaction,setTransaction] = useState('')
const [token, setToken] = useState({})
const [value, setValue] = useState('')
const [_currentAccount, setCurrentAccount] = useState('')
const [tokenchosen, setTokenChosen] = useState(false);
const [isSubmitted, setIsSubmitted] = useState(false);
  

const schema = yup.object({
  tokenAname: yup.string().required(),
  symbolA: yup.string().required(), 
  tokenBname:yup.string().required(),
  symbolB: yup.string().required(),
  amount:yup.number().required(),
  
}).required();


const {
  register,
  handleSubmit,
  watch,
  // Read the formState before render to subscribe the form state through the Proxy
  formState: {  isDirty, isSubmitting, touchedFields, submitCount, errors },
} = useForm<CreateSwapTransferInput>(

  {  defaultValues: 
    {
      tokenAname:"Ethereum",
      symbolA:'ETH',
      tokenBname: "Solana",
      symbolB: 'SOL',
      amount: 0,
    },
    resolver: yupResolver(schema)
   
   } );

   const amountWatch = watch("amount")
   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    setIsTyping(true)
    setValue(event.target.value)
    setIsTyping(false)
  // Logic of token conversion must be here

}
const {  swapTKA ,swapTKX,transactionCount,connectWallet,transactions,currentAccount,sendTransaction,
  formData,accountsretrieved,origamount,newtokenamount} = useSwapContext();

  
  const { getDisclosureProps, getButtonProps } = useDisclosure()
const localDisclosure = useDisclosure()
  
const { isOpen, onOpen, onClose } = useDisclosure()
const {onConnect,  onDisconnect } = useEthers()
const buttonProps = getButtonProps()
const disclosureProps  = getDisclosureProps()

 // getting address and state of address
 const address = useEthersStore((state) => state.address)
 const provider = useEthersStore((state) => state.provider)
 const setAddress = useEthersStore((state) => state.setAddress)
 const setEtherStore = useEthersStore((state) => state.setEtherStore)
   
 const setSafeStore = useSafeStore((state) => state.setSafeStore)
 const setSafeAddress = useSafeStore((state) => state.setSafeAddress)
 const setIsPendingAddOwner = useSafeStore((state) => state.setIsPendingAddOwner)

   // Provider information to be provided
   const txhash = useTransactionStore((state) => state.txhash) ?? {};
   const txdata = useTransactionStore((state) => state.txdata)
   const logouri = useTransactionStore((state) => state.txlogoUri)
   const setHashTransaction = useTransactionStore((state) => state.setTransaction)
   const setHashTransactionData = useTransactionStore((state) => state.setTransactionData)
   const setHashTransactionTokenAmount = useTransactionStore((state) => state.setTransactionAmount)
   const setHashTransactionName = useTransactionStore((state) => state.setTransactionName)
   const setHashTransactionSymbol = useTransactionStore((state) => state.setTransactionSymbol)
   const setHashTransactionSigner = useTransactionStore((state) => state.setTransactionSigner)
   const setHashTransactionTxLogoUri = useTransactionStore((state) => state.setTransactionSymbol)
   const walletAddress = useEthersStore((state) => state.address)
   const walletCheckSumAddress = walletAddress ? ethers.utils.getAddress(walletAddress) : ''
   setHashTransaction(txhash as PaymentTransactions);  
   setHashTransactionData(txdata)   
   setHashTransactionTxLogoUri(logouri)
   setHashTransactionSymbol(symbolB)

   const onSubmit = async ({tokenAname, symbolA, tokenBname, symbolB, amount, newamount, newcontract}: OnSubmitProps) => {
    setIsLoading(true)
  
    connectWallet(); 
    setCurrentAccount(currentAccount);
  
    const swapProps:SwapProp = {
      amount: amount,
      transactionObject: transactions, // Replace with the actual transaction object
      tokenAname: tokenAname,
      symbolA: symbolA,
      tokenBname: tokenBname,
      symbolB: symbolB,
      newamount: newamount , // Convert to string and provide default value
      newcontract: newcontract, // Add the missing property
    };
 
    const newswapProps = {
      tokenAname:tokenAname, 
      symbolA:symbolA, 
      tokenBname:tokenBname, 
      symbolB:symbolB,
      amount:amount
    }
  
    if(!tokenchosen){
      setIsLoading(true);
 //     swapTKA(swapProps);
      setIsLoading(false)
    }
    else{
      setIsLoading(true);
    //  swapTKX(swapProps);
      setIsLoading(false);           
    }
  
    //getransaction
  
    return {origamount,newtokenamount, tokenAname, symbolA,tokenBname,symbolB, amount,  transactions, accountsretrieved, formData}
  }
 // const onError = (error) => {
 //   console.log("Error", error);
  //};
  
  return (
    <Box m="5">
     <form onSubmit={handleSubmit(()=> {onSubmit({tokenAname, symbolA, tokenBname, symbolB, amount})})}>
       
        <FormControl>
       
          <FormLabel htmlFor="tokenAname">Token A</FormLabel>
       
          <Select icon={<RiArrowDownSLine />} placeholder='Select Tokenname' id="tokenAname"  {...register("tokenAname") } >
             
             
          {ListOfTokens.map((item, index) => (
                <option key={item.tokenname} value={`ListOfTokens.${index}.tokenname`}>
                  {`ListOfTokens.${index}.tokenname`}
                </option>
                               
             )             
             )
          }
             </Select> 

           
           {errors && errors.tokenAname && (
            <FormHelperText color="red">
              {errors.tokenAname.message && errors.tokenAname.message}
            </FormHelperText>
          )}
        </FormControl>


        <FormControl>
          <FormLabel htmlFor="symbolA">Symbol A</FormLabel>
       
          <Select icon={<RiArrowDownSLine />} placeholder='Select Token Symbol' id="symbolA"  {...register("symbolA") } >
             
             
             {ListOfTokens.map((item, index) => (
                   <option key={item.symbol} value={`ListOfTokens.${index}.symbol`}>
                     {`ListOfTokens.${index}.symbol`}
                   </option>
                                  
                )             
                )
             }
                </Select> 
         
         
          {errors && errors.symbolA && (
            <FormHelperText color="red">
              {errors.symbolA.message && errors.symbolA.message}
            </FormHelperText>
          )}
        </FormControl>

    
        <FormControl>
          <FormLabel htmlFor="tokenBname">TokenB</FormLabel>
          <Select icon={<RiArrowDownSLine />} placeholder='Select Token Symbol' id="tokenBname"  {...register("tokenBname") } >
             
             
             {ListOfTokens.map((item, index) => (
                   <option key={item.tokenname} value={`ListOfTokens.${index}.tokenname`}>
                     {`ListOfTokens.${index}.tokenname`}
                   </option>
                                  
                )             
                )
             }
                </Select> 
          {errors && errors.tokenBname && (
            <FormHelperText color="red">
              {errors.tokenBname.message && errors.tokenBname.message}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="symbolB">SymbolB</FormLabel>
          <Select icon={<RiArrowDownSLine />} placeholder='Select Token Symbol' id="symbolB"  {...register("symbolB") } >
             
             
             {ListOfTokens.map((item, index) => (
                   <option key={item.symbol} value={`ListOfTokens.${index}.symbol`}>
                     {`ListOfTokens.${index}.symbol`}
                   </option>
                                  
                )             
                )
             }
                </Select> 
          {errors && errors.symbolB && (
            <FormHelperText color="red">
              {errors.symbolB.message && errors.symbolB.message}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="amount">Amount</FormLabel>

      <NumberInput  step={5} defaultValue={0} min={0} max={100}   >
  <NumberInputField />
  <NumberInputStepper {...register("tokenBname")}>
    <NumberIncrementStepper />
    <NumberDecrementStepper />
  </NumberInputStepper>
</NumberInput>

      {errors && errors.amount && (
            <FormHelperText color="red">
              {errors.amount.message && errors.amount.message}
            </FormHelperText>
          )}
        </FormControl>

        <Stack direction='column'> 
       <Wrap spacing={4}>
       <WrapItem>
      <Button colorScheme='pink'  onClick={()=> { 
      
          if(!tokenchosen){
            setTokenChosen(true); 
          }
          else {
            setTokenChosen(false);
          }
      }}>{!tokenchosen?  'ABC' : 'TKA'}</Button>
      </WrapItem>
   
       </Wrap>
       </Stack>

        
        <Button type="submit" colorScheme="blue">
          Submit
        </Button>
      </form>
      {!isSubmitting}? 
      <Accordion defaultIndex={[0]} allowMultiple>
      <AccordionItem>
    <h2>
      <AccordionButton>
      (<AccordionIcon />
      </AccordionButton>
      
    </h2>
    <AccordionPanel pb={4}>

  <TransactionDisplay 
    account ={accountsretrieved[0]}
    tokenAname={transactions.tokenAname}
    symbolA={transactions.tokenBname}
    tokenBname={transactions.tokenBname}
    symbolB={transactions.symbolB}
    amount={transactions.amount}
    newamount={transactions.newamount}
    swaphash={transactions.swaphash}
    from={accountsretrieved[0]}
    to={''}
    />

    </AccordionPanel>
  </AccordionItem>): (<Text> Transaction not complete</Text>)

  
</Accordion>
  
    </Box>
  
  
  
  );



}
 
export default SwapTransfer;