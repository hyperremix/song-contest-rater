import { RatingResponse } from '../../protos/rating';

export const ratingSum = (rating: RatingResponse) =>
  rating.song + rating.singing + rating.show + rating.looks + rating.clothes;

export const manyRatingsSum = (ratings?: RatingResponse[]): number =>
  ratings?.reduce((acc, rating) => acc + ratingSum(rating), 0) ?? 0;
