import { useEffect, useState, useCallback, useContext } from 'react';
import { Button, ButtonProps, Flex, useDisclosure } from '@chakra-ui/react';
import AppModal from '../AppModal/AppModal';
import useLoadSafe from 'hooks/useLoadSafe';
import { PaymentTransactions } from "types";

export interface CrowdsourceTransferProps {
  transaction: PaymentTransactions;
  safeAddress: string;
  userAddress: string;
}

export const CrowdSource: React.FC<CrowdsourceTransferProps> = ({
  transaction,
  safeAddress,
  userAddress,
  ...rest
}) => {
  const [approveExeIsLoading, setApproveExeIsLoading] = useState(false);
  const [rejectExeIsLoading, setRejectExeIsLoading] = useState(false);
  const [isApprovalExecutable, setIsApprovalExecutable] = useState(false);
  const [isRejectionExecutable, setIsRejectionExecutable] = useState(false);
  const localDisclosure = useDisclosure();
  const { proposeTransaction,approveTransfer, rejectTransfer, checkIfTxnExecutable, isLoading, safe, checkIsSigned } = useLoadSafe({
    safeAddress,
    userAddress,
  });

  const approveTransfers = async (transaction: PaymentTransactions) => {
    setApproveExeIsLoading(true);
    await approveTransfer(transaction);
    setApproveExeIsLoading(false);
  };

  const rejectTransfers = async (transaction: PaymentTransactions) => {
    setRejectExeIsLoading(true);
    await rejectTransfer(transaction);
    setRejectExeIsLoading(false);
  };

  const isTxnExecutable = async (transaction: PaymentTransactions) => {
    await checkIfTxnExecutable(transaction);
    return true; // replace with actual logic
  };

  useEffect(() => {
    const getExecutables = async () => {
      if (transaction) {
        const approvalTx = await isTxnExecutable(transaction);
        if (approvalTx) {
          setIsApprovalExecutable(true);
        }
      }
    };
    getExecutables();
  },);

  const checkTxnExecutable = useCallback(async (transaction: PaymentTransactions) => {
    try {
      const approvalTx = await checkIfTxnExecutable(transaction);
      return approvalTx;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [checkIfTxnExecutable]);
  
  useEffect(() => {
    const getExecutables = async () => {
      if (transaction) {
        const approvalTx = await checkTxnExecutable(transaction);
        if (approvalTx) {
          setIsApprovalExecutable(true);
        }
      }
    };
    getExecutables();
  }, [transaction, checkTxnExecutable]);
  return (
    <div>
      <Button {...rest} onClick={localDisclosure.onOpen}>
        Execute
      </Button>
      <AppModal
        disclosure={localDisclosure}
        title="Execute Transaction"
        modalSize="sm"
      >
        <Flex
          justify="space-between"
          py={6}
          alignItems="center"
          flexDirection="row"
        >
          {isApprovalExecutable && (
            <Button
              isLoading={approveExeIsLoading}
              isDisabled={approveExeIsLoading}
              onClick={async () => {
                await approveTransfers(transaction);
                localDisclosure.onClose();
              }}
            >
              Execute Approval
            </Button>
          )}
          {isRejectionExecutable && (
            <Button
              isLoading={rejectExeIsLoading}
              isDisabled={rejectExeIsLoading}
              onClick={async () => {
                await rejectTransfers(transaction);
                localDisclosure.onClose();
              }}
            >
              Execute Rejection
            </Button>
          )}
        </Flex>
      </AppModal>
    </div>
  );
};

export default CrowdSource;