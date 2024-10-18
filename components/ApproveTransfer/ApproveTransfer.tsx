import { Button, ButtonProps, useDisclosure } from '@chakra-ui/react';
import AppAlertDialog from '@components/AppAlertDialog';
import useLoadSafe from 'hooks/useLoadSafe';
import { FC, useCallback, useState, useEffect } from 'react';
import { PaymentTransactions } from "types";

interface ApproveTransferProps extends ButtonProps {
  transaction: PaymentTransactions;
  safeAddress: string;
  userAddress: string;
}

const ApproveTransfer: FC<ApproveTransferProps> = ({
  transaction,
  safeAddress,
  userAddress,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const localDisclosure = useDisclosure();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsBrowser(true);
    }
  }, []);

  if (!isBrowser) return null;

  const { approveTransfer, ...rest } = useLoadSafe({
    safeAddress,
    userAddress,
  });

  const handleSubmit = useCallback(
    async () => {
      setIsLoading(true);
      await approveTransfer(transaction);
      setIsLoading(false);
    },
    [transaction, approveTransfer]
  );

  return (
    <>
      <Button
        colorScheme="blue"
        onClick={localDisclosure.onOpen}
        {...props}
      >
        Approve
      </Button>
      <AppAlertDialog
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        header="Approve Transaction"
        body="This action will approve this transaction with separate Transaction will be performed to submit the approval."
        disclosure={localDisclosure}
        customOnClose={() => {
          localDisclosure.onClose();
          setIsLoading(false);
        }}
      />
    </>
  );
};

export default ApproveTransfer;