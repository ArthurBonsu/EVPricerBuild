import { Button, ButtonProps, useDisclosure } from '@chakra-ui/react';
import AppAlertDialog from '@components/AppAlertDialog';
import useSafeSdk from 'hooks/useSafeSdk';
import { FC, useCallback, useState } from 'react';
import { SwapTransactionType } from 'types/index';

interface ApproveTransferProps extends ButtonProps {
  safeTxHash: string;
  threshold: number;
  execTxn: boolean; // Change the type from Boolean to boolean
  hashTxn: string;
}

// We need to check if module has been enabled or not 

//Provides the informatin on transfer and offers for transfer 
const ApproveTransfer: FC<ApproveTransferProps> = ({ safeTxHash, threshold, execTxn, hashTxn, ...rest }) => {
  const { approveTransfer } = useSafeSdk(); // Assuming you have this function from useSafeSdk
  
  const [isLoading, setIsLoading] = useState(false);
  const localDisclosure = useDisclosure();

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    await approveTransfer({ safeTxHash, execTxn, hashTxn }); // Fixed the type here
    setIsLoading(false);
  }, [approveTransfer, safeTxHash, execTxn, hashTxn]);

  return (
    <>
      <Button colorScheme="blue" onClick={localDisclosure.onOpen} {...rest}>
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
