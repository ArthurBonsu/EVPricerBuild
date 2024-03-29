import { FC, useState } from 'react';
import { FaChevronUp, FaClone, FaLock, FaSignInAlt, FaUserPlus, FaPlus, FaBookOpen, FaCube } from 'react-icons/fa';
import { BsInfoCircle, BsGithub, BsTwitter, BsGoogle } from 'react-icons/bs';
import { useRouter } from 'next/router';
import NavBar from '@components/NavBar';
import Services from '@components/Services';
import Footer from '@components/Footer';
import { Flex, Center, HStack, Heading, Button } from '@chakra-ui/react';

import { useSession, signIn } from 'next-auth/react';  // Updated import
import { useEthersStore } from 'stores/ethersStore';
import { signOut } from 'next-auth/react';

// Assuming your state has a property named 'address'
type EthersStoreState = {
  address: string; // Replace 'string' with the actual type of the 'address' property
  // Add other properties as needed
};

const HomePage: FC = () => {
  const { data: session } = useSession();
  const [isCurrentPage, setisCurrentPage] = useState(false);
  const [isRegisteration, setIsRegistration] = useState(false);
  const [isTransaction, setIsTransaction] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  // Usage in your component
  const address = useEthersStore((state: EthersStoreState) => state.address);
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
              <div className="min-h-screen">
                <div className='gradient-bg-welcome'>
                  <Heading> You are signed in as {session?.user?.email} </Heading>
                  <NavBar title={'Dao Page For Blockchain'} address={'blockchain address'} />
                  <Button> Sign Out</Button>
                  <Button onClick={async () => await handleSignOut()}>SignIn </Button>
                </div>
                <Services
           color={'blue'}
          title={'BlockDaO Services'}
           icon={<BsInfoCircle />}
           subtitle={'We deliver multiple services such as DAO and Crowdsource funds for you and your partners'}
             />
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

export default HomePage;
