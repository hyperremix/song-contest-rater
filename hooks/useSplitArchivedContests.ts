import { Contest } from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/contest_pb';
import { Timestamp } from '@bufbuild/protobuf/wkt';
import { addDays, isBefore, setHours, startOfDay } from 'date-fns';
import { useMemo } from 'react';

type SplitContests = {
  contests: Contest[];
  archivedContests: Contest[];
};

export const useSplitArchivedContests = (contests?: Contest[]): SplitContests =>
  useMemo(() => {
    if (!contests) {
      return { contests: [], archivedContests: [] };
    }

    return contests.reduce(
      (acc: SplitContests, contest: Contest) => {
        if (isArchivedContest(contest)) {
          acc.archivedContests.unshift(contest);
        } else {
          acc.contests.push(contest);
        }
        return acc;
      },
      { contests: [], archivedContests: [] },
    );
  }, [contests]);

const isArchivedContest = (contest: Contest): boolean =>
  !contest.startTime
    ? false
    : isBefore(get2AMNextDay(contest.startTime), new Date());

const get2AMNextDay = (timestamp?: Timestamp): Date => {
  if (!timestamp) {
    return new Date(0);
  }

  const date = new Date(Number(timestamp.seconds) * 1000);
  const nextDay = addDays(date, 1);
  const startOfNextDay = startOfDay(nextDay);
  return setHours(startOfNextDay, 2);
};
