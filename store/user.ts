import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import {
  GetPresignedURLResponse,
  UpdateUserRequest,
  UserResponse,
} from '../protos/user';
import { auth0Client, Permission, TAuthData } from '../utils/auth';
import { httpClient, THttpError } from '../utils/http';
import { storage } from '../utils/storage';
import { callApi } from './common';

type UserState = {
  appUser: UserResponse | null;
  authData: TAuthData | null;
  isAuthenticated: boolean;
  isFetchAppUserLoading: boolean;
  fetchAppUserError: THttpError | null;
  selectedUser: UserResponse | null;
  isFetchSelectedUserLoading: boolean;
  fetchSelectedUserError: THttpError | null;
  isUpdateUserLoading: boolean;
  updateUserError: THttpError | null;
  isUploadProfilePictureLoading: boolean;
  uploadProfilePictureError: THttpError | null;
  updateUser: (request: UpdateUserRequest) => Promise<void>;
  fetchAppUser: () => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  fetchSelectedUser: (id: string) => Promise<void>;
  uploadProfilePicture: (
    fileName: string,
    blob: Blob,
    mime: string,
  ) => Promise<void>;
  confirmUpdateUserError: () => void;
  confirmUploadProfilePictureError: () => void;
  confirmFetchSelectedUserError: () => void;
  confirmFetchAppUserError: () => void;
};

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        appUser: null,
        authData: null,
        isAuthenticated: false,
        isFetchAppUserLoading: false,
        fetchAppUserError: null,
        selectedUser: null,
        isFetchSelectedUserLoading: false,
        fetchSelectedUserError: null,
        isUpdateUserLoading: false,
        updateUserError: null,
        isUploadProfilePictureLoading: false,
        uploadProfilePictureError: null,
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
            onPreCall: () => set({ isFetchAppUserLoading: true }),
            call: () => httpClient.get<UserResponse>('/users/me'),
            onSuccess: ({ data }) => set({ appUser: data }),
            onError: (error) => set({ fetchAppUserError: error }),
            onFinally: () => set({ isFetchAppUserLoading: false }),
          }),
        uploadProfilePicture: async (
          fileName: string,
          blob: Blob,
          mime: string,
        ) =>
          callApi({
            onPreCall: () => set({ isUploadProfilePictureLoading: true }),
            call: async () => {
              const response = await httpClient.post<GetPresignedURLResponse>(
                '/users/me/profile-picture-presigned-url',
                { file_name: fileName, content_type: mime },
              );

              await fetch(response.data.presigned_url, {
                method: 'PUT',
                body: blob,
                headers: {
                  'Content-Type': mime,
                },
              });
              return response.data.image_url;
            },
            onSuccess: (image_url) => {
              const appUser = get().appUser;
              const selectedUser = get().selectedUser;

              if (appUser && selectedUser) {
                set({
                  appUser: {
                    ...appUser,
                    image_url,
                  },
                  selectedUser: {
                    ...selectedUser,
                    image_url,
                  },
                });
              }
            },
            onError: (error) => set({ uploadProfilePictureError: error }),
            onFinally: () => set({ isUploadProfilePictureLoading: false }),
          }),
        confirmUpdateUserError: () => set({ updateUserError: null }),
        confirmUploadProfilePictureError: () =>
          set({ uploadProfilePictureError: null }),
        confirmFetchSelectedUserError: () =>
          set({ fetchSelectedUserError: null }),
        confirmFetchAppUserError: () => set({ fetchAppUserError: null }),
      }),
      {
        name: 'user-store',
        storage: createJSONStorage(() => storage),
        partialize: (state) => ({
          appUser: state.appUser,
          authData: state.authData,
          isAuthenticated: state.isAuthenticated,
          selectedUser: state.selectedUser,
        }),
      },
    ),
  ),
);
