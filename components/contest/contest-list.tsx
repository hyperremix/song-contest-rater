'use client';

import { useSplitArchivedContests } from '@/hooks/useSplitArchivedContests';
import { translations } from '@/i18n';
import { listContests } from '@/utils/http/contest';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Typography } from '../custom/typography';
import { ContestCard } from './contest-card';

export const ContestList = () => {
  const t = useTranslations();

  const { data } = useSuspenseQuery({
    queryKey: ['listContests'],
    queryFn: listContests,
  });

  const { contests, archivedContests } = useSplitArchivedContests(
    data?.competitions,
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
