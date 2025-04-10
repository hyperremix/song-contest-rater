'use client';

import { getBrowserTransport } from '@/app/get-browser-transport';
import { toImagekitUrl } from '@/utils/toImagekitUrl';
import { getContest } from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/contest_service-ContestService_connectquery';
import { useSuspenseQuery } from '@connectrpc/connect-query';
import { useTranslations } from 'next-intl';
import { ImageViewer } from '../custom/image-viewer';
import { Typography } from '../custom/typography';

type Props = {
  id: string;
};

export const ContestHeader = ({ id }: Props) => {
  const t = useTranslations();
  const transport = getBrowserTransport();

  const {
    data: { contest },
  } = useSuspenseQuery(getContest, { id }, { transport });

  return (
    <div className="flex flex-col items-center">
      {contest?.imageUrl && (
        <ImageViewer
          baseUri={toImagekitUrl(contest.imageUrl, [
            { height: '256', width: '256', focus: 'auto' },
          ])}
          zoomableImageUri={toImagekitUrl(contest.imageUrl, [
            { width: '1024' },
          ])}
        />
      )}
      <Typography variant="h2">{t(`contest.heat.${contest?.heat}`)}</Typography>
      <Typography variant="span" className="text-zinc-500">
        {contest?.city}, {t(`countries.${contest?.country.toLowerCase()}`)}
      </Typography>
    </div>
  );
};
