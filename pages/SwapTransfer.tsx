import React, { FC, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Box, Flex, Heading, Button, HStack, Center } from '@chakra-ui/react';
import { IoChevronUpSharp, IoDuplicateSharp, IoLockClosedSharp, IoLogInSharp, IoPersonAddSharp, IoAddSharp, IoBookSharp, IoCubeSharp } from 'react-icons/io5'; // Import icons from react-icons
import { BsGraphUp, BsFillPersonFill } from 'react-icons/bs';
import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import NavBar from '@components/NavBar';
import Footer from '@components/Footer';
import SimpleTransfer from '@components/SimpleTransfer';
import { useEthersStore } from 'stores/ethersStore';

const SwapTransfer: FC = () => {
  const { data: session } = useSession();
  const [isCurrentPage, setisCurrentPage] = useState(false);
  const { push } = useRouter();
  const address = useEthersStore((state: { address: string }) => state.address);

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
                <Heading> You are signed in as {session.user?.email || 'Unknown User'} </Heading>
                  <NavBar title={'Swap Transfer'} address={address || '0x.. '} />
                  <Button> Sign Out</Button>
                  <Button onClick={async () => handleSignOut()}>Sign In</Button>
                </div>
                <SimpleTransfer />
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
              <Button onClick={async () => signIn()}> Sign In </Button>
            </>
          )}
        </HStack>
      </Center>
    </Flex>
  );
};

export default SwapTransfer;
