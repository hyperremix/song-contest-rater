'use client';

import { getBrowserTransport } from '@/app/get-browser-transport';
import {
  getGlobalStats,
  listUserStats,
} from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/stat_service-StatService_connectquery';
import { useSuspenseQuery } from '@connectrpc/connect-query';
import { StatsCard } from './stats-card';

export const StatsList = () => {
  const transport = getBrowserTransport();

  const { data: userStats } = useSuspenseQuery(
    listUserStats,
    {},
    { transport },
  );
  const { data: globalStats } = useSuspenseQuery(
    getGlobalStats,
    {},
    { transport },
  );

  return (
    <div className="flex flex-col gap-4">
      {userStats.stats.map((userStat) => (
        <StatsCard
          key={userStat.user?.id}
          userStats={userStat}
          globalStats={globalStats?.stats ?? null}
        />
      ))}
    </div>
  );
};
