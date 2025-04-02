import { ActResponse } from '@hyperremix/song-contest-rater-proto/act';
import { useMemo } from 'react';
import { sortRatedActs, sortUnratedActs } from '../utils/act';
import { ratingSum } from '../utils/rating';

type SplitActs = { ratedActs: ActResponse[]; unratedActs: ActResponse[] };

export const useSplitRatedActs = (acts?: ActResponse[]): SplitActs =>
  useMemo(() => {
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
  }, [acts]);

const isRatedAct = (act: ActResponse): boolean => ratingSum(act.ratings) !== 0;
