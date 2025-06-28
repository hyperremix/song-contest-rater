'use client';

import { getBrowserTransport } from '@/app/get-browser-transport';
import { useSplitRatedActs } from '@/hooks/useSplitRatedActs';
import { translations } from '@/i18n';
import { getContest } from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/contest_service-ContestService_connectquery';
import { useAuth } from '@clerk/nextjs';
import { useSuspenseQuery } from '@connectrpc/connect-query';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { Typography } from '../custom/typography';
import { ActCard } from './act-card';

type Props = {
  contestId: string;
};

export const ActList = ({ contestId }: Props) => {
  const t = useTranslations();
  const { getToken } = useAuth();

  const transport = useMemo(() => getBrowserTransport(getToken), [getToken]);

  const { data } = useSuspenseQuery(
    getContest,
    { id: contestId },
    { transport },
  );

  const { ratedActs, unratedActs } = useSplitRatedActs(
    data?.contest?.acts || [],
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        {unratedActs.length > 0 && (
          <div className="flex flex-col gap-2">
            {unratedActs.map((act) => (
              <ActCard key={act.id} contestId={contestId} act={act} />
            ))}
          </div>
        )}
        {ratedActs.length > 0 && (
          <>
            <Typography variant="h2" className="text-center">
              {t(translations.act.ratedActsTitle)}
            </Typography>
            <div className="flex flex-col gap-2">
              {ratedActs.map((act) => (
                <ActCard key={act.id} contestId={contestId} act={act} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};
