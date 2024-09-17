// app/pages/index.tsx

import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Grid } from '@chakra-ui/react';
import { useSession, signOut } from 'next-auth/react';
import { useEthersStore } from 'stores/ethersStore';
import SignUpPage from './AppSignUpPage';

const Home: FC = () => {
  const [isCurrentPage, setIsCurrentPage] = useState(false);
  const [isRegistration, setIsRegistration] = useState(false);
  const [isTransaction, setIsTransaction] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  const { push } = useRouter();
  const { data: session, status } = useSession();
  const address = useEthersStore(state => state.address);

  useEffect(() => {
    if (address) {
      push('/safe'); // Redirect to safe page if Ethereum address is available
    } else if (status === 'authenticated') {
      push('/dashboard'); // Redirect to dashboard if authenticated but no address
    } else {
      push('/signup'); // Redirect to signup page if not authenticated
    }
  }, [status, address, push]);

  const handleConnect = () => {
    // Implement your connection logic here
    console.log('Button Clicked');
  };

  const handleSignOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: '/some' });
    push(data.url);
  };

  return (
    <Grid placeItems="center" h="100vh">
      <Button onClick={handleConnect}>Connect</Button>
      <SignUpPage />
    </Grid>
  );
};

export default Home;
