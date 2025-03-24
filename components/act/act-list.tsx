'use client';

import { useSplitRatedActs } from '@/hooks/useSplitRatedActs';
import { translations } from '@/i18n';
import { getContest } from '@/utils/http/contest';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Typography } from '../custom/typography';
import { ActCard } from './act-card';

type Props = {
  contestId: string;
};

export const ActList = ({ contestId }: Props) => {
  const t = useTranslations();

  const { data } = useSuspenseQuery({
    queryKey: ['getContest', contestId],
    queryFn: () => getContest(contestId),
  });

  const { ratedActs, unratedActs } = useSplitRatedActs(data?.acts);

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
