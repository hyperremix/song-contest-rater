import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { UserResponse } from '../protos/user';
import { auth0Client, TAuthData } from '../utils/auth';
import { httpClient, THttpError } from '../utils/http';
import { storage } from '../utils/storage';
import { callApi } from './common';

type UserState = {
  user: UserResponse | null;
  isLoading: boolean;
  getUserError: THttpError | null;
  authData: TAuthData | null;
  isAuthenticated: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoading: false,
        getUserError: null,
        authData: null,
        isAuthenticated: false,
        fetchUser: async () => {
          callApi({
            onPreCall: () => set({ isLoading: true }),
            call: () => httpClient.get<UserResponse>('/users/me'),
            onSuccess: ({ data }) =>
              set({
                user: data,
                getUserError: null,
              }),
            onError: (error) => set({ user: null, getUserError: error }),
            onFinally: () => set({ isLoading: false }),
          });
        },
        logout: async () => {
          await auth0Client.logout();
          set({ authData: null, isAuthenticated: false });
        },
      }),
      {
        name: 'user-store',
        storage: createJSONStorage(() => storage),
      },
    ),
  ),
);
