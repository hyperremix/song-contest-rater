'use client';

import {
  CreateParticipationRequest,
  Participation,
  ParticipationSchema,
} from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/participation_pb';
import { create } from '@bufbuild/protobuf';

export const toParticipation = (
  request: Omit<CreateParticipationRequest, '$typeName'>,
): Participation =>
  create(ParticipationSchema, {
    ...request,
  });
