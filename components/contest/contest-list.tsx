'use client';

import { getBrowserTransport } from '@/app/get-browser-transport';
import { useSplitArchivedContests } from '@/hooks/useSplitArchivedContests';
import { translations } from '@/i18n';
import { listContests } from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/contest_service-ContestService_connectquery';
import { useSuspenseQuery } from '@connectrpc/connect-query';
import { useTranslations } from 'next-intl';
import { Typography } from '../custom/typography';
import { ContestCard } from './contest-card';

export const ContestList = () => {
  const t = useTranslations();
  const transport = getBrowserTransport();

  const { data } = useSuspenseQuery(listContests, {}, { transport });

  const { contests, archivedContests } = useSplitArchivedContests(
    data.contests,
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        {contests.length > 0 && (
          <div className="flex flex-col gap-2">
            {contests.map((contest) => (
              <ContestCard key={contest.id} contest={contest} />
            ))}
          </div>
        )}
        {archivedContests.length > 0 && (
          <>
            <Typography variant="h2" className="text-center">
              {t(translations.contest.archivedContestsTitle)}
            </Typography>
            <div className="flex flex-col gap-2">
              {archivedContests.map((contest) => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};
