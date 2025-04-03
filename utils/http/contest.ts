'use server';

import {
  CompetitionResponse,
  CreateCompetitionRequest,
  ListCompetitionsResponse,
  UpdateCompetitionRequest,
} from '@hyperremix/song-contest-rater-protos/competition';
import { callApi, httpClient } from '.';

export const listContests = async (): Promise<ListCompetitionsResponse> =>
  await callApi(() =>
    httpClient.get<ListCompetitionsResponse>('/competitions'),
  );

export const getContest = async (id: string): Promise<CompetitionResponse> =>
  await callApi(() =>
    httpClient.get<CompetitionResponse>(`/competitions/${id}`),
  );

export const createContest = async (
  request: CreateCompetitionRequest,
): Promise<CompetitionResponse> =>
  await callApi(() =>
    httpClient.post<CompetitionResponse>('/competitions', request),
  );

export const updateContest = async (
  request: UpdateCompetitionRequest,
): Promise<CompetitionResponse> =>
  await callApi(() =>
    httpClient.put<CompetitionResponse>(`/competitions/${request.id}`, request),
  );

export const deleteContest = async (id: string): Promise<void> =>
  await callApi(() => httpClient.delete(`/competitions/${id}`));
