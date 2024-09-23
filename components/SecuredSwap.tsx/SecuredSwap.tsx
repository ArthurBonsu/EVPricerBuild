import { Button, ButtonProps, useDisclosure } from '@chakra-ui/react';
import AppAlertDialog from '@components/AppAlertDialog';
import useSafeSdk, { useLoadSafe } from 'hooks/useLoadSafe';
import { FC, useCallback, useState, useContext } from 'react';

interface SecuredSwapProps {
  safeTxHash: string | null;
  safeAddress: string;
  userAddress: string;
  isDisabled?: boolean;
  threshold: number;
  execTxn: boolean; 
  nonce: number;
  hashTxn?: string;
}

// Secured swap component
const SecuredSwap: FC<SecuredSwapProps> = ({
  safeTxHash,
  safeAddress,
  userAddress,
  threshold,
  execTxn,
  nonce,
  hashTxn,
  ...rest
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const localDisclosure = useDisclosure();
  const { rejectTransfer } = useLoadSafe({ safeAddress, userAddress });

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
};

export default SecuredSwap;