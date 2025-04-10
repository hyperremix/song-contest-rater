import { Rating } from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/rating_pb';

export const ratingSum = (ratings?: Rating[]): number =>
  ratings?.reduce((acc, rating) => acc + rating.total, 0) ?? 0;
