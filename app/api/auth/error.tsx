// pages/auth/error.tsx

import { useRouter } from 'next/router';
import { useEffect,useCallback, useContext} from 'react';
import { Heading, Text } from '@chakra-ui/react';

const ErrorPage = () => {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div>
      <Heading>Error</Heading>
      <Text>{error ? `Error: ${error}` : 'An unknown error occurred.'}</Text>
    </div>
  );
};

export default ErrorPage;