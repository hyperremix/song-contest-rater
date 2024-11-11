import { ReplaySubject } from 'rxjs';
import { TAuthData } from '.';
import { storage } from '../storage';

const authDataStorageKey = 'song-contest-rater-auth-data';

export const tokensSubject = new ReplaySubject<TAuthData | null>(1);

export const authStorage = {
  storeAuthData: async (authData: TAuthData): Promise<void> => {
    await storage.storeObject(authDataStorageKey, authData);
    tokensSubject.next(authData);
  },
  getAuthData: async (): Promise<TAuthData | null> =>
    await storage.getObject(authDataStorageKey),
  deleteAuthData: async (): Promise<void> => {
    await storage.deleteKey(authDataStorageKey);
    tokensSubject.next(null);
  },
};

authStorage.getAuthData().then((authData) => {
  if (!!authData) {
    tokensSubject.next(authData);
  }
});
