import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';
import GitHubProvider from 'next-auth/providers/github';
import AppleProvider from 'next-auth/providers/apple';

const getEnvVar = (variable: string | undefined, name: string): string => {
  if (!variable) {
    throw new Error(`Environment variable for ${name} is missing.`);
  }
  return variable;
};

// Define the SignInProviders type
interface SignInProviders {
  name: string;
  credentials: string;
  secret: string;
}

const providers: SignInProviders[] = [
  {
    name: "Google",
    credentials: getEnvVar(process.env.GOOGLE_CLIENT_ID, 'GOOGLE_CLIENT_ID'),
    secret: getEnvVar(process.env.GOOGLE_CLIENT_SECRET, 'GOOGLE_CLIENT_SECRET'),
  },
  {
    name: "Twitter",
    credentials: getEnvVar(process.env.TWITTER, 'TWITTER'),
    secret: getEnvVar(process.env.TWITTER_SECRET, 'TWITTER_SECRET'),
  },
  {
    name: "GitHub",
    credentials: getEnvVar(process.env.GITHUB_ID, 'GITHUB_ID'),
    secret: getEnvVar(process.env.GITHUB_SECRET, 'GITHUB_SECRET'),
  },
  {
    name: "Apple",
    credentials: getEnvVar(process.env.APPLE_ID, 'APPLE_ID'),
    secret: getEnvVar(process.env.APPLE_SECRET, 'APPLE_SECRET'),
  }
];

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: providers.find(p => p.name === 'Google')?.credentials || '',
      clientSecret: providers.find(p => p.name === 'Google')?.secret || '',
    }),
    TwitterProvider({
      clientId: providers.find(p => p.name === 'Twitter')?.credentials || '',
      clientSecret: providers.find(p => p.name === 'Twitter')?.secret || '',
    }),
    GitHubProvider({
      clientId: providers.find(p => p.name === 'GitHub')?.credentials || '',
      clientSecret: providers.find(p => p.name === 'GitHub')?.secret || '',
    }),
    AppleProvider({
      clientId: providers.find(p => p.name === 'Apple')?.credentials || '',
      clientSecret: providers.find(p => p.name === 'Apple')?.secret || '',
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  }
});
