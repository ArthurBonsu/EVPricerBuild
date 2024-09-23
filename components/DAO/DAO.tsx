import {
  Button,
  ButtonProps,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import AppModal from '@components/AppModal';
import { useEffect, useState, useContext } from 'react';
import useLoadSafe from '../../hooks/useLoadSafe';


interface PaymentTransactions {
  safeTxHash: string;
  safeRejectTxHash: string | null;
  threshold: string | number | undefined;
  nonce: number;
  hashTxn?: string;
}

interface ExecuteTransferProps {
  transaction: PaymentTransactions;
  safeAddress: string;
  userAddress: string;
}

const DAO: React.FC<ExecuteTransferProps> = ({
  transaction,
  safeAddress,
  userAddress,
  ...rest
}) => {
  const [approveExeIsLoading, setApproveExeIsLoading] = useState<boolean>(false);
  const [rejectExeIsLoading, setRejectExeIsLoading] = useState<boolean>(false);
  const [isApprovalExecutable, setIsApprovalExecutable] = useState<boolean>(false);
  const [isRejectionExecutable, setIsRejectionExecutable] = useState<boolean>(false);
  const localDisclosure = useDisclosure();
  const { approveTransfer, rejectTransfer, checkIfTxnExecutable, } = useLoadSafe({
    safeAddress,
    userAddress,
  });

  useEffect(() => {
    const getExecutables = async () => {
      if (transaction) {
        const approvalTx = await checkIfTxnExecutable(transaction);
        if (approvalTx) {
          setIsApprovalExecutable(true);
        }
      }
    };
    getExecutables();
  }, [checkIfTxnExecutable, transaction]);

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
                setApproveExeIsLoading(true);
                await approveTransfer(transaction);
                setApproveExeIsLoading(false);
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
                setRejectExeIsLoading(true);
                await rejectTransfer(transaction);
                setRejectExeIsLoading(false);
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

export default DAO;