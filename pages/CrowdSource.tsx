
// pages/CrowdSource.tsx
import { FC, useState } from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEthersStore } from 'stores/ethersStore';
import NavBar from '@components/NavBar';
import SimpleTransfer from '@components/SimpleTransfer';
import Footer from '@components/Footer';
import { Flex, Center, HStack, Heading, Button } from '@chakra-ui/react';

const CrowdSource: FC = () => {
  // Use the session from next-auth
  const { data: session } = useSession();

  // State for different sections of the page
  const [isCurrentPage, setIsCurrentPage] = useState(false);
  const [isRegistration, setIsRegistration] = useState(false);
  const [isTransaction, setIsTransaction] = useState(false);

  // Use ethersStore to get the address
  const { address } = useEthersStore((state: { address: string }) => ({ address: state.address }));

  // useRouter for navigation
  const { push } = useRouter();

  // Function to handle sign-out
  const handleSignOut = async () => {
    try {
      const data = await signOut({ redirect: false, callbackUrl: '/some' });
      push(data.url);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Flex color='white' direction="column" minH="100vh">
      <Center w="full" bg="green.500" py={6}>
        <HStack spacing="24px">
          {/* Display different content based on user session */}
          {session ? (
            <>
              <div className="min-h-screen">
                <div className='gradient-bg-welcome'>
                  <Heading mb={4}>You are signed in as {session.user?.email}</Heading>
                  <NavBar title={'Dao Page For Blockchain'} address={address} />
                  <SimpleTransfer />
                  <Button onClick={handleSignOut} mt={4}>Sign Out</Button>
                </div>
                {/* Other components */}
                <Footer 
                  message={'Please join us as we make this world a better place'} 
                  community={'Community'} 
                  copyright={'Trademark Policy'} 
                  blog={'Blog'} 
                  FAQ={'FAQ'} 
                  Contact={'blockdao@gmail.com'} 
                  githubUrl={'(https://github.com/ArthurBonsu)'} 
                  twitterUrl={'(https://twitter.com/home'} 
                  discordUrl={'(https://uniswap.org/blog/uniswap-v3)'} 
                />
              </div>
            </>
          ) : (
            <>
              <Heading mb={4}>You are not signed in</Heading>
              <Button onClick={() => signIn()}>Sign In</Button>
            </>
          )}
        </HStack>
      </Center>
    </Flex>
  );
};

export default CrowdSource;