'use client';

import { Link } from '@/i18n/routing';
import { ratingSum } from '@/utils/rating';
import { toImagekitUrl } from '@/utils/toImagekitUrl';
import { ActResponse } from '@hyperremix/song-contest-rater-proto/act';
import Image from 'next/image';
import { Typography } from '../custom/typography';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

type Props = {
  contestId: string;
  act: ActResponse;
};

export const ActCard = ({ contestId, act }: Props) => {
  return (
    <Link
      href={{
        pathname: '/contests/[contestId]/acts/[actId]',
        params: { contestId, actId: act.id },
      }}
    >
      <Card className="relative flex flex-row hover:cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700">
        {act.image_url && (
          <Image
            className="min-h-fit w-32 rounded-l-lg object-contain"
            src={toImagekitUrl(act.image_url, [
              { height: '256', width: '256', focus: 'auto' },
            ])}
            width={128}
            height={128}
            alt=""
            blurDataURL={toImagekitUrl(act.image_url, [
              { height: '1', width: '1', focus: 'auto' },
            ])}
            placeholder="blur"
          />
        )}
        <div className="absolute right-0 top-0 flex w-11 flex-col items-center rounded-bl-md rounded-tr-md bg-primary-500 p-2">
          <Typography variant="h6" className="text-white">
            {ratingSum(act.ratings)}
          </Typography>
        </div>
        <CardHeader>
          <CardTitle>{act.song_name}</CardTitle>
          <CardDescription>
            <Typography>{act.artist_name}</Typography>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};
