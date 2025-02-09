import type {} from '@redux-devtools/extension';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { ActResponse, CreateActRequest, UpdateActRequest } from '../protos/act';
import {
  CompetitionResponse,
  CreateCompetitionRequest,
  ListCompetitionsResponse,
  UpdateCompetitionRequest,
} from '../protos/competition';
import {
  removeCompetition,
  sortedCompetitionAdd,
  sortedCompetitionUpdate,
  splitArchivedCompetitions,
} from '../utils/competition';
import { httpClient, THttpError } from '../utils/http';
import { storage } from '../utils/storage';
import { callApi } from './common';

export type CompetitionState = {
  competitions: CompetitionResponse[];
  archivedCompetitions: CompetitionResponse[];
  selectedCompetition: CompetitionResponse | null;
  isFetchCompetitionsLoading: boolean;
  isFetchSelectedCompetitionLoading: boolean;
  fetchCompetitionsError: THttpError | null;
  fetchCompetitionError: THttpError | null;
  isUpsertCompetitionLoading: boolean;
  upsertCompetitionError: THttpError | null;
  isUpsertActLoading: boolean;
  upsertActError: THttpError | null;
  fetchCompetitions: () => Promise<void>;
  fetchSelectedCompetition: (id: string) => Promise<void>;
  createCompetition: (request: CreateCompetitionRequest) => Promise<void>;
  updateCompetition: (request: UpdateCompetitionRequest) => Promise<void>;
  deleteCompetition: (id: string) => Promise<void>;
  createAct: (request: CreateActRequest) => Promise<void>;
  updateAct: (request: UpdateActRequest) => Promise<void>;
  createParticipation: (act: ActResponse, order: number) => Promise<void>;
  deleteParticipation: (actId: string) => Promise<void>;
  confirmFetchCompetitionsError: () => void;
  confirmFetchCompetitionError: () => void;
  confirmUpsertCompetitionError: () => void;
  confirmUpsertActError: () => void;
};

export const useCompetitionStore = create<CompetitionState>()(
  devtools(
    persist(
      (set, get) => ({
        competitions: [],
        archivedCompetitions: [],
        selectedCompetition: null,
        isFetchCompetitionsLoading: false,
        isFetchSelectedCompetitionLoading: false,
        fetchCompetitionsError: null,
        fetchCompetitionError: null,
        isUpsertCompetitionLoading: false,
        upsertCompetitionError: null,
        isUpsertActLoading: false,
        upsertActError: null,
        fetchCompetitions: () =>
          callApi({
            onPreCall: () => set({ isFetchCompetitionsLoading: true }),
            call: () =>
              httpClient.get<ListCompetitionsResponse>('/competitions'),
            onSuccess: ({ data }) =>
              set({
                ...splitArchivedCompetitions(data.competitions ?? []),
              }),
            onError: (error) =>
              set({
                competitions: [],
                archivedCompetitions: [],
                fetchCompetitionsError: error,
              }),
            onFinally: () => set({ isFetchCompetitionsLoading: false }),
          }),
        fetchSelectedCompetition: (id: string) =>
          callApi({
            onPreCall: () => set({ isFetchSelectedCompetitionLoading: true }),
            call: () =>
              httpClient.get<CompetitionResponse>(`/competitions/${id}`),
            onSuccess: ({ data }) =>
              set({
                selectedCompetition: data,
              }),
            onError: (error) =>
              set({ selectedCompetition: null, fetchCompetitionError: error }),
            onFinally: () => set({ isFetchSelectedCompetitionLoading: false }),
          }),
        createCompetition: (request: CreateCompetitionRequest) =>
          callApi({
            onPreCall: () => set({ isUpsertCompetitionLoading: true }),
            call: () =>
              httpClient.post<CompetitionResponse>('/competitions', request),
            onSuccess: ({ data }) =>
              set({
                competitions: sortedCompetitionAdd(get().competitions, data),
              }),
            onError: (error) => set({ upsertCompetitionError: error }),
            onFinally: () => set({ isUpsertCompetitionLoading: false }),
          }),
        updateCompetition: (request: UpdateCompetitionRequest) =>
          callApi({
            onPreCall: () => set({ isUpsertCompetitionLoading: true }),
            call: () =>
              httpClient.put<CompetitionResponse>(
                `/competitions/${request.id}`,
                request,
              ),
            onSuccess: ({ data }) =>
              set({
                competitions: sortedCompetitionUpdate(get().competitions, data),
              }),
            onError: (error) => set({ upsertCompetitionError: error }),
            onFinally: () => set({ isUpsertCompetitionLoading: false }),
          }),
        deleteCompetition: (id: string) =>
          callApi({
            onPreCall: () => set({ isUpsertCompetitionLoading: true }),
            call: () =>
              httpClient.delete<CompetitionResponse>(`/competitions/${id}`),
            onSuccess: () =>
              set({
                competitions: removeCompetition(get().competitions, id),
              }),
            onError: (error) => set({ upsertCompetitionError: error }),
            onFinally: () => set({ isUpsertCompetitionLoading: false }),
          }),
        createAct: async (request: CreateActRequest) =>
          callApi({
            onPreCall: () => set({ isUpsertActLoading: true }),
            call: () => httpClient.post<ActResponse>('/acts', request),
            onSuccess: ({ data }) => {
              set(() => ({
                selectedCompetition: {
                  ...get().selectedCompetition!,
                  acts: [...(get().selectedCompetition?.acts ?? []), data],
                },
              }));
              httpClient.post('/participations', {
                competition_id: get().selectedCompetition!.id,
                act_id: data.id,
              });
            },
            onError: (error) => set({ upsertActError: error }),
            onFinally: () => set({ isUpsertActLoading: false }),
          }),
        updateAct: (request: UpdateActRequest) =>
          callApi({
            onPreCall: () => set({ isUpsertActLoading: true }),
            call: () =>
              httpClient.put<ActResponse>(`/acts/${request.id}`, request),
            onSuccess: ({ data }) =>
              set(() => ({
                selectedCompetition: {
                  ...get().selectedCompetition!,
                  acts: get().selectedCompetition!.acts.map((act) =>
                    act.id === data.id ? data : act,
                  ),
                },
              })),
            onError: (error) => set({ upsertActError: error }),
            onFinally: () => set({ isUpsertActLoading: false }),
          }),
        createParticipation: (act: ActResponse, order: number) =>
          callApi({
            call: () =>
              httpClient.post(`/participations`, {
                competition_id: get().selectedCompetition!.id,
                act_id: act.id,
                order,
              }),
            onSuccess: () =>
              set(() => ({
                selectedCompetition: {
                  ...get().selectedCompetition!,
                  acts: [...(get().selectedCompetition?.acts ?? []), act],
                },
              })),
          }),
        deleteParticipation: (actId: string) =>
          callApi({
            call: () =>
              httpClient.delete(
                `/participations?competition_id=${get().selectedCompetition!.id}&act_id=${actId}`,
              ),
            onSuccess: () =>
              set(() => ({
                selectedCompetition: {
                  ...get().selectedCompetition!,
                  acts: get().selectedCompetition!.acts.filter(
                    (act) => act.id !== actId,
                  ),
                },
              })),
          }),
        confirmFetchCompetitionsError: () =>
          set({ fetchCompetitionsError: null }),
        confirmFetchCompetitionError: () =>
          set({ fetchCompetitionError: null }),
        confirmUpsertCompetitionError: () =>
          set({ upsertCompetitionError: null }),
        confirmUpsertActError: () => set({ upsertActError: null }),
      }),
      {
        name: 'competition-store',
        storage: createJSONStorage(() => storage),
        partialize: (state) => ({
          competitions: state.competitions,
          archivedCompetitions: state.archivedCompetitions,
          selectedCompetition: state.selectedCompetition,
        }),
      },
    ),
  ),
);
