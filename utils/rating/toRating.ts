'use client';

import {
  CreateRatingRequest,
  Rating,
  RatingSchema,
  UpdateRatingRequest,
} from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/rating_pb';
import { UserSchema } from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/user_pb';
import { create } from '@bufbuild/protobuf';
import { TimestampSchema } from '@bufbuild/protobuf/wkt';

type ClerkUser = {
  id: string;
  email: string;
  image_url: string;
  firstname: string;
  lastname: string;
};

export const toRating = (
  request:
    | Omit<CreateRatingRequest, '$typeName'>
    | Omit<UpdateRatingRequest, '$typeName'>,
  user: ClerkUser,
): Rating => {
  const nowTimestamp = create(TimestampSchema, {
    seconds: BigInt(new Date().getTime() / 1000),
    nanos: 0,
  });

  return create(RatingSchema, {
    ...request,
    id: 'new-id',
    contestId: 'contest-id',
    actId: 'act-id',
    total:
      request.song +
      request.singing +
      request.show +
      request.looks +
      request.clothes,
    user: create(UserSchema, {
      ...user,
      createdAt: nowTimestamp,
      updatedAt: nowTimestamp,
    }),
    createdAt: nowTimestamp,
    updatedAt: nowTimestamp,
  });
};
