import Web3 from 'web3';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SafeServiceClient, { SafeMultisigTransactionResponse } from '@gnosis.pm/safe-service-client';
import Safe from '@gnosis.pm/safe-core-sdk';
import SafeTransactionData from '@gnosis.pm/safe-core-sdk-types';
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';
import { SafeTransacTransactionData } from 'types/index';

let SAFE_TXN_URL = 'https://safe-transaction.rinkeby.gnosis.io';
let ethAdapter: EthersAdapter;
let safeSdkInstance: Safe | null = null;
let safeService: SafeServiceClient;
let safeTransaction: SafeTransacTransactionData | null = null;
let executeTxResponse: any;
let safeTxHash: string | undefined;
let nonce: number | undefined;

const useSafeSdk = () => {
  const { query } = useRouter();
  const safeAddress = typeof query.safeAddress === 'string' ? query.safeAddress : '';
  const [signer, setSigner] = useState<Web3.eth.Contract | null>(null);
  
  useEffect(() => {
    const createSdk = async () => {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const signerData = accounts[0];
      
      ethAdapter = new EthersAdapter({
        web3,
        signerAddress: signerData,
      });

      safeSdkInstance = await Safe.create({
        ethAdapter,
        safeAddress,
        isL1SafeMasterCopy: true,
      });

      setSigner(signerData);
      safeService = new SafeServiceClient({
        txServiceUrl: SAFE_TXN_URL,
        ethAdapter,
      });
    };

    createSdk();
    return () => {};
  }, [safeAddress]);

  const isTxnExecutable = useCallback(
    (safeThreshold: number, transaction: SafeMultisigTransactionResponse) => {
      return transaction.confirmations && transaction.confirmations.length >= safeThreshold;
    },
    []
  );

  const approveTransfer = useCallback(
    async ({ safeTxHash, execTxn, hashTxn }: { safeTxHash: string; execTxn: boolean; hashTxn: string }) => {
      if (safeSdkInstance) {
        const tx = await safeService.getTransaction(safeTxHash);

        if (tx) {
          if (!execTxn) {
            const hash = tx.safeTxHash;
            const signature = await safeSdkInstance.signTransactionHash(hash);
            await safeService.confirmTransaction(hash, signature.data);
          } else {
            const safeTransactionData: SafeTransacTransactionData = {
              to: tx.to,
              value: tx.value,
              data: tx.data ? tx.data : '0x',
              operation: tx.operation,
              safeTxGas: tx.safeTxGas,
              baseGas: tx.baseGas,
              gasPrice: Number(tx.gasPrice),
              gasToken: tx.gasToken,
              refundReceiver: tx.refundReceiver ? tx.refundReceiver : '0x0000000000000000000000000000000000000000',
              nonce: tx.nonce,
            };

            let safeTransaction = await safeSdkInstance.createTransaction(safeTransactionData);
            executeTxResponse = await safeSdkInstance.executeTransaction(safeTransaction);
            executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait());
          }
        }
      }
    },
    [safeSdkInstance, safeService]
  );

  const rejectTransfer = useCallback(
    async ({ safeTxHash, execTxn, nonce, hashTxn }: { safeTxHash: string | null; execTxn: boolean; nonce: number; hashTxn: string }) => {
      if (!safeTxHash) {
        if (safeSdkInstance && signer) {
          const safeRejectionTransaction = await safeSdkInstance.createRejectionTransaction(nonce);
          const dataToSign = safeRejectionTransaction.data;
          const dataToSignStringify = JSON.stringify(dataToSign);
          const rejectionsignature = await web3.eth.personal.sign(dataToSignStringify, signer, '');
          const safeRejectionTxHash = await safeSdkInstance.getTransactionHash(safeRejectionTransaction);
          
          await safeService.proposeTransaction({
            safeAddress,
            safeTransactionData: dataToSign,
            safeTxHash: safeRejectionTxHash,
            senderAddress: await web3.eth.getCoinbase(),
            senderSignature: rejectionsignature,
            origin: signer.toString()
          });
        }
      } else {
        const tx = await safeService.getTransaction(safeTxHash);

        if (safeSdkInstance && tx) {
          if (!execTxn) {
            const hash = tx.safeTxHash;
            const signature = await safeSdkInstance.signTransactionHash(hash);
            await safeService.confirmTransaction(hash, signature.data);
          } else {
            const safeTransactionData: SafeTransacTransactionData = {
              to: tx.to,
              value: tx.value,
              data: tx.data ? tx.data : '0x',
              operation: tx.operation,
              safeTxGas: tx.safeTxGas,
              baseGas: tx.baseGas,
              gasPrice: Number(tx.gasPrice),
              gasToken: tx.gasToken,
              refundReceiver: tx.refundReceiver ? tx.refundReceiver : '0x0000000000000000000000000000000000000000',
              nonce: tx.nonce,
            };

            let safeTransaction = await safeSdkInstance.createTransaction(safeTransactionData);

            if (tx.confirmations) {
              tx.confirmations.forEach((confirmation: any) => {
                safeTransaction.addSignature(confirmation.owner);
              });
            }

            executeTxResponse = await safeSdkInstance.executeTransaction(safeTransaction);
            executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait());
            alert(`Execution made for transaction: ${hashTxn}`);
          }
        }
      }
    },
    [safeSdkInstance, safeService, safeAddress, signer]
  );

  return {
    signer,
    safeSdk: safeSdkInstance,
    safeService,
    safeTxHash,
    nonce,
    safeAddress,
    safeTransaction,
    executeTxResponse,
    isTxnExecutable,
    approveTransfer,
    rejectTransfer,
  };
};

export default useSafeSdk;
