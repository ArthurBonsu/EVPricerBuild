import dynamic from 'next/dynamic';
import { FC, useState, useEffect, useCallback, useContext } from 'react';
import { FaChevronUp, FaClone, FaLock, FaSignInAlt, FaUserPlus, FaPlus, FaBookOpen, FaCube } from 'react-icons/fa';
import { BsInfoCircle, BsGithub, BsTwitter, BsGoogle } from 'react-icons/bs';
import { useRouter } from 'next/router';
import NavBar from '@components/NavBar';
import Services from '@components/Services';
import Footer from '@components/Footer';

const Button = dynamic(() => import('@chakra-ui/react').then((module) => module.Button), { ssr: false });
const Input = dynamic(() => import('@chakra-ui/react').then((module) => module.Input), { ssr: false });
const Flex = dynamic(() => import('@chakra-ui/react').then((module) => module.Flex), { ssr: false });
const Box = dynamic(() => import('@chakra-ui/react').then((module) => module.Box), { ssr: false });
const Heading = dynamic(() => import('@chakra-ui/react').then((module) => module.Heading), { ssr: false });
const VStack = dynamic(() => import('@chakra-ui/react').then((module) => module.VStack), { ssr: false });
const Center = dynamic(() => import('@chakra-ui/react').then((module) => module.Center), { ssr: false });
const HStack = dynamic(() => import('@chakra-ui/react').then((module) => module.HStack), { ssr: false });

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEthersStore } from 'stores/ethersStore';

const HomePage: FC = () => {
  const { data: session } = useSession();
  const [isCurrentPage, setIsCurrentPage] = useState(false);
  const [isRegistration, setIsRegistration] = useState(false);
  const [isTransaction, setIsTransaction] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  const address = useEthersStore((state) => state.address);
  const { push } = useRouter();

  const handleSignOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: '/some' });
    push(data.url);
  };

  return (
    <Flex color='white' direction="column" minH="100vh">
      <Center w="full" bg="green.500" py={6}>
        <HStack spacing="24px">
          {session ? (
            <>
              <div className="min-h-screen">
                <div className="gradient-bg-welcome">
                  <Heading mb={4}>You are signed in as {session?.user?.email}</Heading>
                  <NavBar title={'Dao Page For Blockchain'} address={address} />
                  <Button onClick={handleSignOut} mt={4}>Sign Out</Button>
                </div>
                <Services color={'blue'} title={'BlockDaO Services'} icon={<BsInfoCircle />} subtitle={'We deliver multiple services such as DAO and Crowdsource funds for you and your partners'} />
                <Footer
                  message={'Please join us as we make this world a better place'}
                  community={'Community'}
                  copyright={'Trademark Policy'}
                  blog={'Blog'}
                  FAQ={'FAQ'}
                  Contact={'blockdao@gmail.com'}
                  githubUrl={'(https://github.com/ArthurBonsu)'}
                  twitterUrl={'(https://twitter.com/home)'}
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

export default HomePage;
