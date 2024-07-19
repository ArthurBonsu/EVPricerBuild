// pages/auth/signout.tsx

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Heading } from '@chakra-ui/react';

const SignOut = () => {
  const router = useRouter();

  useEffect(() => {
    signOut({ redirect: false }).then(() => {
      router.push('/');
    });
  }, [router]);

  return <Heading>Signing you out...</Heading>;
};

export default SignOut;
