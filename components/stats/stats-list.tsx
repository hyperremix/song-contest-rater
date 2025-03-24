'use client';

import { getGlobalStats, listUserStats } from '@/utils/http/stats';
import { useSuspenseQuery } from '@tanstack/react-query';
import { StatsCard } from './stats-card';

export const StatsList = () => {
  const { data: userStats } = useSuspenseQuery({
    queryKey: ['listUserStats'],
    queryFn: listUserStats,
  });

  const { data: globalStats } = useSuspenseQuery({
    queryKey: ['getGlobalStats'],
    queryFn: getGlobalStats,
  });

  return (
    <div className="flex flex-col gap-4">
      {userStats.stats.map((userStat) => (
        <StatsCard
          key={userStat.user?.id}
          userStats={userStat}
          globalStats={globalStats}
        />
      ))}
    </div>
  );
};
