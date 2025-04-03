'use server';

import {
  CreateParticipationRequest,
  ListParticipationsResponse,
} from '@hyperremix/song-contest-rater-protos/participation';
import { httpClient } from '.';
import { callApi } from './callApi';

export const listParticipations =
  async (): Promise<ListParticipationsResponse> =>
    await callApi(() =>
      httpClient.get<ListParticipationsResponse>('/participations'),
    );

export const createParticipation = async (
  request: CreateParticipationRequest,
): Promise<void> =>
  await callApi(() => httpClient.post<void>('/participations', request));

export const deleteParticipation = async (
  contestId: string,
  actId: string,
): Promise<void> =>
  await callApi(() =>
    httpClient.delete<void>(
      `/participations?competition_id=${contestId}&act_id=${actId}`,
    ),
  );
