'use client';

import { translations } from '@/i18n';
import { Link } from '@/i18n/routing';
import { toImagekitUrl } from '@/utils/toImagekitUrl';
import { Contest } from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/contest_pb';
import { endOfDay, isBefore, isFuture, isPast } from 'date-fns';
import { ClockAlert } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useMemo } from 'react';
import { Typography } from '../custom/typography';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

type Props = {
  contest: Contest;
};

export const ContestCard = ({ contest }: Props) => {
  const t = useTranslations();
  const formatter = useFormatter();

  const isCompetitionInFuture = useMemo(
    () => isFuture(Number(contest.startTime?.seconds ?? 0)),
    [contest],
  );

  const isCompetitionLive = useMemo(
    () =>
      contest.startTime?.seconds &&
      isPast(Number(contest.startTime.seconds)) &&
      isBefore(new Date(), endOfDay(Number(contest.startTime.seconds))),
    [contest],
  );

  return (
    <Link
      href={{
        pathname: '/contests/[contestId]',
        params: { contestId: contest.id },
      }}
    >
      <Card className="relative flex flex-row hover:cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700">
        {isCompetitionInFuture && (
          <div className="absolute z-10 flex h-full w-full items-center justify-center rounded-md bg-black/50">
            <div className="flex flex-row items-center gap-1">
              <ClockAlert size={16} className="text-white" />
              <Typography className="text-white">
                {t(translations.contest.contestNotYetStartedText)}
              </Typography>
            </div>
          </div>
        )}
        {isCompetitionLive && (
          <div className="absolute right-3 top-2 flex flex-row items-center gap-3">
            <div className="relative flex h-3 w-3">
              <div className="absolute inline-flex h-full w-full animate-ping rounded-md bg-red-500 opacity-75"></div>
              <div className="relative inline-flex h-3 w-3 rounded-md bg-red-500"></div>
            </div>
            <Typography className="text-red-500 dark:text-red-500">
              {t(translations.contest.contestLiveText)}
            </Typography>
          </div>
        )}
        {contest.imageUrl && (
          <Image
            className="min-h-fit w-32 rounded-l-lg object-contain"
            src={toImagekitUrl(contest.imageUrl, [
              { height: '256', width: '256', focus: 'auto' },
            ])}
            width={128}
            height={128}
            alt=""
            blurDataURL={toImagekitUrl(contest.imageUrl, [
              { height: '1', width: '1', focus: 'auto' },
            ])}
            placeholder="blur"
          />
        )}
        <CardHeader>
          <CardTitle>{t(`contest.heat.${contest.heat}`)}</CardTitle>
          <CardDescription>
            <Typography>
              {contest.city}, {t(`countries.${contest.country.toLowerCase()}`)}
            </Typography>
            <Typography>
              {formatter.dateTime(
                Number(contest.startTime?.seconds ?? 0) * 1000,
                {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  weekday: 'short',
                },
              )}
            </Typography>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};
