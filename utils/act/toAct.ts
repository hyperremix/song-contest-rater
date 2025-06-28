import {
  ActSchema,
  CreateActRequest,
  UpdateActRequest,
} from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/act_pb';
import { create } from '@bufbuild/protobuf';

export const toAct = (
  request:
    | Omit<CreateActRequest, '$typeName'>
    | Omit<UpdateActRequest, '$typeName'>,
) =>
  create(ActSchema, {
    ...request,
    id: 'new-id',
  });
