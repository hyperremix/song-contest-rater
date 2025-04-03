'use server';

import {
  ActResponse,
  CreateActRequest,
  ListActsResponse,
  UpdateActRequest,
} from '@hyperremix/song-contest-rater-protos/act';
import { callApi, httpClient } from '.';

export const listActs = async (): Promise<ListActsResponse> =>
  await callApi(() => httpClient.get<ListActsResponse>('/acts'));

export const getAct = async (id: string): Promise<ActResponse> =>
  await callApi(() => httpClient.get<ActResponse>(`/acts/${id}`));

export const createAct = async (
  request: CreateActRequest,
): Promise<ActResponse> =>
  await callApi(() => httpClient.post<ActResponse>('/acts', request));

export const updateAct = async (
  request: UpdateActRequest,
): Promise<ActResponse> =>
  await callApi(() =>
    httpClient.put<ActResponse>(`/acts/${request.id}`, request),
  );

export const deleteAct = async (id: string): Promise<void> =>
  await callApi(() => httpClient.delete(`/acts/${id}`));
