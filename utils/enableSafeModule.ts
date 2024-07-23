import Web3 from 'web3';
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';
import Safe, { SafeFactory, SafeAccountConfig, EthSignSignature } from '@gnosis.pm/safe-core-sdk';
import SafeServiceClient, { SafeInfoResponse } from '@gnosis.pm/safe-service-client';
import { moduleAbi } from 'constants/abi';

const MODULE_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
const txServiceUrl = "https://safe-transaction.rinkeby.gnosis.io";

let transactionDataExtract;

// ABI encoding function data
const iface = new Web3().eth.abi;
const data = iface.encodeFunctionCall(
  {
    name: 'enableModule',
    type: 'function',
    inputs: [
      {
        type: 'address',
        name: 'module'
      }
    ]
  },
  [MODULE_ADDRESS]
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;

type ReturnType = {
  status: 'waiting' | 'success';
};

export const enableModule = async (safeAddress: string): Promise<ReturnType> => {
  // Initialize Web3 with the provider injected by MetaMask
  const web3Provider = window.ethereum;
  const web3 = new Web3(web3Provider);
  const accounts = await web3.eth.getAccounts();
  const owner = accounts[0];

  // Initialize the EthersAdapter with the Web3 provider and signer
  const ethAdapter = new EthersAdapter({
    web3,
    signerOrProvider: owner,
  });

  const safeService = new SafeServiceClient({
    txServiceUrl,
    ethAdapter,
  });

  const safe = await Safe.create({
    ethAdapter,
    safeAddress,
  });

  const signedUser = owner;
  const { threshold }: SafeInfoResponse = await safeService.getSafeInfo(safeAddress);

  // Create transaction object
  const transaction = await safe.createTransaction({
    to: safeAddress,
    value: '0',
    data,
  });

  const { data: transactionData } = transaction;
  transactionDataExtract = transactionData;
  const multisigTransactions = await safeService.getMultisigTransactions(safeAddress);
  const sameTransaction = multisigTransactions.results.find(
    ({ data: transactionItem }) => transactionItem === transactionData.data
  );

  const isCurrentUserAlreadySigned = sameTransaction?.confirmations?.some(
    ({ owner: ownerItem }) => ownerItem === signedUser
  );

  if (isCurrentUserAlreadySigned) {
    return { status: 'waiting' };
  }

  // Sign the transaction
  await safe.signTransaction(transaction).catch((err) => err);

  // Get the transaction hash
  const safeTxHash = await safe.getTransactionHash(transaction);
  const senderSignature = await safe.signTransactionHash(safeTxHash);

  // Propose the transaction offchain
  await safeService.proposeTransaction({
    safeAddress,
    safeTransactionData: transactionDataExtract,
    safeTxHash,
    senderAddress: signedUser,
    senderSignature: senderSignature.data,
  });

  // Confirm and execute the transaction if threshold is reached
  if (sameTransaction?.confirmations?.length) {
    if (threshold - sameTransaction.confirmations.length <= 1) {
      sameTransaction.confirmations.forEach((confirmation) => {
        const signature = new EthSignSignature(confirmation.owner, confirmation.signature);
        transaction.addSignature(signature);
      });
      const { transactionResponse } = await safe.executeTransaction(transaction);
      await transactionResponse?.wait();
      return { status: 'success' };
    }
  }

  return { status: 'waiting' };
};

export default enableModule;
