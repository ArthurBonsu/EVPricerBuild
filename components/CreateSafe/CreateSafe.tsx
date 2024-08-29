import { FC, useState, useCallback, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useLoadSafe } from '../../hooks/useLoadSafe';
import useSafeDetailsAndSetup from 'hooks/useSafeDetails.ts';
import { useRouter } from 'next/router';
import { SafecontractAddress } from 'constants/constants';
import { useUserStore } from 'stores/userStore';
import { Avatar, Button, Flex, Heading, Menu, ButtonProps, useDisclosure, MenuButton, MenuList, Text, useClipboard, Input, Stack, InputGroup, InputLeftElement, InputRightElement, Box, Grid, VStack, FormControl, FormLabel, FormErrorMessage, FormHelperText, chakra, } from '@chakra-ui/react';
import { useAppToast } from 'hooks/index';
import { BsGithub, BsTwitter, BsGoogle } from 'react-icons/bs';
import { signInWithPopup } from 'firebase/auth';
import { GoogleAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import { auth } from 'firebaseConfig';
import { useSafeStore } from 'stores/safeStore';
import { useEthersStore } from 'stores/ethersStore';

const { setUpMultiSigSafeAddress } = useSafeDetailsAndSetup;

const CreateSafe: FC = () => {
  const router = useRouter();
  const { replace } = useRouter();
  const useraddress = useEthersStore((state) => state.address);

  useEffect(() => {
    if (!useraddress) {
      replace('/');
    }
  }, [useraddress, replace]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { data: session, status } = useSession();

  const safeStore = useSafeStore();
  const { safeAddress, ownersAddress, contractAddress } = safeStore;
  const { setSafeAddress, setOwnersAddress, setContractAddress, setSafeStore } = safeStore;

  const [isCreatingSafe, setIsCreatingSafe] = useState(false);
  const { executeSafeTransaction, userAddToSafe, isLoading } = useLoadSafe({ safeAddress, userAddress: useraddress });

  const handleCreateSafe = async () => {
    try {
      setIsCreatingSafe(true);
      const newSafeAddress = await setUpMultiSigSafeAddress(SafecontractAddress);
      setSafeAddress(newSafeAddress);
      setSafeStore({ 
        safeAddress: newSafeAddress, 
        ownersAddress: [], 
        contractAddress: SafecontractAddress 
      });
      setIsCreatingSafe(false);
      console.log(`Safe Address: ${newSafeAddress}`);
    } catch (error) {
      console.error(error);
      // Display an error message to the user, e.g., using `useAppToast`
    }
  };

  if (session) {
    setTimeout(() => {
      router.push('/');
    }, 5000);
    return (
      <Box maxW="md" mx="auto" mt={8}>
        <Heading mb={6}>You are already signed in</Heading>
        <Text>Redirecting to home page in 5 seconds...</Text>
      </Box>
    );
  }

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <Heading mb={6}>Sign Up</Heading>
      <VStack spacing={4}>
        <Button onClick={handleCreateSafe} disabled={isCreatingSafe || isLoading}> Create Safe </Button>
        {safeAddress && (
          <Text> Safe Address: <code>{safeAddress}</code> </Text>
        )}
      </VStack>
    </Box>
  );
};

export default CreateSafe;