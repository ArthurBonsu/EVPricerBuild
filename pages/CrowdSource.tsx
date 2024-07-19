// Import necessary modules and components
import { FC, useState } from 'react';
import { useSession, signOut, signIn } from 'next-auth/react'; // Make sure to import signIn
import { useRouter } from 'next/router';
import { useEthersStore } from 'stores/ethersStore';
import NavBar from '@components/NavBar';
import SimpleTransfer from '@components/SimpleTransfer';
import Footer from '@components/Footer';
import { Flex, Center, HStack, Heading, Button } from '@chakra-ui/react';

const Crowdsource: FC = () => {
  // Use the session from next-auth
  const { data: session } = useSession();
  
  // State for different sections of the page
  const [isCurrentPage, setisCurrentPage] = useState(false);
  const [isRegistration, setIsRegistration] = useState(false);
  const [isTransaction, setIsTransaction] = useState(false);

  // Use ethersStore to get the address
  const { address } = useEthersStore((state: { address: string }) => ({
    address: state.address,
  }));

  // useRouter for navigation
  const { push } = useRouter();

  // Function to handle sign-out
  const handleSignOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: '/some' });
    push(data.url);
  };

  return (
    <Flex color='white'>
      <Center w='100px' bg='green.500'>
        <HStack spacing='24px'>
          {/* Display different content based on user session */}
          {session ? (
            <>
              <div className="min-h-screen">
                <div className='gradient-bg-welcome'>
                  <Heading > You are signed in as {session.user?.email} </Heading>
                  <NavBar title={'Dao Page For Blockchain'} address={address} />
                  <SimpleTransfer />
                  <Button onClick={handleSignOut}>Sign Out</Button>
                </div>
                {/* Other components */}
                <Footer
                  message={'Please join us as we make this world a better place'}
                  community={'Community'}
                  copyright={'Trademark Policy'}
                  blog={'Blog'}
                  FAQ={'FAQ'}
                  Contact={'blockdao@gmail.com'}
                  Githuburl={'https://github.com/ArthurBonsu'}
                  Twitterurl={'https://twitter.com/home'}
                  Discordurl={'https://uniswap.org/blog/uniswap-v3'}
                />
              </div>
            </>
          ) : (
            <>
              <Heading > You are not signed in </Heading>
              <Button onClick={() => signIn()}> Sign In </Button> {/* Use signIn as a function */}
            </>
          )}
        </HStack>
      </Center>
    </Flex>
  );
};

export default Crowdsource;
