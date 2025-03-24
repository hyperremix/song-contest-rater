'use client';

import { getContest } from '@/utils/http/contest';
import { toImagekitUrl } from '@/utils/toImagekitUrl';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { ImageViewer } from '../custom/image-viewer';
import { Typography } from '../custom/typography';

type Props = {
  id: string;
};

export const ContestHeader = ({ id }: Props) => {
  const t = useTranslations();

  const { data } = useSuspenseQuery({
    queryKey: ['getContest', id],
    queryFn: () => getContest(id),
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
      <Typography variant="h2">{t(`contest.heat.${data?.heat}`)}</Typography>
      <Typography variant="span" className="text-zinc-500">
        {data?.city}, {t(`countries.${data?.country.toLowerCase()}`)}
      </Typography>
    </div>
  );
};
