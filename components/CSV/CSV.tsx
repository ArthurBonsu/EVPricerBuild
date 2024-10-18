// CSV.tsx
import React, {
  useCallback,
  useState,
  useEffect,
  ComponentType,
  FC,
  useContext,
} from "react";
import { read, utils, writeFile } from "xlsx";
import {
  Stack,
  Heading,
  Button,
  ButtonProps,
  Flex,
  useDisclosure,
  AlertDialog,
  Alert,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  chakra,
  AlertDialogHeader,
  AlertDialogOverlay,
  UseDisclosureReturn,
  Select,
  FormErrorMessage,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputStepper,
  Input,
  IconButton,
  AlertIcon,
  Grid,
  Box,
  Text,
  InputGroup,
  InputRightAddon,
  FormHelperText,
  Wrap,
  WrapItem,
  VisuallyHidden,
  VisuallyHiddenInput,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  
} from "@chakra-ui/react";
import { max } from "lodash";
import usePortFolioContext from "context/usePortfolioContext";
import { dateAtTime, timeAgo, dateFormat, DateType } from "utils/formatDate";
import {
  useFormContext,
  useFieldArray,
  useForm,
  Controller,FieldErrors, FieldValues 
} from "react-hook-form";

import { ethers } from "ethers";
const hre = require("hardhat");
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { RiArrowDownSLine } from "react-icons/ri";
import {
  createSwapFormSchema,
  createSwapTransferFormSchema,
} from "../../validation";
import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";
import { PlusSmIcon, MinusSmIcon } from "@heroicons/react/outline";
import {
  CreateSwapTransferInput,
  CreateTransferInput,
  SimpleTokenList,
} from "types";
import supportedNetworkOptions from "constants/supportedNetworkOptions";
import { useSwapStore } from "stores/ContextStores/useSwapStore";
import { useEthersStore } from "stores/ethersStore";
import { useSafeStore } from "stores/safeStore";
import { useTransactionStore } from "stores/transactionStore";
import { useUserStore } from "stores/userStore";
import { Receipients } from "types/index";
import useEthers from "hooks/useEthers";
import useFetch from "hooks/useFetch";
import useLoadSafe from "hooks/useLoadSafe";
import useTransactions from "hooks/useTransactions";
import useSafeInfo from "hooks/useSafeDetails.ts";
import useCrowdsourceContext from "context/useCrowdsourceContext";
import useDaoContext from "context/useDaoContext";
import useSwapContext from "context/useSwapContext";
import useTransactionContext from "context/useTransactionContext";
import useTransferContext from "context/useTransferContext";
import * as yup from "yup";
import { motion } from "framer-motion";
import Router from "next/router";
import { useQuery } from "react-query";
import queries from "services/queries";
import { RowType, TokensSelected, CSVProps, CSVPropsType } from "types/index";
import {
  createCSCFormSchema,
  TcreateCSCFormSchemaValues,
} from "../../validation";
import {
  AllPVsProps,
  PVForTokenProps,
  DateForMultiTokenProps,
  DateWithTokenProps,
} from "types/index";
import { PublicClient } from "coinbase-pro";

const SelectedTokenList: TokensSelected[] = [
  { name: "Bitcoin", symbol: "BTC" },
  { name: "Ethereum", symbol: "ETH" },
  { name: "XRP", symbol: "XRP" },
];

const publicClient = new PublicClient();

let timestampstore: Array<String>;
let transaction_typestore: Array<string>;
let tokenstore: Array<String>;
let amountstore: Array<string>;
let timestampgiven, _thetransactiontype, tokengained, amountpushed;
let rows: Array<RowType>;
let onTokenSelected: any, onDatePicked: any;
let datedbalancedamount: number | string;
let datedwithdrawalamount: number | string;
let dateddepositedamount: number | string;
let BTCPVOfParticularToken: number | string;
let ETHVOfParticularToken: number | string;
let XRPVOfParticularToken: number | string;
let balancedamount: any;
let withdrawalamount: any;
let depositedamount: any;

const PVForToken: React.FC <PVForTokenProps> = ({ token, balancedamount, withdrawalamount, depositedamount }) => {
  return (
    <div>
      <h3>Token: {token}</h3>
      <p>Balance Amount: {balancedamount}</p>
      <p>Withdrawal Amount: {withdrawalamount}</p>
      <p>Deposited Amount: {depositedamount}</p>
    </div>
  );
};

const DateWithToken: React.FC<DateWithTokenProps> = ({
  date,
  token,
  datedbalancedamount,
  datedwithdrawalamount,
  dateddepositedamount,
}) => {
  return (
    <div>
      <p>Date: {date}</p>
      <p>Token: {token}</p>
      <p>Dated Balanced Amount: {datedbalancedamount}</p>
      <p>Dated Withdrawal Amount: {datedwithdrawalamount}</p>
      <p>Dated Deposited Amount: {dateddepositedamount}</p>
    </div>
  );
};

const AllPVs = ({
  _BTCPVOfParticularToken,
  _ETHVOfParticularToken,
  _XRPVOfParticularToken,
}: AllPVsProps) => {
  return (
    <Stack spacing={6}>
      <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Heading as="h1" size="4xl" noOfLines={1}>
          {" "}
        </Heading>
        <br />
        <Text as="b"> Bitcoin PV Value</Text>
        <Text as="b">{_BTCPVOfParticularToken}</Text>
        <br />
        <Text as="b"> Ethereum PV Value</Text>
        <Text as="b">{_ETHVOfParticularToken}</Text>
        <br />
        <Text as="b"> XRP PV Value</Text>
        <Text as="b">{_XRPVOfParticularToken}</Text>
        <br />
      </Box>
    </Stack>
  );
};

const PVForSelectedToken = ({
  token,
  balancedamount,
  withdrawalamount,
  depositedamount,
}: PVForTokenProps) => {
  return (
    <Stack spacing={6}>
      <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <motion.div animate={{ scale: 0.5 }} />
        <Heading as="h1" size="4xl" noOfLines={1}>
          PV For Token Selected {token}
        </Heading>
        <br />
        <Text as="b"> Balanced Amount</Text>
        <Text as="b">{balancedamount}</Text>
        <br />
        <Text as="b"> Withdrawal Amount</Text>
        <Text as="b">{withdrawalamount}</Text>
        <br />
        <Text as="b"> Deposit Amount</Text>
        <Text as="b">{depositedamount}</Text>
        <br />
      </Box>
    </Stack>
  );
};

// get all the PV for multiple tokens by date
const DateForMultiToken = ({
  date,
  BTCDatedPV,
  ETHDatedPV,
  XRPDatedPV,
}: DateForMultiTokenProps) => {
  return (
    <Stack spacing={6}>
      <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Heading as="h1" size="4xl" noOfLines={1}>
          View PV Value From Date {date} Given
        </Heading>
        <br />
        <Text as="b"> BTC PV</Text>
        <Text as="b">{BTCDatedPV}</Text>
        <br />
        <Text as="b"> ETC PV</Text>
        <Text as="b">{ETHDatedPV}</Text>
        <br />
        <Text as="b"> XRP PV </Text>
        <Text as="b">{XRPDatedPV}</Text>
        <br />
      </Box>
    </Stack>
  );
};

// submit the properties of the tokens and then submit this information
const CSVSubmit = ({
  rows,
  date,
  pvvalue,
  timestamp,
  transaction_type,
  token,
  amount,
}: CSVProps) => {
  const [portfolioDetails, setPortfolioDetails1] = useState<RowType[]>([]);
  const [porfoliodetails, setPortfolioDetails2] = useState([]);
  const [value, setValue] = useState("");
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [_tokenselect, setTokenSelected] = useState('');
  const [datePicker, setDatePicker] = useState<DateType>(undefined);
  
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isBrowser, setIsBrowser] = useState(false);
  const { data, isLoading } = useQuery(
    "transactions",
    async () => {
      const response = await fetch("/api/transactions");
      return response.json();
    }
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsBrowser(true);
    }
  }, []);

  if (!isBrowser) return null;

  // Functions
  const handleTokenSelect = (token: string) => {
    setTokenSelected(token);
  };

  const handleDatePick = (date: DateType) => {
    setDatePicker(date);
  };

  const handleCSVSubmit = async (data: FieldValues) => {
    const csvData: CSVProps = {
      rows: data.rows,
      transaction_type: data.transaction_type,
      token: data.token,
      amount: data.amount,
    };
    try {
      const response = await fetch("/api/csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(csvData),
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };
  

  // Render
  return (
    <Flex direction="column" align="center" justify="center" p={6}>
      <Heading as="h1" size="4xl" noOfLines={1}>
        CSV Upload
      </Heading>

      <form onSubmit={handleSubmit(handleCSVSubmit)}>
        <Stack spacing={6}>
        <FormControl isInvalid={!!errors.token}>
            <FormLabel>Token</FormLabel>
            <Select 
              {...register("token")}
              placeholder="Select token"
              onChange={(e) => handleTokenSelect(e.target.value)}
            >
              {SelectedTokenList.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.name}
                </option>
              ))}
            </Select>
            <FormItem>
<FormErrorMessage>
{errors.token?.message || 'Error'}
</FormErrorMessage>
  </FormItem>

          </FormControl>

          <FormControl isInvalid={errors.date}>
            <FormLabel>Date</FormLabel>
            <Input
              {...register("date")}
              type="date"
              placeholder="Select date"
              onChange={(e) => handleDatePick(e.target.valueAsDate)}
            />
            <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.pvvalue}>
            <FormLabel>PV Value</FormLabel>
            <NumberInput>
              <NumberInputField {...register("pvvalue")} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.pvvalue?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.timestamp}>
            <FormLabel>Timestamp</FormLabel>
            <Input {...register("timestamp")} type="datetime-local" />
            <FormErrorMessage>{errors.timestamp?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.transaction_type}>
            <FormLabel>Transaction Type</FormLabel>
            <Select {...register("transaction_type")} placeholder="Select transaction type">
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
            </Select>
            <FormErrorMessage>{errors.transaction_type?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.amount}>
            <FormLabel>Amount</FormLabel>
            <NumberInput>
              <NumberInputField {...register("amount")} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
          </FormControl>

          <Button type="submit" isLoading={isLoading}>
            Submit
          </Button>
        </Stack>
      </form>

      {isOpen && (
        <AlertDialog onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader>CSV Upload</AlertDialogHeader>
              <AlertDialogCloseButton />
              <AlertDialogBody>
                <p>CSV uploaded successfully!</p>
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button onClick={onClose}>Close</Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </Flex>
  );
};

export default CSV;