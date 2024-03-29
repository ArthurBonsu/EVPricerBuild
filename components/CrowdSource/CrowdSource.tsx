import { useEffect, useState } from 'react';
import { Button, ButtonProps, Flex, useDisclosure } from '@chakra-ui/react';
import AppModal from '../AppModal/AppModal';
import { useSafeSdk } from 'hooks';

export interface CrowdsourceTransferProps {
  safeTxHash: string;
  safeRejectTxHash: string | null;
  threshold: string | number | undefined;
  nonce: number;
  hashTxn?: string;
}

export const CrowdSource: React.FC<CrowdsourceTransferProps> = ({
  safeTxHash,
  safeRejectTxHash,
  threshold,
  nonce,
  hashTxn,
  ...rest
}) => {
  const [approveExeIsLoading, setApproveExeIsLoading] = useState(false);
  const [rejectExeIsLoading, setRejectExeIsLoading] = useState(false);

  const [isApprovalExecutable, setIsApprovalExecutable] = useState(false);
  const [isRejectionExecutable, setIsRejectionExecutable] = useState(false);
  const localDisclosure = useDisclosure();

  const { isTxnExecutable, safeService, approveTransfer, rejectTransfer } = useSafeSdk();

  useEffect(() => {
    const getExecutables = async () => {
      if (safeTxHash && threshold) {
        const approvalTx = await safeService.getTransaction(safeTxHash);
        if (approvalTx && isTxnExecutable(Number(threshold), approvalTx)) {
          setIsApprovalExecutable(true);
        }
      }

      if (safeRejectTxHash) {
        const rejectionTx = await safeService.getTransaction(safeRejectTxHash);
        if (rejectionTx && isTxnExecutable(Number(threshold), rejectionTx)) {
          setIsRejectionExecutable(true);
        }
      }
    };

    getExecutables();
  }, [isTxnExecutable, safeRejectTxHash, safeService, safeTxHash, threshold]);

  return (
    <div>
      <Button {...rest} onClick={localDisclosure.onOpen}>
        Execute
      </Button>
      <AppModal disclosure={localDisclosure} title="Execute Transaction" modalSize="sm">
        <Flex justify="space-between" py={6} alignItems="center" flexDirection="row">
          {isApprovalExecutable && (
            <Button
              isLoading={approveExeIsLoading}
              isDisabled={approveExeIsLoading}
              onClick={async () => {
                if (hashTxn) {
                  setApproveExeIsLoading(true);
                  await approveTransfer({ safeTxHash, execTxn: true, hashTxn });
                  setApproveExeIsLoading(false);
                  localDisclosure.onClose();
                }
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
             if (hashTxn && safeRejectTxHash) {
               setRejectExeIsLoading(true);
               await rejectTransfer({ safeTxHash: safeRejectTxHash, execTxn: true, hashTxn, nonce });
               setRejectExeIsLoading(false);
               localDisclosure.onClose();
             }
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