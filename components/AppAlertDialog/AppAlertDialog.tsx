import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  UseDisclosureReturn,
} from '@chakra-ui/react';
import { FC, useRef,useContext} from 'react';

interface AppAlertDialogProps {
  customOnClose: () => void;
  disclosure: UseDisclosureReturn;
  isLoading: boolean;
  handleSubmit: () => void;
  header?: string;
  body?: string;
}

const AppAlertDialog: FC<AppAlertDialogProps> = ({
  customOnClose,
  disclosure,
  isLoading,
  handleSubmit,
  header,
  body,
}) => {
  const { isOpen } = disclosure;
  const cancelRef = useRef<HTMLButtonElement | null>(null); // Define the type of ref

  // ALERT FOR ALERTING THINGS
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={customOnClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>{header}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>{body}</AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={customOnClose}>
            Close
          </Button>
          <Button
            colorScheme="blue"
            ml={3}
            onClick={handleSubmit}
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            Submit
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AppAlertDialog;
