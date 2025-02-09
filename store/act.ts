import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { ActResponse, ListActsResponse } from '../protos/act';
import { httpClient, THttpError } from '../utils/http';
import { storage } from '../utils/storage';
import { callApi } from './common';

type ActState = {
  acts: ActResponse[];
  selectedAct: ActResponse | null;
  isFetchActsLoading: boolean;
  fetchActsError: THttpError | null;
  setSelectedAct: (act: ActResponse) => void;
  fetchActs: () => Promise<void>;
  confirmFetchActsError: () => void;
};

export const useActStore = create<ActState>()(
  devtools(
    persist(
      (set) => ({
        acts: [],
        selectedAct: null,
        isFetchActsLoading: false,
        fetchActsError: null,
        setSelectedAct: (act: ActResponse) => set({ selectedAct: act }),
        fetchActs: () =>
          callApi({
            onPreCall: () => set({ isFetchActsLoading: true }),
            call: () => httpClient.get<ListActsResponse>('/acts'),
            onSuccess: ({ data }) =>
              set({
                acts: data.acts ?? [],
              }),
            onError: (error) => set({ fetchActsError: error }),
            onFinally: () => set({ isFetchActsLoading: false }),
          }),
        confirmFetchActsError: () => set({ fetchActsError: null }),
      }),
      {
        name: 'act-store',
        storage: createJSONStorage(() => storage),
        partialize: (state) => ({
          acts: state.acts,
          selectedAct: state.selectedAct,
        }),
      },
    ),
  ),
);
