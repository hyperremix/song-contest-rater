import { RatingResponse } from '@hyperremix/song-contest-rater-proto/rating';

export const ratingSum = (ratings?: RatingResponse[]): number =>
  ratings?.reduce((acc, rating) => acc + rating.total, 0) ?? 0;
