'use client';

import { ActResponse } from '@hyperremix/song-contest-rater-protos/act';
import {
  CompetitionResponse,
  CreateCompetitionRequest,
  UpdateCompetitionRequest,
} from '@hyperremix/song-contest-rater-protos/competition';

export const toContestResponse = (
  request: CreateCompetitionRequest | UpdateCompetitionRequest,
  acts: ActResponse[],
): CompetitionResponse => {
  const nowTimestamp = {
    seconds: new Date().getTime() / 1000,
    nanos: 0,
  };

  return {
    ...request,
    id: 'new-id',
    acts,
    created_at: nowTimestamp,
    updated_at: nowTimestamp,
  };
};
