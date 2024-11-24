import { RatingResponse } from '../../protos/rating';
import { ratingSum } from './ratingSum';

export const sortedRatingUpdate = (
  ratings: RatingResponse[],
  rating: RatingResponse,
): RatingResponse[] =>
  sortedRatingAdd(removeRating(ratings, rating.id), rating);

export const sortedRatingAdd = (
  ratings: RatingResponse[],
  rating: RatingResponse,
): RatingResponse[] => {
  const index = ratings.findIndex((r) => ratingSum(r) < ratingSum(rating));
  if (index === -1) {
    return [...ratings, rating];
  }

  return [...ratings.slice(0, index), rating, ...ratings.slice(index)];
};

export const removeRating = (
  ratings: RatingResponse[],
  ratingId: string,
): RatingResponse[] => ratings.filter((r) => r.id !== ratingId);
