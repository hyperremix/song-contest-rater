'use client';

import { getBrowserTransport } from '@/app/get-browser-transport';
import { toImagekitUrl } from '@/utils/toImagekitUrl';
import { getAct } from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/act_service-ActService_connectquery';
import { useAuth } from '@clerk/nextjs';
import { useSuspenseQuery } from '@connectrpc/connect-query';
import { useMemo } from 'react';
import { ImageViewer } from '../custom/image-viewer';
import { Typography } from '../custom/typography';

type Props = {
  id: string;
};

export const ActHeader = ({ id }: Props) => {
  const { getToken } = useAuth();

  const transport = useMemo(() => getBrowserTransport(getToken), [getToken]);

  const { data } = useSuspenseQuery(getAct, { id }, { transport });

  return (
    <div className="flex flex-col items-center">
      {data?.act?.imageUrl && (
        <ImageViewer
          baseUri={toImagekitUrl(data.act.imageUrl, [
            { height: '256', width: '256', focus: 'auto' },
          ])}
          zoomableImageUri={toImagekitUrl(data.act.imageUrl, [
            { width: '1024' },
          ])}
        />
      )}
      <Typography variant="h2">{data?.act?.songName}</Typography>
      <Typography variant="span" className="text-zinc-500">
        {data?.act?.artistName}
      </Typography>
    </div>
  );
};
