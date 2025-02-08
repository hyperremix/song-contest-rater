import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { GlobalStatsResponse, UserStatsResponse } from '../protos/stat';
import { httpClient, THttpError } from '../utils/http';
import { storage } from '../utils/storage';
import { callApi } from './common';

type StatsState = {
  appUserStats: UserStatsResponse | null;
  isFetchAppUserStatsLoading: boolean;
  fetchAppUserStatsError: THttpError | null;
  fetchAppUserStats: () => Promise<void>;
  confirmFetchAppUserStatsError: () => void;
  globalStats: GlobalStatsResponse | null;
  isFetchGlobalStatsLoading: boolean;
  fetchGlobalStatsError: THttpError | null;
  fetchGlobalStats: () => Promise<void>;
  confirmFetchGlobalStatsError: () => void;
};

export const useStatsStore = create<StatsState>()(
  devtools(
    persist(
      (set, get) => ({
        appUserStats: null,
        isFetchAppUserStatsLoading: false,
        fetchAppUserStatsError: null,
        fetchAppUserStats: async () =>
          callApi({
            onPreCall: () => set({ isFetchAppUserStatsLoading: true }),
            call: () => httpClient.get<UserStatsResponse>(`/stats/users/me`),
            onSuccess: ({ data }) => set({ appUserStats: data }),
            onError: (error) => set({ fetchAppUserStatsError: error }),
            onFinally: () => set({ isFetchAppUserStatsLoading: false }),
          }),
        confirmFetchAppUserStatsError: () =>
          set({ fetchAppUserStatsError: null }),
        globalStats: null,
        isFetchGlobalStatsLoading: false,
        fetchGlobalStatsError: null,
        fetchGlobalStats: async () =>
          callApi({
            onPreCall: () => set({ isFetchGlobalStatsLoading: true }),
            call: () => httpClient.get<GlobalStatsResponse>(`/stats/global`),
            onSuccess: ({ data }) => set({ globalStats: data }),
            onError: (error) => set({ fetchGlobalStatsError: error }),
            onFinally: () => set({ isFetchGlobalStatsLoading: false }),
          }),
        confirmFetchGlobalStatsError: () =>
          set({ fetchGlobalStatsError: null }),
      }),
      {
        name: 'stats-store',
        storage: createJSONStorage(() => storage),
      },
    ),
  ),
);
