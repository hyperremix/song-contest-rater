'use client';

import { getBrowserTransport } from '@/app/get-browser-transport';
import { toImagekitUrl } from '@/utils/toImagekitUrl';
import { getAct } from '@buf/hyperremix_song-contest-rater-protos.connectrpc_query-es/songcontestrater/v5/act_service-ActService_connectquery';
import { useSuspenseQuery } from '@connectrpc/connect-query';
import { ImageViewer } from '../custom/image-viewer';
import { Typography } from '../custom/typography';

type Props = {
  id: string;
};

export const ActHeader = ({ id }: Props) => {
  const transport = getBrowserTransport();

  const {
    data: { act },
  } = useSuspenseQuery(getAct, { id }, { transport });

  return (
    <div className="flex flex-col items-center">
      {act?.imageUrl && (
        <ImageViewer
          baseUri={toImagekitUrl(act.imageUrl, [
            { height: '256', width: '256', focus: 'auto' },
          ])}
          zoomableImageUri={toImagekitUrl(act.imageUrl, [{ width: '1024' }])}
        />
      )}
      <Typography variant="h2">{act?.songName}</Typography>
      <Typography variant="span" className="text-zinc-500">
        {act?.artistName}
      </Typography>
    </div>
  );
};
