// Create.tsx

import React, { ReactNode } from 'react';
import {
  Flex,
  Grid,
  Box,
  Input,
  Text,
  Button,
  FormControl,
  FormLabel,
  NumberInputField,
  NumberInput,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react';
import { useForm, useFieldArray } from 'react-hook-form';
import { createSafe } from 'utils/createSafe';
import { getLayout } from '../../components/Layout/Layout';// Adjust the import path if needed

type Address = {
  value: string;
};

type FormData = {
  threshold: number;
  address: Address[];
};

// Define a type for components that use a custom layout
export type WithPageLayout = React.FC & {
  getLayout?: (title: string) => (pageProps: { page: ReactNode }) => ReactNode;
};

const Create: WithPageLayout = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'address',
  });

  const submit = async ({ address, threshold }: FormData) => {
    const filteredAddresses = address.map(({ value }) => value);
    if (filteredAddresses.length < threshold) {
      alert('Threshold is greater than the number of owners');
    } else {
      await createSafe(threshold, filteredAddresses);
    }
  };

  return (
    <Grid placeItems="center" w="full" h="100vh">
      <Box w="500px" shadow="md" p="10" borderRadius="md" bg="gray.50">
        <Flex
          direction="column"
          css={{
            gap: '20px',
          }}
        >
          <form onSubmit={handleSubmit(submit)}>
            {fields.length === 0 && <Text>Please add owners..</Text>}
            {fields.map((field, index) => (
              <InputGroup key={field.id} size="sm" mb="5px">
                <Input
                  {...register(`address.${index}.value`, { required: true })}
                  bg="white"
                />
                <InputRightAddon>
                  <Text
                    onClick={() => remove(index)}
                    _hover={{ cursor: 'pointer' }}
                  >
                    Remove
                  </Text>
                </InputRightAddon>
              </InputGroup>
            ))}
            <Flex justifyContent="space-between" alignItems="center" mb="5px">
              <Text>Address</Text>
              <Button
                bg="blue.200"
                _hover={{ bg: 'blue.300' }}
                textColor="white"
                onClick={() => append({ value: '' })}
              >
                Add
              </Button>
            </Flex>
            <Flex flexDirection="column" mt="20px">
              <FormControl>
                <FormLabel htmlFor="threshold" fontWeight="normal">
                  Threshold
                </FormLabel>
                <NumberInput max={fields.length} min={1} w="90px">
                  <NumberInputField
                    id="threshold"
                    key="threshold"
                    {...register(`threshold`, { required: true })}
                    bg="white"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </Flex>
            <Button
              bg="blue.200"
              _hover={{ bg: 'blue.300' }}
              textColor="white"
              type="submit"
              w="full"
              mt="20px"
              isLoading={isSubmitting}
            >
              Create Safe
            </Button>
          </form>
        </Flex>
      </Box>
    </Grid>
  );
};

// Assign the getLayout function to the Create component
Create.getLayout = function (title: string) {
  return getLayout(title);
};

export default Create;
