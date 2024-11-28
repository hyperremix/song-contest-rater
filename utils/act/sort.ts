import { ActResponse } from '../../protos/act';
import { ratingSum } from '../rating';

export const sortUnratedActs = (acts?: ActResponse[]): ActResponse[] =>
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

export const sortRatedActs = (acts?: ActResponse[]): ActResponse[] =>
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
