'use client';

import { getBrowserTransport } from '@/app/get-browser-transport';
import { toImagekitUrl } from '@/utils/toImagekitUrl';
import { getContest } from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/contest_service-ContestService_connectquery';
import { useAuth } from '@clerk/nextjs';
import { useSuspenseQuery } from '@connectrpc/connect-query';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { ImageViewer } from '../custom/image-viewer';
import { Typography } from '../custom/typography';

type Props = {
  id: string;
};

export const ContestHeader = ({ id }: Props) => {
  const t = useTranslations();
  const { getToken } = useAuth();

  const transport = useMemo(() => getBrowserTransport(getToken), [getToken]);

  const { data } = useSuspenseQuery(getContest, { id }, { transport });

  return (
    <div className="flex flex-col items-center">
      {data?.contest?.imageUrl && (
        <ImageViewer
          baseUri={toImagekitUrl(data.contest.imageUrl, [
            { height: '256', width: '256', focus: 'auto' },
          ])}
          zoomableImageUri={toImagekitUrl(data.contest.imageUrl, [
            { width: '1024' },
          ])}
        />
      )}
      <Typography variant="h2">
        {t(`contest.heat.${data?.contest?.heat}`)}
      </Typography>
      <Typography variant="span" className="text-zinc-500">
        {data?.contest?.city},{' '}
        {t(`countries.${data?.contest?.country.toLowerCase()}`)}
      </Typography>
    </div>
  );
};
