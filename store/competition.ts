import type {} from '@redux-devtools/extension';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import {
  CompetitionResponse,
  ListCompetitionsResponse,
} from '../protos/competition';
import { httpClient, THttpError } from '../utils/http';
import { storage } from '../utils/storage';
import { callApi } from './common';

type CompetitionState = {
  competitions: CompetitionResponse[];
  selectedCompetition: CompetitionResponse | null;
  isLoading: boolean;
  listCompetitionsError: THttpError | null;
  getCompetitionError: THttpError | null;
  fetchCompetitions: () => Promise<void>;
  fetchSelectedCompetition: (id: string) => Promise<void>;
};

export const useCompetitionStore = create<CompetitionState>()(
  devtools(
    persist(
      (set) => ({
        competitions: [],
        selectedCompetition: null,
        isLoading: false,
        listCompetitionsError: null,
        getCompetitionError: null,
        fetchCompetitions: () =>
          callApi({
            onPreCall: () => set({ isLoading: true }),
            call: () =>
              httpClient.get<ListCompetitionsResponse>('/competitions'),
            onSuccess: ({ data }) =>
              set({
                competitions: data.competitions,
                listCompetitionsError: null,
              }),
            onError: (error) =>
              set({ competitions: [], listCompetitionsError: error }),
            onFinally: () => set({ isLoading: false }),
          }),
        fetchSelectedCompetition: (id: string) =>
          callApi({
            onPreCall: () => set({ isLoading: true }),
            call: () =>
              httpClient.get<CompetitionResponse>(`/competitions/${id}`),
            onSuccess: ({ data }) =>
              set({
                selectedCompetition: data,
                getCompetitionError: null,
              }),
            onError: (error) =>
              set({ selectedCompetition: null, getCompetitionError: error }),
            onFinally: () => set({ isLoading: false }),
          }),
      }),
      {
        name: 'competition-store',
        storage: createJSONStorage(() => storage),
      },
    ),
  ),
);
