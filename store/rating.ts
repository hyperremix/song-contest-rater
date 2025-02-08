import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import {
  CreateRatingRequest,
  RatingResponse,
  UpdateRatingRequest,
} from '../protos/rating';
import { THttpError, httpClient } from '../utils/http';
import { sortedRatingAdd, sortedRatingUpdate } from '../utils/rating';
import { storage } from '../utils/storage';
import { callApi } from './common';

type RatingState = {
  ratings: RatingResponse[];
  isFetchRatingsLoading: boolean;
  fetchRatingsError: THttpError | null;
  isUpsertRatingLoading: boolean;
  upsertRatingError: THttpError | null;
  setRatings: (act: RatingResponse[]) => void;
  fetchRatings: (actId: string) => Promise<void>;
  createRating: (request: CreateRatingRequest) => Promise<void>;
  updateRating: (request: UpdateRatingRequest) => Promise<void>;
  confirmFetchRatingsError: () => void;
  confirmUpsertRatingError: () => void;
};

export const useRatingStore = create<RatingState>()(
  devtools(
    persist(
      (set, get) => ({
        ratings: [],
        isFetchRatingsLoading: false,
        fetchRatingsError: null,
        isUpsertRatingLoading: false,
        upsertRatingError: null,
        setRatings: (ratings: RatingResponse[]) => set({ ratings }),
        fetchRatings: (actId: string) =>
          callApi({
            onPreCall: () => set({ isFetchRatingsLoading: true }),
            call: () =>
              httpClient.get<RatingResponse[]>(`/acts/${actId}/ratings`),
            onSuccess: ({ data }) =>
              set({
                ratings: data,
                fetchRatingsError: null,
              }),
            onError: (error) => set({ ratings: [], fetchRatingsError: error }),
            onFinally: () => set({ isFetchRatingsLoading: false }),
          }),
        createRating: (request: CreateRatingRequest) =>
          callApi({
            onPreCall: () => set({ isUpsertRatingLoading: true }),
            call: () => httpClient.post<RatingResponse>('/ratings', request),
            onSuccess: ({ data }) =>
              set({
                ratings: sortedRatingAdd(get().ratings, data),
                upsertRatingError: null,
              }),
            onError: (error) => set({ upsertRatingError: error }),
            onFinally: () => set({ isUpsertRatingLoading: false }),
          }),
        updateRating: (request: UpdateRatingRequest) =>
          callApi({
            onPreCall: () => set({ isUpsertRatingLoading: true }),
            call: () =>
              httpClient.put<RatingResponse>(`/ratings/${request.id}`, request),
            onSuccess: ({ data }) =>
              set({
                ratings: sortedRatingUpdate(get().ratings, data),
                upsertRatingError: null,
              }),
            onError: (error) => set({ upsertRatingError: error }),
            onFinally: () => set({ isUpsertRatingLoading: false }),
          }),
        confirmFetchRatingsError: () => set({ fetchRatingsError: null }),
        confirmUpsertRatingError: () => set({ upsertRatingError: null }),
      }),
      {
        name: 'rating-store',
        storage: createJSONStorage(() => storage),
      },
    ),
  ),
);
