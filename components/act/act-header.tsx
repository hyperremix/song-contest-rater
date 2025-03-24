'use client';

import { getAct } from '@/utils/http/act';
import { toImagekitUrl } from '@/utils/toImagekitUrl';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ImageViewer } from '../custom/image-viewer';
import { Typography } from '../custom/typography';

type Props = {
  id: string;
};

export const ActHeader = ({ id }: Props) => {
  const { data } = useSuspenseQuery({
    queryKey: ['getAct', id],
    queryFn: () => getAct(id),
  });

  return (
    <div className="flex flex-col items-center">
      {data?.image_url && (
        <ImageViewer
          baseUri={toImagekitUrl(data.image_url, [
            { height: '256', width: '256', focus: 'auto' },
          ])}
          zoomableImageUri={toImagekitUrl(data.image_url, [{ width: '1024' }])}
        />
      )}
      <Typography variant="h2">{data?.song_name}</Typography>
      <Typography variant="span" className="text-zinc-500">
        {data?.artist_name}
      </Typography>
    </div>
  );
};
