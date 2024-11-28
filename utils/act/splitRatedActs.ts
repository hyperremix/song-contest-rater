import { sortRatedActs, sortUnratedActs } from '.';
import { ActResponse } from '../../protos/act';
import { ratingSum } from '../rating';

type SplitActs = { ratedActs: ActResponse[]; unratedActs: ActResponse[] };

export const splitRatedActs = (acts?: ActResponse[]): SplitActs => {
  if (!acts) {
    return { ratedActs: [], unratedActs: [] };
  }

  const splitActs = acts.reduce(
    (acc: SplitActs, act: ActResponse) => {
      if (isRatedAct(act)) {
        acc.ratedActs.unshift(act);
      } else {
        acc.unratedActs.push(act);
      }
      return acc;
    },
    { ratedActs: [], unratedActs: [] },
  );

  splitActs.ratedActs = sortRatedActs(splitActs.ratedActs);
  splitActs.unratedActs = sortUnratedActs(splitActs.unratedActs);
  return splitActs;
};

const isRatedAct = (act: ActResponse): boolean => ratingSum(act.ratings) !== 0;
