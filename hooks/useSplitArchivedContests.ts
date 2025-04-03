import { CompetitionResponse } from '@hyperremix/song-contest-rater-protos/competition';
import { Timestamp } from '@hyperremix/song-contest-rater-protos/google/protobuf/timestamp';
import { addDays, isBefore, setHours, startOfDay } from 'date-fns';
import { useMemo } from 'react';

type SplitContests = {
  contests: CompetitionResponse[];
  archivedContests: CompetitionResponse[];
};

export const useSplitArchivedContests = (
  contests?: CompetitionResponse[],
): SplitContests =>
  useMemo(() => {
    if (!contests) {
      return { contests: [], archivedContests: [] };
    }

    return contests.reduce(
      (acc: SplitContests, contest: CompetitionResponse) => {
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

const isArchivedContest = (contest: CompetitionResponse): boolean =>
  !contest.start_time
    ? false
    : isBefore(get2AMNextDay(contest.start_time), new Date());

const get2AMNextDay = (timestamp?: Timestamp): Date => {
  if (!timestamp) {
    return new Date(0);
  }

  const date = new Date(timestamp.seconds * 1000);
  const nextDay = addDays(date, 1);
  const startOfNextDay = startOfDay(nextDay);
  return setHours(startOfNextDay, 2);
};
