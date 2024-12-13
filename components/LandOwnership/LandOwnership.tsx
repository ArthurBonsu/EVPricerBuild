
// LandOwnership.tsx
import {
  Button,
  ButtonProps,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import {
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';
import AppModal from '../AppModal/AppModal';
import useLandOwnershipContext from 'context/useLandOwnership';

export interface LandOwnershipProps {
  landId: number;
  landOwner: string;
  landLocation: string;
  landSize: number;
  landPrice: number;
}

export const LandOwnership: React.FC<LandOwnershipProps> = ({
  landId,
  landOwner,
  landLocation,
  landSize,
  landPrice,
  ...rest
}) => {
  const router = useRouter();
  const disclosure = useDisclosure();
  const {
    mapKeygetter,
    getMaxtimestampToken,
    getMaxtimestampPerToken,
    selectTokenType,
    getAllTokenOfParticularType,
    getLatestTokenOfType,
    getLatestTokenOfAllThreeTypes,
    getWithdrawnAmountOfTokenType,
    getDepositedAmountOfTokenType,
    getPortFolioValueOfSpecifiedToken,
    getPortFolioWithDate,
    getDatedWithdrawnAmountOfTokenType,
    getDatedDepositedAmountOfTokenType,
    getDatedPortFolioValueOfTokenType,
    getDatedPortFolioValueOfAllThreeTypes,
    getPortFolioValueOfTokenofAllThreeTypes,
  } = useLandOwnershipContext();

  const [isLandOwner, setIsLandOwner] = useState(false);
  const [isLandAvailable, setIsLandAvailable] = useState(false);

  useEffect(() => {
    if (landOwner === '0x...') {
      setIsLandOwner(true);
    }
    if (landPrice > 0) {
      setIsLandAvailable(true);
    }
  }, [landOwner, landPrice]);

  const buyLand = async () => {
    // implement buy land logic here
  };

  const transferLand = async () => {
    // implement transfer land logic here
  };

  const updateLandPrice = async () => {
    // implement update land price logic here
  };

  return (
    <div>
      <Button {...rest} onClick={disclosure.onOpen}>
        View Land Details
      </Button>
      <AppModal
        disclosure={disclosure}
        title="Land Details"
        modalSize="sm"
      >
        <Flex
          justify="space-between"
          py={6}
          alignItems="center"
          flexDirection="row"
        >
          {isLandOwner && (
            <Button
              isLoading={false}
              isDisabled={false}
              onClick={async () => {
                await transferLand();
                disclosure.onClose();
              }}
            >
              Transfer Land
            </Button>
          )}
          {isLandAvailable && (
            <Button
              isLoading={false}
              isDisabled={false}
              onClick={async () => {
                await buyLand();
                disclosure.onClose();
              }}
            >
              Buy Land
            </Button>
          )}
          <Button
            isLoading={false}
            isDisabled={false}
            onClick={async () => {
              await updateLandPrice();
              disclosure.onClose();
            }}
          >
            Update Land Price
          </Button>
        </Flex>
      </AppModal>
    </div>
  );
};

export default LandOwnership;