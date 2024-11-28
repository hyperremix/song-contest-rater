import { sortRatedActs, sortUnratedActs } from '.';
import { t, translations } from '../../i18n';
import { ActResponse } from '../../protos/act';
import { ratingSum } from '../rating';

type SplitActs = { ratedActs: ActResponse[]; unratedActs: ActResponse[] };

export const splitRatedActs = (
  acts?: ActResponse[],
): { title: string; data: ActResponse[] }[] => {
  const actSections = [];
  if (!acts) {
    return [];
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

  if (splitActs.unratedActs.length > 0) {
    actSections.push({
      title: t(translations.act.unratedActsTitle),
      data: splitActs.unratedActs,
    });
  }

  if (splitActs.ratedActs.length > 0) {
    actSections.push({
      title: t(translations.act.ratedActsTitle),
      data: splitActs.ratedActs,
    });
  }

  return actSections;
};

const isRatedAct = (act: ActResponse): boolean => ratingSum(act.ratings) !== 0;
