import { FC, useEffect } from 'react'
import { Button, Grid } from '@chakra-ui/react'

import { useRouter } from 'next/router'

import { useSession } from 'next-auth/react'
import { useSwapStore } from 'stores/ContextStores/useSwapStore';

import { useEthersStore  } from 'stores/ethersStore'
import { useSafeStore  } from 'stores/safeStore'
import { useHashTransactionStore  } from 'stores/transactionStore'
import { useUserStore  } from 'stores/userStore'

//HOOKS
import  useEthers   from 'hooks/useEthers'
import  useFetch   from 'hooks/useFetch'
import  useLoadSafe   from 'hooks/useLoadSafe'
import  useSafe   from 'hooks/useSafe'
import useSafeSdk   from 'hooks/useSafeSdk'
import useTransactions   from 'hooks/useTransactions'

import useSafeInfo from 'hooks/useSafe'
//Context 
import  useCrowdsourceContext   from 'context/useCrowdsourceContext'
import  useDaoContext   from 'context/useDaoContext'
import  useSwapContext   from 'context/useSwapContext'
import  useTransactionContext   from 'context/useTransactionContext'
import useTransferContext   from 'context/useTransferContext'

export const Auth: FC = () => {
  const { onConnect } = useEthers()
  const { push } = useRouter()
  const address = useEthersStore((state: { address: string }) => state.address);


 
 useEffect(() => {
    if (address) {
      push('/safe')
    }
  }, [address, push])
  
  return (
    <Grid placeItems="center" h="100vh">
      <Button onClick={onConnect}>Connect</Button>
    </Grid>
  )
}

export default Auth
