import { RatingResponse } from '../../protos/rating';

export const sortedRatingUpdate = (
  ratings: RatingResponse[],
  rating: RatingResponse,
): RatingResponse[] =>
  sortedRatingAdd(removeRating(ratings, rating.id), rating);

export const sortedRatingAdd = (
  ratings: RatingResponse[] | undefined,
  rating: RatingResponse,
): RatingResponse[] => {
  if (!ratings) {
    return [rating];
  }

  const index = ratings.findIndex((r) => r.total < rating.total);
  if (index === -1) {
    return [...ratings, rating];
  }

  return [...ratings.slice(0, index), rating, ...ratings.slice(index)];
};

export const removeRating = (
  ratings: RatingResponse[],
  ratingId: string,
): RatingResponse[] => ratings.filter((r) => r.id !== ratingId);
