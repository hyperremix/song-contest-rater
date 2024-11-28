import { ActResponse } from '../../protos/act';
import { manyRatingsSum } from '../rating';

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
        if (
          manyRatingsSum(a.ratings) !== 0 &&
          manyRatingsSum(b.ratings) === 0
        ) {
          return -1;
        }

        if (
          manyRatingsSum(a.ratings) === 0 &&
          manyRatingsSum(b.ratings) !== 0
        ) {
          return 1;
        }

        return manyRatingsSum(b.ratings) - manyRatingsSum(a.ratings);
      })
    : [];
