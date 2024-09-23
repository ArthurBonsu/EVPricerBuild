import { ComponentType, FC, useState, useEffect,useContext } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';

import Head from 'next/head';
import { AppProps } from 'next/app';
import { NextPage } from 'next';
import { QueryClientProvider } from 'react-query';

import dynamic from 'next/dynamic';

import queryClient from '@config/queryClient';
import { WithPageLayout } from '@components/Layout';
//import theme from '@theme'; // Update the import statement
import { useSession } from 'next-auth/react';
import NextAuth from 'next-auth';
import { useRouter } from 'next/router';

type NextPageWithLayout = NextPage & WithPageLayout;
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App: FC<AppPropsWithLayout> = ({ Component, pageProps: { ...pageProps } }) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/') {
      router.push('/signup');
    }
  }, [router]);
  return (
    <SessionProvider session={session}>
      <ChakraProvider >
        <QueryClientProvider client={queryClient}>
          <Head>
            <title>{process.env.appName}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </Head>
          {getLayout(<Component {...pageProps} />)}
        </QueryClientProvider>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
