import { RatingResponse } from '../../protos/rating';

export const ratingSum = (ratings?: RatingResponse[]): number =>
  ratings?.reduce((acc, rating) => acc + rating.total, 0) ?? 0;
