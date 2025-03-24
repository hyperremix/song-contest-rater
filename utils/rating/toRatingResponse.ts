'use client';

import {
  CreateRatingRequest,
  RatingResponse,
  UpdateRatingRequest,
} from '@/protos/rating';

type User = {
  id: string;
  email: string;
  image_url: string;
  firstname: string;
  lastname: string;
};

export const toRatingResponse = (
  request: CreateRatingRequest | UpdateRatingRequest,
  user: User,
): RatingResponse => {
  const nowTimestamp = {
    seconds: new Date().getTime() / 1000,
    nanos: 0,
  };

  return {
    ...request,
    id: 'new-id',
    competition_id: 'competition-id',
    act_id: 'act-id',
    total:
      request.song +
      request.singing +
      request.show +
      request.looks +
      request.clothes,
    user: {
      ...user,
      created_at: nowTimestamp,
      updated_at: nowTimestamp,
    },
    created_at: nowTimestamp,
    updated_at: nowTimestamp,
  };
};
