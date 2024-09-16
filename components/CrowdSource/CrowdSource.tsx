import { useEffect, useState } from 'react';
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
  const { isLoading, safe, checkIsSigned } = useLoadSafe({
    safeAddress,
    userAddress,
  });

  const approveTransfer = async (transaction: PaymentTransactions) => {
    setApproveExeIsLoading(true);
    // implement approve transfer logic here
    setApproveExeIsLoading(false);
  };

  const rejectTransfer = async (transaction: PaymentTransactions) => {
    setRejectExeIsLoading(true);
    // implement reject transfer logic here
    setRejectExeIsLoading(false);
  };

  const isTxnExecutable = async (transaction: PaymentTransactions) => {
    // implement is transaction executable logic here
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
  }, [isTxnExecutable, transaction]);

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
                await approveTransfer(transaction);
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
                await rejectTransfer(transaction);
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