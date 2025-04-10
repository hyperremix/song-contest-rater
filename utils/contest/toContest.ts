'use client';

import { Act } from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/act_pb';
import {
  Contest,
  ContestSchema,
  CreateContestRequest,
  UpdateContestRequest,
} from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/contest_pb';
import { create } from '@bufbuild/protobuf';
import { TimestampSchema } from '@bufbuild/protobuf/wkt';

export const toContest = (
  request:
    | Omit<CreateContestRequest, '$typeName'>
    | Omit<UpdateContestRequest, '$typeName'>,
  acts: Act[],
): Contest => {
  const nowTimestamp = create(TimestampSchema, {
    seconds: BigInt(new Date().getTime() / 1000),
    nanos: 0,
  });

  return create(ContestSchema, {
    ...request,
    id: 'new-id',
    acts,
    createdAt: nowTimestamp,
    updatedAt: nowTimestamp,
  });
};
