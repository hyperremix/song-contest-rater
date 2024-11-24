import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { ActResponse } from '../protos/act';
import { RatingResponse } from '../protos/rating';
import { THttpError, httpClient } from '../utils/http';
import { storage } from '../utils/storage';
import { callApi } from './common';

type ActState = {
  selectedAct: ActResponse | null;
  selectedActRatings: RatingResponse[];
  isLoading: boolean;
  getActError: THttpError | null;
  setSelectedAct: (act: ActResponse) => void;
  fetchSelectedAct: (
    competitionId: string | undefined,
    id: string,
  ) => Promise<void>;
  fetchSelectedActRatings: (id: string) => Promise<void>;
};

export const useActStore = create<ActState>()(
  devtools(
    persist(
      (set) => ({
        selectedAct: null,
        selectedActRatings: [],
        isLoading: false,
        getActError: null,
        isCreateRatingLoading: false,
        createRatingError: null,
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
        fetchSelectedActRatings: (id: string) =>
          callApi({
            onPreCall: () => set({ isLoading: true }),
            call: () => httpClient.get<RatingResponse[]>(`/acts/${id}/ratings`),
            onSuccess: ({ data }) =>
              set({
                selectedActRatings: data,
                getActError: null,
              }),
            onError: (error) =>
              set({ selectedActRatings: [], getActError: error }),
            onFinally: () => set({ isLoading: false }),
          }),
      }),
      {
        name: 'act-store',
        storage: createJSONStorage(() => storage),
      },
    ),
  ),
);
