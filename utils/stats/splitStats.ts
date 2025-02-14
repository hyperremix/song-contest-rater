import { UserStatsResponse } from '../../protos/stat';

export const splitStats = (
  stats: UserStatsResponse[] | null,
): { title: string; data: UserStatsResponse[] }[] => [
  {
    title: 'Critic Type',
    data: stats ?? [],
  },
];
