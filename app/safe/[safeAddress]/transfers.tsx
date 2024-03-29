// File: ./app/safe/[safeAddress]/transfers.tsx

import { Box, Spinner, Table, Thead, Th, Tbody, Tr, Td } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form'; // Import React Hook Form
import { useEthersStore, EtherStore } from 'stores/ethersStore'; // Import EtherStore
import PageSelection from '@components/PageSelection';
import { getLayout, WithPageLayout } from '@components/Layout';
import queries from 'services/queries';
import { ErrorType, TransfersType, ExtendedTransferType } from 'types/index';

interface FormData {
  // Define your form fields here
}

const Transfers: WithPageLayout = () => {
  const { query } = useRouter();
  const safeAddress = typeof query.safeAddress === 'string' ? query.safeAddress : '';
  const address = useEthersStore((state: EtherStore) => state.address);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { data, isLoading, isError, error } = useQuery<TransfersType>(
    `${safeAddress}-transfers`,
    () => queries.getSafeTransfers(safeAddress)(),
    {
      enabled: !!safeAddress,
      retry: 2,
      onError: (err: unknown) => {
        if (err instanceof Error) {
          console.error(err); // Log the error for debugging purposes
        }
      },
    }
  );

  // Your form submit function
  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
    // Handle your form submission logic here
  };

  return (
    <Box py={6}>
      <PageSelection value="transfers" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Table>
          <Thead bg="gray.100">
            <Tr>
              <Th>Transfer Type</Th>
              <Th>Amount</Th>
              <Th>Recipient</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.results.map((transfer) => {
              if ('amount' in transfer) {
                const extendedTransfer = transfer as ExtendedTransferType;
                return (
                  <Tr key={extendedTransfer.safeTxHash}>
                    <Td>{extendedTransfer.isExecuted ? 'Executed' : 'Not Executed'}</Td>
                    <Td>{extendedTransfer.amount}</Td>
                    <Td>{extendedTransfer.recipient}</Td>
                  </Tr>
                );
              }
              return null; // or some default if it's not the extended type
            })}
          </Tbody>
        </Table>

        {/* Your form fields go here */}
        <button type="submit">Submit</button>
      </form>

      {isError && (
        <Box>
          <span>
            Error: {Object.values(errors).map((error) => error.message).join(', ') ||  'An unexpected error occurred'}
          </span>
        </Box>
      )}

      {isLoading && (
        <Box minH="calc(100vh - 64px)" alignItems="center" justifyContent="center">
          <Spinner />
        </Box>
      )}
    </Box>
  );
};

Transfers.getLayout = getLayout('Transfers');
export default Transfers;
