import { FC, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Flex, Center, HStack, Heading, Button } from '@chakra-ui/react';
import NavBar from '@components/NavBar';
import SimpleTransfer from '@components/SimpleTransfer';
import Footer from '@components/Footer';
import Services from '@components/Services';
import Transactions from '@components/Transaction';

//import { AiOutlineChevronUp, AiOutlineDuplicate, AiOutlineLock, AiOutlineLogin, AiOutlineUserAdd } from 'react-icons/ai';

import { FaChevronUp, FaClone, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import logo from '../images/blockdaologo.png';
import { useEthersStore } from 'stores/ethersStore';

// ... (remaining imports)

const DAO: FC = () => {
  const { data: session } = useSession();

  const [isCurrentPage, setisCurrentPage] = useState(false);
  const [isRegistration, setIsRegistration] = useState(false);
  const [isTransaction, setIsTransaction] = useState(false);
  
  const [isSwapping, setIsSwapping] = useState(false);

  // Explicitly define the type of the 'state' parameter
  const address = useEthersStore((state: { address: string }) => state.address);

  const { push } = useRouter();

  const handleSignOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: '/some' });
    push(data.url);
  };

  return (
    <Flex color='white'>
      <Center w='100px' bg='green.500'>
        <HStack spacing='24px'>
          {session ? (
            <>
              <div className='min-h-screen'>
                <div className='gradient-bg-welcome'>
                <Heading>
                  {' '}
           You are signed in as {session?.user?.email || 'Guest'}{' '}
               </Heading>

                  <NavBar
                    title={'Dao Page For Blockchain'}
                    address={'blockchain address'}
                  />
                  <SimpleTransfer />
                  <Button onClick={handleSignOut}> Sign Out</Button>
                  <Button onClick={async () => await handleSignOut}>
                    SignIn{' '}
                  </Button>
                </div>
                <DAO />
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
              <Heading> You are not signed in </Heading>
              <Button onClick={() => signIn()}> Sign In </Button>

            </>
          )}
        </HStack>
      </Center>
    </Flex>
  );
};

export default DAO;
