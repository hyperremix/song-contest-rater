import { Rating } from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/rating_pb';

export const sortedRatingUpdate = (
  ratings: Rating[],
  rating: Rating,
): Rating[] => sortedRatingAdd(removeRating(ratings, rating.id), rating);

export const sortedRatingAdd = (
  ratings: Rating[] | undefined,
  rating: Rating,
): Rating[] => {
  if (!ratings) {
    return [rating];
  }

  const index = ratings.findIndex((r) => r.total < rating.total);
  if (index === -1) {
    return [...ratings, rating];
  }

  return [...ratings.slice(0, index), rating, ...ratings.slice(index)];
};

export const removeRating = (ratings: Rating[], ratingId: string): Rating[] =>
  ratings.filter((r) => r.id !== ratingId);
