'use server';

import { GlobalStatsResponse, ListUserStatsResponse } from '@/protos/stat';
import { callApi, httpClient } from '.';

export const listUserStats = async (): Promise<ListUserStatsResponse> =>
  await callApi(() => httpClient.get<ListUserStatsResponse>('/stats/users'));

export const getGlobalStats = async (): Promise<GlobalStatsResponse> =>
  await callApi(() => httpClient.get<GlobalStatsResponse>('/stats/global'));
