'use client';

import { Typography } from '@/components/custom/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toImagekitUrl } from '@/utils/toImagekitUrl';
import {
  Angry,
  CircleHelp,
  Frown,
  Laugh,
  MoveRight,
  Scale,
  Smile,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';
import { translations } from '../../i18n/translations';
import { GlobalStatsResponse, UserStatsResponse } from '../../protos/stat';

type Props = {
  userStats: UserStatsResponse;
  globalStats: GlobalStatsResponse | null;
};

type NextIntlT = ReturnType<typeof useTranslations>;

const criticTypeToIconMap: Record<number, (t: NextIntlT) => ReactNode> = {
  0: (t: NextIntlT) => (
    <div className="flex items-center gap-2">
      <div className="rounded-lg bg-zinc-500 p-2">
        <CircleHelp className="text-white" />
      </div>
      <Typography variant="span" className="opacity-70">
        {t(translations.statistics.criticType[0])}
      </Typography>
    </div>
  ),
  1: (t: NextIntlT) => (
    <div className="flex items-center gap-2">
      <div className="rounded-lg bg-red-500 p-2">
        <Angry className="text-white" />
      </div>
      <Typography variant="span" className="opacity-70">
        {t(translations.statistics.criticType[1])}
      </Typography>
    </div>
  ),
  2: (t: NextIntlT) => (
    <div className="flex items-center gap-2">
      <div className="rounded-lg bg-amber-500 p-2">
        <Frown className="text-white" />
      </div>
      <Typography variant="span" className="opacity-70">
        {t(translations.statistics.criticType[2])}
      </Typography>
    </div>
  ),
  3: (t: NextIntlT) => (
    <div className="flex items-center gap-2">
      <div className="rounded-lg bg-zinc-500 p-2">
        <Scale className="text-white" />
      </div>
      <Typography variant="span" className="opacity-70">
        {t(translations.statistics.criticType[3])}
      </Typography>
    </div>
  ),
  4: (t: NextIntlT) => (
    <div className="flex items-center gap-2">
      <div className="rounded-lg bg-green-500 p-2">
        <Smile className="text-white" />
      </div>
      <Typography variant="span" className="opacity-70">
        {t(translations.statistics.criticType[4])}
      </Typography>
    </div>
  ),
  5: (t: NextIntlT) => (
    <div className="flex items-center gap-2">
      <div className="bg-primary rounded-lg p-2">
        <Laugh className="text-white" />
      </div>
      <Typography variant="span" className="opacity-70">
        {t(translations.statistics.criticType[5])}
      </Typography>
    </div>
  ),
};

const criticTypeToTendencyDisplayMap: Record<
  number,
  (ratingBias: number) => ReactNode
> = {
  0: (ratingBias: number) => (
    <div className="flex items-center gap-2">
      <Typography variant="h4" className="font-bold">
        {ratingBias.toFixed(2)}
      </Typography>
      <div className="h-2 w-2 rounded-full bg-zinc-500" />
    </div>
  ),
  1: (ratingBias: number) => (
    <div className="flex items-center gap-2">
      <Typography variant="h4" className="font-bold">
        {ratingBias.toFixed(2)}
      </Typography>
      <TrendingDown className="text-red-500" />
    </div>
  ),
  2: (ratingBias: number) => (
    <div className="flex items-center gap-2">
      <Typography variant="h4" className="font-bold">
        {ratingBias.toFixed(2)}
      </Typography>
      <TrendingDown className="text-amber-500" />
    </div>
  ),
  3: (ratingBias: number) => (
    <div className="flex items-center gap-2">
      <Typography variant="h4" className="font-bold">
        {ratingBias.toFixed(2)}
      </Typography>
      <MoveRight className="text-zinc-500" />
    </div>
  ),
  4: (ratingBias: number) => (
    <div className="flex items-center gap-2">
      <Typography variant="h4" className="font-bold">
        {ratingBias.toFixed(2)}
      </Typography>
      <TrendingUp className="text-green-500" />
    </div>
  ),
  5: (ratingBias: number) => (
    <div className="flex items-center gap-2">
      <Typography variant="h4" className="font-bold">
        {ratingBias.toFixed(2)}
      </Typography>
      <TrendingUp className="text-primary-500" />
    </div>
  ),
};

export const StatsCard = ({ userStats, globalStats }: Props) => {
  const t = useTranslations();

  return (
    <Card className="flex flex-col gap-2">
      <CardHeader className="space-y-2 p-4 pb-0">
        <div className="flex justify-between">
          <div>{criticTypeToIconMap[userStats.critic_type ?? 0](t)}</div>
          <div className="flex items-center gap-2">
            <Typography variant="span">
              {userStats.user?.firstname} {userStats.user?.lastname}
            </Typography>
            <Avatar>
              <AvatarImage
                src={toImagekitUrl(userStats.user?.image_url ?? '', [
                  { height: '128', width: '128', focus: 'auto' },
                ])}
              />
              <AvatarFallback>{`${userStats.user?.firstname?.[0] ?? ''}${userStats.user?.lastname?.[0] ?? ''}`}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div>
          {criticTypeToTendencyDisplayMap[userStats.critic_type ?? 0](
            userStats.rating_bias ?? 0,
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex gap-6">
          <div className="flex flex-col gap-2">
            <Typography variant="span" className="opacity-70">
              {t(translations.statistics.ratingsCountLabel)}
            </Typography>
            <div className="rounded-lg bg-zinc-100 px-3 py-3 dark:bg-zinc-700">
              <Typography variant="h3" className="text-center">
                {userStats.total_ratings}
              </Typography>
            </div>
          </div>
          <div className="flex-1 flex-col gap-2">
            <div className="mb-2">
              <div className="flex items-center justify-between">
                <Typography variant="span" className="opacity-70">
                  {t(translations.statistics.ratingAvgLabel)}
                </Typography>
                <Typography variant="h4">
                  {userStats.user_rating_avg}
                </Typography>
              </div>
              <div className="mt-1 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${(userStats.user_rating_avg / 75) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Typography variant="span" className="opacity-70">
                  {t(translations.statistics.globalRatingAvgLabel)}
                </Typography>
                <Typography variant="h4">
                  {globalStats?.global_rating_avg}
                </Typography>
              </div>
              <div className="mt-1 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div
                  className="h-full rounded-full bg-purple-500"
                  style={{
                    width: `${((globalStats?.global_rating_avg ?? 0) / 75) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
