import React,{ useCallback, useState, useEffect,ComponentType, FC, } from 'react' 
import { read, utils, writeFile } from 'xlsx';
import { Stack, Heading, Button, ButtonProps, Flex, useDisclosure, AlertDialog,Alert,  AlertDialogBody,  AlertDialogCloseButton,  AlertDialogContent,
    AlertDialogFooter,  chakra, AlertDialogHeader,  AlertDialogOverlay,   UseDisclosureReturn, Select,FormErrorMessage, FormControl, FormLabel,
    NumberInput,NumberInputField, NumberIncrementStepper,NumberDecrementStepper,NumberInputStepper, Input,IconButton, AlertIcon, Grid,
      Box,  Text,  InputGroup,  InputRightAddon, FormHelperText,Wrap,  WrapItem, VisuallyHidden, VisuallyHiddenInput, Accordion,AccordionItem,AccordionButton,
      AccordionPanel, AccordionIcon } from '@chakra-ui/react'
import { max } from "lodash";
import  usePortFolioContext   from 'context/usePortfolioContext'
import { dateAtTime,  timeAgo,   dateFormat, DateType } from 'utils/formatDate'
import { useFormContext, useFieldArray ,useForm, Controller } from 'react-hook-form'
import { ethers } from 'ethers'
const hre = require("hardhat")
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router'
import { RiArrowDownSLine } from 'react-icons/ri';
import {  createSwapFormSchema, createSwapTransferFormSchema,  } from '../../validation'
import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";
import { PlusSmIcon, MinusSmIcon } from '@heroicons/react/outline'
import { CreateSwapTransferInput, CreateTransferInput, SimpleTokenList } from 'types'
import supportedNetworkOptions from 'constants/supportedNetworkOptions'
import { useSwapStore  } from 'stores/ContextStores/useSwapStore'
import { useEthersStore  } from 'stores/ethersStore'
import { useSafeStore  } from 'stores/safeStore'
import { useHashTransactionStore  } from 'stores/transactionStore'
import { useUserStore  } from 'stores/userStore'
import { Receipients  } from 'types/index'
import  useEthers   from 'hooks/useEthers'
import  useFetch   from 'hooks/useFetch'
import  useLoadSafe   from 'hooks/useLoadSafe'
import  useSafe   from 'hooks/useSafe'
import useSafeSdk   from 'hooks/useSafeSdk'
import useTransactions   from 'hooks/useTransactions'
import useSafeInfo from 'hooks/useSafe'
import  useCrowdsourceContext   from 'context/useCrowdsourceContext'
import  useDaoContext   from 'context/useDaoContext'
import  useSwapContext   from 'context/useSwapContext'
import  useTransactionContext   from 'context/useTransactionContext'
import useTransferContext   from 'context/useTransferContext'
import * as yup from "yup";
import { motion } from 'framer-motion';
import Router from 'next/router'
import { useQuery } from 'react-query'
import queries from "services/queries";
import { RowType,TokensSelected, CSVProps, CSVPropsType } from "types/index";
import {  createCSCFormSchema, TcreateCSCFormSchemaValues  } from '../../validation'
import {AllPVsProps, PVForTokenProps,DateForMultiTokenProps,DateWithTokenProps } from "types/index";
import { PublicClient } from 'coinbase-pro';

const SelectedTokenList : TokensSelected[] = [
  {
  name: 'Bitcoin',
  symbol: 'BTC',
 },
 {
  name: 'Ethereum',
  symbol: 'ETH',
 },
 {
  name: 'XRP',
  symbol: 'XRP',
 },
]
const publicClient = new PublicClient();
let timestampstore: Array<String> ; let transaction_typestore: Array<string>; let tokenstore: Array<String>; 
let amountstore:Array<string> ;  let timestampgiven, _thetransactiontype, tokengained,amountpushed ;
let rows: Array<RowType>;
let onTokenSelected:any, onDatePicked:any; 

let datedbalancedamount: number | string;
let datedwithdrawalamount: number | string;
let dateddepositedamount: number | string;
let BTCPVOfParticularToken: number | string;
let ETHVOfParticularToken: number | string;
let XRPVOfParticularToken: number | string;
let balancedamount: any;
let withdrawalamount: any;
let depositedamount: any;


const PVForToken: React.FC<PVForTokenProps> = ({ token, balancedamount, withdrawalamount, depositedamount }) => {
  return (
    <div>
      <h3>Token: {token}</h3>
      <p>Balance Amount: {balancedamount}</p>
      <p>Withdrawal Amount: {withdrawalamount}</p>
      <p>Deposited Amount: {depositedamount}</p>
    </div>
  );
};

const DateWithToken: React.FC<DateWithTokenProps> = ({ date, token, datedbalancedamount, datedwithdrawalamount, dateddepositedamount }) => {  return (
    <div>
      <p>Date: {date}</p>
      <p>Token: {token}</p>
      <p>Dated Balanced Amount: {datedbalancedamount}</p>
      <p>Dated Withdrawal Amount: {datedwithdrawalamount}</p>
      <p>Dated Deposited Amount: {dateddepositedamount}</p>
    </div>
  );
};

const AllPVs = ({ _BTCPVOfParticularToken, _ETHVOfParticularToken, _XRPVOfParticularToken }: AllPVsProps) => {
  return (
    <Stack spacing={6}>
      <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <Heading as='h1' size='4xl' noOfLines={1}>    </Heading>
        <br />
        <Text as='b'> Bitcoin PV Value</Text>
        <Text as='b'>{_BTCPVOfParticularToken}</Text>
        <br />
        <Text as='b'> Ethereum PV Value</Text>
        <Text as='b'>{_ETHVOfParticularToken}</Text>
        <br />
        <Text as='b'> XRP PV Value</Text>
        <Text as='b'>{_XRPVOfParticularToken}</Text>
        <br />
      </Box>
    </Stack>
  )
}

const PVForSelectedToken = ({ token, balancedamount, withdrawalamount, depositedamount }: PVForTokenProps) => {
  return (
    <Stack spacing={6}>
      <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <motion.div animate={{ scale: 0.5 }} />
        <Heading as='h1' size='4xl' noOfLines={1}> PV For Token Selected {token} </Heading>
        <br />
        <Text as='b'> Balanced Amount</Text>
        <Text as='b'>{balancedamount}</Text>
        <br />
        <Text as='b'> Withdrawal Amount</Text>
        <Text as='b'>{withdrawalamount}</Text>
        <br />
        <Text as='b'> Deposit Amount</Text>
        <Text as='b'>{depositedamount}</Text>
        <br />
      </Box>
    </Stack>
  )
}
             // get all the PV for multiple tokens by date 
             const DateForMultiToken = ({ date, BTCDatedPV, ETHDatedPV, XRPDatedPV }: DateForMultiTokenProps) => {
       
              return (
                <Stack spacing={6}>
                  <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
                    <Heading as='h1' size='4xl' noOfLines={1}> View PV Value From Date {date} Given </Heading>
                    <br />
                    <Text as='b'> BTC PV</Text>
                    <Text as='b'>{BTCDatedPV}</Text>
                    <br />
                    <Text as='b'> ETC PV</Text>
                    <Text as='b'>{ETHDatedPV}</Text>
                    <br />
                    <Text as='b'> XRP PV  </Text>
                    <Text as='b'>{XRPDatedPV} </Text>
                    <br />
                  </Box>
                </Stack>
              )
      }
         
      
      // submit the properties of the tokens and thn submit this information 
const CSVSubmit =( {rows, date,pvvalue,timestamp,transaction_type,token,amount}: CSVProps )=> {


  const [portfolioDetails, setPortfolioDetails1] = useState<RowType[]>([]);
  const [porfoliodetails, setPortfolioDetails2] = useState([]);
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [_tokenselect, setTokenSelected] = useState(false); 
    const [dateselect, setDatePicker] = useState(false); 
    const [tokenexecute,setTokenExecute ] = useState(false)
    const [executetokendate,setTokenDateExectuted ] = useState(false)
    const [tokenwithdateexecute, setTokenWithDateExecute] = useState(false)

    const schema = yup.object().shape({

    
      rows: yup.array<RowType>().required(),
      date : yup.string().required(), 
      pvvalue:yup.string().required(),
      timestamp: yup.string().required(),
      transaction_type:yup.string().required(),
      token:yup.string().required(),
      amount:yup.string().required(),
    }).required();

    const {
     
      
      watch,
      // Read the formState before render to subscribe the form state through the Proxy
      formState: {  isDirty, touchedFields, submitCount },
    } = useForm<CSVProps>(
{ 
  resolver: yupResolver(schema),
        defaultValues: 
        {
     
          rows: rows,
          date : date, 
          pvvalue: pvvalue,
          timestamp: timestamp,
          transaction_type:'WITHDRAWAL',
          token: 'ETH',
          amount: '0',
          },  
        } );
       const amountWatch = watch("amount")
  
       const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
        setValue(event.target.value)
       
        // Logic of token conversion must be here
      
      }
    const {
  
      formState: { errors },      
     
    } = useFormContext<CSVProps>()
    
    
    const {
      control,
     
      register,
      handleSubmit,
      formState: { isSubmitting },
    } = useForm<CSVProps>()
    const { fields, append, remove} = useFieldArray({
      control,
   
          name: 'rows',
     
          
        },
         
   ) 
   
  
 
 const {  getLatestTokenOfType,  getLatestTokenOfAllThreeTypes,
  getWithdrawnAmountOfTokenType,  getDepositedAmountOfTokenType,  getPortFolioValueOfSpecifiedToken,
  getPortFolioWithDate,  getDatedWithdrawnAmountOfTokenType,  getDatedDepositedAmountOfTokenType,
  getDatedPortFolioValueOfTokenType,getDatedPortFolioValueOfAllThreeTypes, getPortFolioValueOfTokenofAllThreeTypes }   = usePortFolioContext();

  //const cryptoCompareKey = cryptocompare.setApiKey(process.env.CRYPTOCOMPARE);
  
  

  
  const  onGetLPVs = async() => {
    const {BTCPVOfParticularToken, ETHVOfParticularToken, XRPVOfParticularToken} = getPortFolioValueOfTokenofAllThreeTypes(); 
    
   //  const pricetx = await cryptocompare.priceMulti('BTC', 'USD');
    // const pricePerToken = pricetx.wait()
    
      // Returning For Each Token
 const {  balancedamount, withdrawalamount,depositedamount} = BTCPVOfParticularToken


    return {BTCPVOfParticularToken,ETHVOfParticularToken,XRPVOfParticularToken };
    // LPVToBeBuiltHere

 }

   
 const onGetLPerToken = async () => {
  const results: Record<string, { balancedamountInUSD: number, withdrawalamountInUSD: number, depositedamountInUSD: number }> = {};

  for (const token of SelectedTokenList) {
    const ticker = await publicClient.getProductTicker(`${token.symbol}-USD`);
    const pricePerToken = parseFloat(ticker.price);

    if (!_tokenselect) {
      const { balancedamount, withdrawalamount, depositedamount } = getPortFolioValueOfSpecifiedToken(token.symbol);
      setTokenSelected(false);
      const balancedamountInUSD = balancedamount * pricePerToken;
      const withdrawalamountInUSD = withdrawalamount * pricePerToken;
      const depositedamountInUSD = depositedamount * pricePerToken;
      results[token.symbol] = { balancedamountInUSD, withdrawalamountInUSD, depositedamountInUSD };
    }
  }

  return results;
};
const onGetDateOfAllTokens = async (date: string) => {
  if (!dateselect) {
    const { BTCDatedPV, ETHDatedPV, XRPDatedPV } = getDatedPortFolioValueOfAllThreeTypes(date);
    setDatePicker(false);
    return { BTCDatedPV, ETHDatedPV, XRPDatedPV };
  }
};

const onGetTokenWithDate = async (date: string, token: string) => {
  const ticker = await publicClient.getProductTicker(`${token}-USD`);
  const pricePerToken = parseFloat(ticker.price);
  const { datedbalancedamount, datedwithdrawalamount, dateddepositedamount } = getDatedPortFolioValueOfTokenType(date, token);

  const datedbalancedamountInUSD = datedbalancedamount * pricePerToken;
  const datedwithdrawalamountInUSD = datedwithdrawalamount * pricePerToken;
  const dateddepositedamountInUSD = dateddepositedamount * pricePerToken;

  return { datedbalancedamountInUSD, datedwithdrawalamountInUSD, dateddepositedamountInUSD };
};
// Assuming RowType is defined somewhere in your code
// If not, replace RowType with the correct type



// Rest of your code...

const handleImport = ($event: React.ChangeEvent<HTMLInputElement>) => {
  const files = $event.target.files;
  if (files && files.length) {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;
        const sheet1 = wb.SheetNames[0];
        //read sheet 1 to json
        if (sheets.length) { 
          // JSON LIST 
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);             
          setPortfolioDetails1(rows as RowType[]); // <-- Changed this line
          // Map is used to retrieve values of array of objects
          // so we have all content in an array for an easy search
         
          // RETRIEVING JSON VALUES AND PUTTING INTO ARRAY
          portfolioDetails.map((item, index) => {
            const timestampgiven  = String(item.timestamp);
            const _thetransactiontype  = String(item.transaction_type); // <-- Changed this line
            const tokengained  = String(item.token);
            const amountpushed  = String(item.amount);
            timestampstore.push(timestampgiven);
            transaction_typestore.push(_thetransactiontype);
            tokenstore.push(tokengained);   
            amountstore.push(amountpushed);           
            return item;
          })
        }
      }
    }
    reader.readAsArrayBuffer(file);
  }
};
      onDatePicked =() => {
        setIsLoading(true);
        setDatePicker(true);
        setIsLoading(false);
        return (
          <>
      <div className="min-h-screen">
        <div className='gradient-bg-welcome'>  
      <Text >  You can get the LP of your selected Date And Token </Text>
                  
       
      <Button onClick={() => {
        
        onGetTokenWithDate
         setTokenDateExectuted(true) } 
        
        }    >Get Dated LP </Button>
      
      </div>                            
      </div>
      </>
        )
       
       }

     
 onTokenSelected =() => {
  setIsLoading(true);
  setTokenSelected(true);
  setIsLoading(false);
  return (
    <>
<div className="min-h-screen">
  <div className='gradient-bg-welcome'>  
<Text > You can get the LP of your selected Token  </Text>
            
 
<Button onClick={() => {
  onGetLPerToken
  setTokenExecute(true); 
  } }    >Get Token LP </Button>

</div>                            
</div>
</>
  )

 }
 



return (
  <form onSubmit={handleSubmit(()=> {CSVSubmit( {rows, date,pvvalue,timestamp,transaction_type,token,amount})})}>
  <chakra.form py={2}>
    
  
   {fields.map((item, index) => {
           const rowsError = errors.rows
          const amountError = errors.amount
          const dateError = errors.date
          const pvvalueError = errors.pvvalue
          const timestampError = errors.timestamp
          const transaction_type = errors.transaction_type
          const tokenError  = errors.token
          const isLastIndex = fields.length - 1 === index
         const isLastItem = fields.length - 1 === index

      return (
        <Flex flexDirection="row" py={4} key={item.id}>
         
           <FormControl w="150px" id={`SelectedTokenList.${index}.symbol`} isInvalid={!!tokenError?.message} mx={2}>
            <FormLabel> Token Selected</FormLabel>
            <>     
            <Select {...register("token")} placeholder="Select option" isReadOnly={isLoading} onSelect={()=> { onTokenSelected()}} 
             >
               
               
                  {SelectedTokenList.map((item, index) => (
                <option key={item.name} value={`SelectedTokenList.${index}.symbol`}>
                  {`SelectedTokenList.${index}.symbol`}
                </option>
                   
             
             ) )
                        
              }
      </Select>
                   
           <FormErrorMessage>{tokenError?.message}</FormErrorMessage>
            </>
          </FormControl> 
      
          <FormControl w="150px" id={`SelectedTokenList.${index}.symbol`} isInvalid={!!tokenError?.message} mx={2}>
            <FormLabel> Date Pick</FormLabel>
            <>     
            <Input  placeholder="Select Date and Time"  size="md"  type="datetime-local" onSelect={()=> {onDatePicked()}} {...register("date")}/>
                       
             <FormErrorMessage>{tokenError?.message}</FormErrorMessage>
            </>
          </FormControl> 
      
        </Flex>
      )
    })}

    {tokenexecute }? (

     <Text>  PV Details For {token} selected </Text>
     <PVForToken
     
      token ={token}
      balancedamount ={balancedamount}
       withdrawalamount ={withdrawalamount}
       depositedamount ={depositedamount} 
     
     />

  
    
    ): ()
    
    {executetokendate }? (

<Text>  PV Details For {token} and {date} selected </Text>
<PVForToken
     
     token ={token}
     balancedamount ={balancedamount}
      withdrawalamount ={withdrawalamount}
      depositedamount ={depositedamount} 
    
    />
): (<Text>PV Details For token {token} and date {date} unselected  </Text>  )

  

{tokenexecute && executetokendate }? (

<Text>  PV Details For {token} and {date} selected </Text>

<Stack direction='row' spacing={4}>
       
       <Button
       isLoading
       loadingText={isLoading? 'Reconnecting Metamask' : 'Connected'}  
       colorScheme='teal'
        variant='outline'
        onClick={()=> {              
            setIsLoading(true)

            if (date && token) {
              onGetTokenWithDate(date, token)
            }
            setIsLoading(false);
           // settoken 
           // settoken
           <DateWithToken
           date = {date || ''}
           token = {token}
           datedbalancedamount = {Number(datedbalancedamount)}
           datedwithdrawalamount = {Number(datedwithdrawalamount)}
           dateddepositedamount = {Number(dateddepositedamount)}
         />
          
           }
   }
>         
Get All Token LP
</Button>
</Stack> 

<PVForToken
     
     token ={token}
     balancedamount ={balancedamount}
      withdrawalamount ={withdrawalamount}
      depositedamount ={depositedamount} 
    
    />
): ()



      <Stack direction='row' spacing={4}>
       
       <Button
       isLoading
       loadingText={isLoading? 'Reconnecting Metamask' : 'Connected'}  
       colorScheme='teal'
        variant='outline'
        onClick={()=> {              
            setIsLoading(true)
           onGetLPVs()
           setIsLoading(false);
           <AllPVs
           _BTCPVOfParticularToken = {BTCPVOfParticularToken}
           _ETHVOfParticularToken = {ETHVOfParticularToken}
           _XRPVOfParticularToken = {XRPVOfParticularToken}
           
           />
          
           }
   }
>         
Get All Token LP
</Button>
</Stack> 




  </chakra.form>
  </form>
)


  
  }
export default CSVSubmit