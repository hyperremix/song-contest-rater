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
  isLoading: boolean;
  isFetchSelectedCompetitionLoading: boolean;
  listCompetitionsError: THttpError | null;
  getCompetitionError: THttpError | null;
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
  createParticipation: (act: ActResponse) => Promise<void>;
  deleteParticipation: (actId: string) => Promise<void>;
};

export const useCompetitionStore = create<CompetitionState>()(
  devtools(
    persist(
      (set, get) => ({
        competitions: [],
        archivedCompetitions: [],
        selectedCompetition: null,
        isLoading: false,
        isFetchSelectedCompetitionLoading: false,
        listCompetitionsError: null,
        getCompetitionError: null,
        isUpsertCompetitionLoading: false,
        upsertCompetitionError: null,
        isUpsertActLoading: false,
        upsertActError: null,
        fetchCompetitions: () =>
          callApi({
            onPreCall: () => set({ isLoading: true }),
            call: () =>
              httpClient.get<ListCompetitionsResponse>('/competitions'),
            onSuccess: ({ data }) =>
              set({
                ...splitArchivedCompetitions(data.competitions),
                listCompetitionsError: null,
              }),
            onError: (error) =>
              set({
                competitions: [],
                archivedCompetitions: [],
                listCompetitionsError: error,
              }),
            onFinally: () => set({ isLoading: false }),
          }),
        fetchSelectedCompetition: (id: string) =>
          callApi({
            onPreCall: () => set({ isFetchSelectedCompetitionLoading: true }),
            call: () =>
              httpClient.get<CompetitionResponse>(`/competitions/${id}`),
            onSuccess: ({ data }) =>
              set({
                selectedCompetition: data,
                getCompetitionError: null,
              }),
            onError: (error) =>
              set({ selectedCompetition: null, getCompetitionError: error }),
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
                upsertCompetitionError: null,
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
                upsertCompetitionError: null,
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
                upsertCompetitionError: null,
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
                isUpsertActLoading: false,
                upsertActError: null,
              }));
              httpClient.post('/participations', {
                competition_id: get().selectedCompetition!.id,
                act_id: data.id,
              });
            },
            onError: (error) =>
              set({ isUpsertActLoading: false, upsertActError: error }),
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
                isUpsertActLoading: false,
                upsertActError: null,
              })),
            onError: (error) =>
              set({ isUpsertActLoading: false, upsertActError: error }),
          }),
        createParticipation: (act: ActResponse) =>
          callApi({
            call: () =>
              httpClient.post(`/participations`, {
                competition_id: get().selectedCompetition!.id,
                act_id: act.id,
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
      }),
      {
        name: 'competition-store',
        storage: createJSONStorage(() => storage),
      },
    ),
  ),
);
