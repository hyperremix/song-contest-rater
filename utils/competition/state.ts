import { CompetitionResponse } from '../../protos/competition';

export const sortedCompetitionUpdate = (
  competitions: CompetitionResponse[],
  competition: CompetitionResponse,
): CompetitionResponse[] =>
  sortedCompetitionAdd(
    removeCompetition(competitions, competition.id),
    competition,
  );

export const sortedCompetitionAdd = (
  competitions: CompetitionResponse[],
  competition: CompetitionResponse,
): CompetitionResponse[] => {
  const index = competitions.findIndex((c) => {
    if (!c.start_time || !competition.start_time) {
      return false;
    }
    return c.start_time?.seconds > competition.start_time?.seconds;
  });

  if (index === -1) {
    return [...competitions, competition];
  }

  return [
    ...competitions.slice(0, index),
    competition,
    ...competitions.slice(index),
  ];
};

export const removeCompetition = (
  competitions: CompetitionResponse[],
  competitionId: string,
): CompetitionResponse[] => competitions.filter((c) => c.id !== competitionId);
