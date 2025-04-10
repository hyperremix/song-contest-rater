import { Act } from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/act_pb';
import { ratingSum } from '../rating';

export const sortUnratedActs = (acts?: Act[]): Act[] =>
  acts
    ? acts.sort((a, b) => {
        if (a.order === undefined && b.order === undefined) {
          return 1;
        }

        if (a.order === undefined && b.order !== undefined) {
          return 1;
        }

        if (a.order !== undefined && b.order === undefined) {
          return -1;
        }

        return a.order - b.order;
      })
    : [];

export const sortRatedActs = (acts?: Act[]): Act[] =>
  acts
    ? acts.sort((a, b) => {
        if (ratingSum(a.ratings) !== 0 && ratingSum(b.ratings) === 0) {
          return -1;
        }

        if (ratingSum(a.ratings) === 0 && ratingSum(b.ratings) !== 0) {
          return 1;
        }

        return ratingSum(b.ratings) - ratingSum(a.ratings);
      })
    : [];
