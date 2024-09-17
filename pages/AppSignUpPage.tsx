// pages/signup.tsx
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import {
  Button,
  Input,
  Stack,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth,db } from 'firebaseConfig';


interface SignUpFormValues {
  username: string;
  email: string;
  password: string;
}

const AppSignUpPage: React.FC = () => {
  const { handleSubmit, register, formState: { errors } } = useForm<SignUpFormValues>();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username: data.username,
        email: data.email,
      });

      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Redirect to a new page after successful sign-up
      router.push('/welcome');
    } catch (error: any) {
      toast({
        title: 'An error occurred.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <Heading mb={6}>Sign Up</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl isInvalid={!!errors.username}>
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="Enter your username"
              {...register('username', { required: 'Username is required' })}
            />
            <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register('email', { required: 'Email is required' })}
            />
            <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register('password', { required: 'Password is required' })}
            />
            <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
          </FormControl>
          <Button type="submit" colorScheme="blue" isLoading={loading}>Sign Up</Button>
        </Stack>
      </form>
      <Button mt={4} colorScheme="teal" onClick={() => router.push('/signup')}>
        Sign Up With Api
      </Button>
      <Button mt={4} colorScheme="teal" onClick={() => router.push('/signin')}>
        Already have an account? Sign In
      </Button>
    </Box>
  );
};

export default AppSignUpPage;