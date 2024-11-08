"use client"
import { ComponentType, FC, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { NextPage } from 'next';
import { QueryClientProvider } from 'react-query';
import queryClient from '@config/queryClient';
import { WithPageLayout } from '@components/Layout';
import { useSession } from 'next-auth/react';
import NextAuth from 'next-auth';
import { useRouter } from 'next/router';

// Dynamically import ChakraProvider to disable SSR
const ChakraProvider = dynamic(
  () => import('@chakra-ui/react').then((module) => module.ChakraProvider),
  { ssr: false }
);

// Define types for NextPage and AppProps
type NextPageWithLayout = NextPage & WithPageLayout;
type AppPropsWithLayout = AppProps & { Component: NextPageWithLayout };

const App: FC<AppPropsWithLayout> = ({ Component, pageProps }) => {
  const [isClient, setIsClient] = useState(false);
  const getLayout = Component.getLayout ?? ((page) => page);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setIsClient(typeof window !== 'undefined');
  }, []);

  useEffect(() => {
    if (router.pathname === '/' && isClient) {
      router.push('/signup');
    }
  }, [router, isClient]);

  // Render nothing on server-side or while loading
  if (!isClient) return null;

  return (
    <SessionProvider session={session}>
      <ChakraProvider>
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

export default App;