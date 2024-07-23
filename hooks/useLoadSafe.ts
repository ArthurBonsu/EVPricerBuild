/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers, Signer, ContractFactory, Contract } from "ethers";
import { useState, useEffect, useCallback } from 'react'
import { enableModule } from 'utils/enableSafeModule'
import { executeModule } from 'utils/executeSafeModule'
import EthersAdapter from '@safe-global/safe-ethers-lib'
import Safe, { SafeFactory, SafeAccountConfig, EthSignSignature } from '@gnosis.pm/safe-core-sdk'
import { createSafe } from 'utils/createSafe'
import SafeServiceClient, { SafeInfoResponse } from '@safe-global/api-kit'
import Web3 from 'web3';

let { TransactionRequest, TransactionResponse, TransactionReceipt } = require("@ethersproject/abstract-provider");

let safeaddresskeylist: string[];
let ContractDeployedAddress = "0xF117D1a20aaAE476Df7e00d9aA81F59b22c93F90";

let provider: ethers.providers.Web3Provider;
let ethAdapter: any;

provider = new ethers.providers.Web3Provider(window.ethereum);

const owner = provider.getSigner(0);
let signer = new ethers.Wallet(String(process.env.RINKEBY_MNEMONIC), provider);

ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: owner
});

const safeService = new SafeServiceClient({
  txServiceUrl: 'https://safe-transaction.gnosis.io/ropsten',
  chainId: 3n // Use bigint literal by appending 'n' to the number
});

const ENABLE_MODULE_SIG = '0x610b59250000000000000000000000001a8cd04ad268b1dc580f6162083cedfc1a76818e'

interface useSafeProps {
  safeAddress: string
  userAddress: string
}

let addresslisttx: typeof TransactionRequest;
let receipt: typeof TransactionResponse;
let transactionalreceipt: typeof TransactionReceipt;

export const useLoadSafe = ({ safeAddress, userAddress }: useSafeProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [safe, setSafe] = useState<SafeInfoResponse | null>(null)
  const [isCurrentUserAlreadySigned, setIsUserAlreadySigned] = useState<boolean>(false)
  const [hasReachedThreshold, setHasReachedThreshold] = useState<boolean>(false)
  let [safeaddresses, setAllSafeAddressees] = useState({});

  const getSafeInfo = useCallback(async () => {
    setIsLoading(true)
    if (safeAddress) {
      const safeInfo = await safeService.getSafeInfo(safeAddress)
      setSafe(safeInfo)
    }
    setIsLoading(false)
  }, [safeAddress])

  const checkIsSigned = useCallback(async () => {
    setIsLoading(true)
    const multisigTransactions = await safeService.getMultisigTransactions(safeAddress)
    const sameTransaction = multisigTransactions.results.find(
      ({ data: transactionItem }) => transactionItem === ENABLE_MODULE_SIG
    )
    const isSigned =
      sameTransaction?.confirmations?.some(
        ({ owner: ownerItem }) => ownerItem.toLowerCase() === userAddress.toLowerCase()
      ) || false

    setIsUserAlreadySigned(isSigned)
    setIsLoading(false)
  }, [safeAddress, userAddress])

  useEffect(() => {
    safeAddress && checkIsSigned()
  }, [userAddress, safe, safeAddress, checkIsSigned])

  useEffect(() => {
    getSafeInfo()
  }, [getSafeInfo])

  useEffect(() => {
    checkIsSigned()
  }, [checkIsSigned, safeAddress])

  const enableSafeModule = async () => {
    setIsLoading(true)
    const response = await enableModule(safeAddress)
    setIsLoading(false)
    return response
  }

  const executeSafeModule = async () => {
    setIsLoading(true)
    const response = await executeModule(safeAddress)
    setIsLoading(false)
    return response
  }

  const userLoadSafeAddresses = async () => {
    setIsLoading(true)

    if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let myprovider: typeof provider = provider;

      console.log(myprovider)
      let signer = myprovider.getSigner(0)
      let mysigner: typeof signer = signer;
      console.log(mysigner);

      let GnosisSafeContractInstance: ContractFactory = await ethers.getContractFactory("GnosisSafeGetAddresses", mysigner);
      let GnosisSafeContractActual: Contract = await GnosisSafeContractInstance.deploy();
      await GnosisSafeContractActual.deployed();

      let GnosisContractAddress: string = await GnosisSafeContractActual.address;
      let GnosisSafeContractInstanceSigned = GnosisSafeContractActual.connect(myprovider);

      addresslisttx = await GnosisSafeContractActual.getSafeAddresses(userAddress);
      receipt = await addresslisttx.wait();

      let filter = GnosisSafeContractActual.filters.getSafeAddressListEvent(userAddress);

      GnosisSafeContractActual.on(filter, (safeaddresskeylist, event) => {
        console.log("SafeAdressList", safeaddresskeylist);
      })

      transactionalreceipt = await provider.getTransactionReceipt(addresslisttx.hash);

      let gnosissafeandinterface = new ethers.utils.Interface(["event getSafeAddressListEvent(string[] safeaddresskey)"]);
      const data = transactionalreceipt.logs[0].data;
      const topics = transactionalreceipt.logs[0].topics;
      const event = gnosissafeandinterface.decodeEventLog("getSafeAddressListEvent", data, topics);
      safeaddresses = event.safeaddresskey;
      setIsLoading(false)
      return safeaddresses
    }
  }

  useEffect(() => {
    userLoadSafeAddresses()
  }, [userLoadSafeAddresses])

  const refetch = {
    waiting: checkIsSigned,
    success: () => {
      getSafeInfo()
      checkIsSigned()
    },
  }

  return {
    enableSafeModule,
    isLoading,
    safe,
    checkIsSigned,
    isCurrentUserAlreadySigned,
    refetch,
    hasReachedThreshold,
    userLoadSafeAddresses,
    executeSafeModule,
  }
}

export default useLoadSafe
