import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { useSession, signIn, signOut } from 'next-auth/react';
import { Text, Heading } from "@chakra-ui/react";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define props type
type AppSignUpProp = {
  username: string;
  email: string;
  signupmessage: string;
};

const AppSignup: React.FC<AppSignUpProp> = ({ username, email, signupmessage }) => {
  const { data: session } = useSession();

  // Ensure component only renders on the client side
  if (typeof window === "undefined") return null;

  // Check for session
  if (!session) {
    return <Heading>Please sign in to view this page.</Heading>;
  }

  return (
    <>
      <Heading>Welcome To The New Signup</Heading>
      <Text fontSize='6xl'>{username}</Text>
      <Text fontSize='5xl'>{email}</Text>
      <Text fontSize='4xl'>{signupmessage}</Text>
    </>
  );
};

export default AppSignup;
