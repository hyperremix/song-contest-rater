import { TokenCache } from '@clerk/clerk-expo/dist/cache';
import { storage } from './storage';

const createTokenCache = (): TokenCache => ({
  getToken: (key: string) => storage.getItem(key),
  saveToken: (key: string, token: string) => storage.setItem(key, token),
});

export const tokenCache = createTokenCache();
