// Parameter Libraries
// Stores Library
import { useSwapStore } from 'stores/ContextStores/useSwapStore';
import { useEthersStore } from 'stores/ethersStore';
import { useSafeStore } from 'stores/safeStore';
import { useTransactionStore } from 'stores/transactionStore';
import { useUserStore } from 'stores/userStore';

// HOOKS
import useEthers from 'hooks/useEthers';
import useFetch from 'hooks/useFetch';
import useLoadSafe from 'hooks/useLoadSafe';
import useSafe from 'hooks/useLoadSafe';

import useTransactions from 'hooks/useTransactions';

// Context 
import useCrowdsourceContext from 'context/useCrowdsourceContext';
import useDaoContext from 'context/useDaoContext';
import useSwapContext from 'context/useSwapContext';
import useTransactionContext from 'context/useTransactionContext';
import useTransferContext from 'context/useTransferContext';

import { FC, useEffect, useState, useContext } from 'react';
import { Flex, Box, Button, Heading, VStack, Input } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';
import { ethers } from 'ethers';
import NavBar from '@components/NavBar';
import Footer from '@components/Footer';

const SecuredSwap: FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { address, provider } = useEthersStore((state) => ({
    address: state.address,
    provider: state.provider,
  }));

  const [transactionHash, setTransactionHash] = useState<string>('');
  const [swapAmount, setSwapAmount] = useState<string>('');

  const handleSignOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: '/some' });
    router.push(data.url);
  };

  const handleSwap = async () => {
    if (!provider || !address) {
      console.error('Provider or address not found');
      return;
    }

    const signer = provider.getSigner();
    const swapContractAddress = '0xYourSwapContractAddress'; // Replace with your swap contract address
    const swapContractAbi :any= [
      // Add your swap contract ABI here
    ];

    const swapContract = new ethers.Contract(swapContractAddress, swapContractAbi, signer);

    try {
      const tx = await swapContract.swap(ethers.utils.parseEther(swapAmount));
      setTransactionHash(tx.hash);
      console.log('Swap transaction hash:', tx.hash);
    } catch (error) {
      console.error('Swap transaction failed:', error);
    }
  };

  useEffect(() => {
    if (session) {
      // Load necessary data
    }
  }, [session]);

  if (status === 'loading') {
    return <Heading>Checking Authentication ...</Heading>;
  }

  return (
    <Flex direction="column" align="center" justify="center" minH="100vh" bg="gray.800" color="white">
      <NavBar title="Secured Swap" address={address} />

      <VStack spacing={4} mt={8}>
        {session ? (
          <>
            <Heading>Secured Swap</Heading>
            <Input
              placeholder="Enter amount to swap"
              value={swapAmount}
              onChange={(e) => setSwapAmount(e.target.value)}
            />
            <Button onClick={handleSwap}>Swap</Button>
            {transactionHash && <Box>Transaction Hash: {transactionHash}</Box>}
            <Button onClick={handleSignOut}>Sign Out</Button>
          </>
        ) : (
          <>
            <Heading>You are not signed in</Heading>
            <Button onClick={() => signIn()}>Sign In</Button>
          </>
        )}
      </VStack>

      <Footer
        message="Please join us as we make this world a better place"
        community="Community"
        copyright="Trademark Policy"
        blog="Blog"
        FAQ="FAQ"
        Contact="blockdao@gmail.com"
        githubUrl="https://github.com/ArthurBonsu"
        twitterUrl="https://twitter.com/home"
        discordUrl="https://uniswap.org/blog/uniswap-v3"
      />
    </Flex>
  );
};

export default SecuredSwap;
