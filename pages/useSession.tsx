// useSession.ts
import { useSession as useNextAuthSession } from 'next-auth/react';

export const useSession = () => {
  return useNextAuthSession();
};