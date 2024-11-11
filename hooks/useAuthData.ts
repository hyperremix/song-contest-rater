import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { isAuthenticatedAtom } from '../store/user';
import { auth0Client, TAuthData } from '../utils/auth';

export const useAuthData = (): {
  authData: TAuthData | null;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
} => {
  const [authData, setAuthData] = useState<TAuthData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);

  useEffect(() => {
    const checkIsAuthenticated = async () => {
      const authData = await auth0Client.getValidAuthData();
      setAuthData(authData);
      setIsAuthenticated(!!authData);
    };
    checkIsAuthenticated();
  }, [isAuthenticated]);

  return { authData, isAuthenticated, setIsAuthenticated };
};
