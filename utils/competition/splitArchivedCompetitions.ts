import dayjs from 'dayjs';
import { CompetitionResponse } from '../../protos/competition';
import { CompetitionState } from '../../store';

type SplitCompetitions = Pick<
  CompetitionState,
  'competitions' | 'archivedCompetitions'
>;

export const splitArchivedCompetitions = (
  competitions?: CompetitionResponse[],
): SplitCompetitions =>
  competitions
    ? competitions.reduce(
        (acc: SplitCompetitions, competition: CompetitionResponse) => {
          if (isArchivedCompetition(competition)) {
            acc.archivedCompetitions.unshift(competition);
          } else {
            acc.competitions.push(competition);
          }
          return acc;
        },
        { competitions: [], archivedCompetitions: [] },
      )
    : { competitions: [], archivedCompetitions: [] };

const isArchivedCompetition = (competition: CompetitionResponse): boolean =>
  !competition.start_time
    ? false
    : dayjs
        .unix(competition.start_time.seconds)
        .add(1, 'day')
        .startOf('day')
        .add(2, 'hours')
        .isBefore(dayjs());
