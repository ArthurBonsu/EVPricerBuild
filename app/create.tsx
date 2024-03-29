
// Update the import statement in create.tsx
import { createSafe } from 'utils/createSafe'; // Use the correct relative path


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
} from '@chakra-ui/react'
import { useForm, useFieldArray } from 'react-hook-form';
import { getLayout, WithPageLayout } from '@components/Layout';

//require ("../hardhat.config")

type address = {
  value: string
}

type formData = {
  treshold: number
  address: address[]
}

export const Create: WithPageLayout = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<formData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'address',
  
  })

  const submit = async ({ address, treshold }: formData) => {
    const filteredAddresses = address.map(({ value }) => value)
    if (filteredAddresses.length < treshold) {
      alert('Treshold is greater than the number of owners')
    } else {
      await createSafe( treshold,filteredAddresses)
    }
  }

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
            {Boolean(fields.length === 0) && <Text>Please add owners..</Text>}
            {fields.map((field, index) => (
            
            <>
            <InputGroup key={field.id} size="sm">
                <Input {...register(`address.${index}.value`,  { required: true })} mb="5px" bg="white" />
                <InputRightAddon>
                  <Text onClick={() => remove(index)} _hover={{ cursor: 'pointer' }}>
                    Remove
                  </Text>
                </InputRightAddon>
              </InputGroup>


              <Flex justifyContent="space-between" alignItems="center">
            <Text>Address  </Text>
            <Button bg="blue.200" _hover={{ bg: 'blue.300' }} textColor="white" onClick={() =>{ 
               append({value:'append'});
           }}>
              Add
            </Button>
          </Flex>
          
              </>
            ))
            
            
            
            }
            <Flex flexDirection="column" mt="20px">
              <FormControl>
                <FormLabel htmlFor="amount" fontWeight="normal">
                  Treshold
                </FormLabel>
                <NumberInput max={fields.length} min={1} w="90px">
                  <NumberInputField
                    id="treshold"
                    key="treshold"
                    {...register(`treshold`, { required: true })}
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
  )
}

Create.getLayout = getLayout('Create Safe')
export default Create
