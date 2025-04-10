import { Act } from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/act_pb';
import { useMemo } from 'react';
import { sortRatedActs, sortUnratedActs } from '../utils/act';
import { ratingSum } from '../utils/rating';

type SplitActs = { ratedActs: Act[]; unratedActs: Act[] };

export const useSplitRatedActs = (acts?: Act[]): SplitActs =>
  useMemo(() => {
    if (!acts) {
      return { ratedActs: [], unratedActs: [] };
    }

    const splitActs = acts.reduce(
      (acc: SplitActs, act: Act) => {
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

const isRatedAct = (act: Act): boolean => ratingSum(act.ratings) !== 0;
