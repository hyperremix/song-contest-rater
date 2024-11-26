import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { UserResponse } from '../protos/user';
import { auth0Client, Permission, TAuthData } from '../utils/auth';
import { THttpError } from '../utils/http';
import { storage } from '../utils/storage';

type UserState = {
  user: UserResponse | null;
  isLoading: boolean;
  getUserError: THttpError | null;
  authData: TAuthData | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
};

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isLoading: false,
        getUserError: null,
        authData: null,
        isAuthenticated: false,
        logout: async () => {
          await auth0Client.logout();
          set({ authData: null, isAuthenticated: false });
        },
        hasPermission: (permission: Permission) =>
          get().authData?.permissions?.includes(permission) ?? false,
      }),
      {
        name: 'user-store',
        storage: createJSONStorage(() => storage),
      },
    ),
  ),
);
