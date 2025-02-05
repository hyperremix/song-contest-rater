import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { UpdateUserRequest, UserResponse } from '../protos/user';
import { auth0Client, Permission, TAuthData } from '../utils/auth';
import { httpClient, THttpError } from '../utils/http';
import { storage } from '../utils/storage';
import { callApi } from './common';

type UserState = {
  appUser: UserResponse | null;
  isLoading: boolean;
  getUserError: THttpError | null;
  authData: TAuthData | null;
  isAuthenticated: boolean;
  selectedUser: UserResponse | null;
  isFetchSelectedUserLoading: boolean;
  fetchSelectedUserError: THttpError | null;
  isUpdateUserLoading: boolean;
  updateUserError: THttpError | null;
  updateUser: (request: UpdateUserRequest) => Promise<void>;
  fetchAppUser: () => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  fetchSelectedUser: (id: string) => Promise<void>;
};

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        appUser: null,
        isLoading: false,
        getUserError: null,
        authData: null,
        isAuthenticated: false,
        selectedUser: null,
        isFetchSelectedUserLoading: false,
        fetchSelectedUserError: null,
        isUpdateUserLoading: false,
        updateUserError: null,
        logout: async () => {
          await auth0Client.logout();
          set({ authData: null, isAuthenticated: false });
        },
        hasPermission: (permission: Permission) =>
          get().authData?.permissions?.includes(permission) ?? false,
        fetchSelectedUser: async (id: string) =>
          callApi({
            onPreCall: () => set({ isFetchSelectedUserLoading: true }),
            call: () => httpClient.get<UserResponse>(`users/${id}`),
            onSuccess: ({ data }) => set({ selectedUser: data }),
            onError: (error) => set({ fetchSelectedUserError: error }),
            onFinally: () => set({ isFetchSelectedUserLoading: false }),
          }),
        updateUser: async (request: UpdateUserRequest) =>
          callApi({
            onPreCall: () => set({ isUpdateUserLoading: true }),
            call: () =>
              httpClient.put<UserResponse>(`users/${request.id}`, request),
            onSuccess: ({ data }) => set({ selectedUser: data, appUser: data }),
            onError: (error) => set({ updateUserError: error }),
            onFinally: () => set({ isUpdateUserLoading: false }),
          }),
        fetchAppUser: async () =>
          callApi({
            call: () => httpClient.get<UserResponse>('/users/me'),
            onSuccess: ({ data }) => set({ appUser: data }),
          }),
      }),
      {
        name: 'user-store',
        storage: createJSONStorage(() => storage),
      },
    ),
  ),
);
