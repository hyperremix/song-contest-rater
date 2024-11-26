import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { ActResponse, ListActsResponse } from '../protos/act';
import { THttpError, httpClient } from '../utils/http';
import { storage } from '../utils/storage';
import { callApi } from './common';

type ActState = {
  acts: ActResponse[];
  selectedAct: ActResponse | null;
  isLoading: boolean;
  getActError: THttpError | null;
  setSelectedAct: (act: ActResponse) => void;
  fetchActs: () => Promise<void>;
  fetchSelectedAct: (
    competitionId: string | undefined,
    id: string,
  ) => Promise<void>;
};

export const useActStore = create<ActState>()(
  devtools(
    persist(
      (set) => ({
        acts: [],
        selectedAct: null,
        isLoading: false,
        getActError: null,
        isUpsertActLoading: false,
        upsertActError: null,
        setSelectedAct: (act: ActResponse) => set({ selectedAct: act }),
        fetchSelectedAct: (competitionId: string | undefined, id: string) =>
          callApi({
            onPreCall: () => set({ isLoading: true }),
            call: () =>
              httpClient.get<ActResponse>(
                `/competitions/${competitionId}/acts/${id}`,
              ),
            onSuccess: ({ data }) =>
              set({
                selectedAct: data,
                getActError: null,
              }),
            onError: (error) => set({ selectedAct: null, getActError: error }),
            onFinally: () => set({ isLoading: false }),
          }),
        fetchActs: () =>
          callApi({
            call: () => httpClient.get<ListActsResponse>('/acts'),
            onSuccess: ({ data }) =>
              set({
                acts: data.acts,
              }),
          }),
      }),
      {
        name: 'act-store',
        storage: createJSONStorage(() => storage),
      },
    ),
  ),
);
