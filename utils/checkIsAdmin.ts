import { auth } from '@clerk/nextjs/server';

export const checkIsAdmin = async () => {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata.role === 'admin';
};
