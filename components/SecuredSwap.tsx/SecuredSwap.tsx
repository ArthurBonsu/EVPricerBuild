import { Button, ButtonProps, useDisclosure } from '@chakra-ui/react';
import AppAlertDialog from '@components/AppAlertDialog';
import useSafeSdk from 'hooks/useSafeSdk';
import { FC, useCallback, useState } from 'react';

interface SecuredSwapProps {
  safeTxHash: string | null;
  isDisabled?: boolean;
  threshold: number;
  execTxn: boolean; // Change the type from Boolean to boolean
  nonce: number;
  hashTxn?: string;
}

// Secured swap component
const SecuredSwap: FC<SecuredSwapProps> = ({ safeTxHash, threshold, execTxn, nonce, hashTxn, ...rest }) => {
  const [isLoading, setIsLoading] = useState(false);
  const localDisclosure = useDisclosure();
  const { rejectTransfer } = useSafeSdk();

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);

    await rejectTransfer({ safeTxHash, execTxn, nonce, hashTxn: hashTxn || '' });

    setIsLoading(false);
    localDisclosure.onClose();
  }, [rejectTransfer, safeTxHash, execTxn, nonce, localDisclosure, hashTxn]);

  return (
    <>
      <Button onClick={localDisclosure.onOpen} {...rest}>
        Reject
      </Button>
      <AppAlertDialog
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        header="Reject Transaction"
        body="This action will reject this transaction. A separate Transaction will be performed to submit the rejection."
        disclosure={localDisclosure}
        customOnClose={() => {
          localDisclosure.onClose();
          setIsLoading(false);
        }}
      />
    </>
  );
}

export default SecuredSwap;
