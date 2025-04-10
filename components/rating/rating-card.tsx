'use client';

import { toImagekitUrl } from '@/utils/toImagekitUrl';
import { Rating } from '@buf/hyperremix_song-contest-rater-protos.bufbuild_es/songcontestrater/v5/rating_pb';
import { Eye, Mic, Music, Pen, Shirt, Star } from 'lucide-react';
import { Typography } from '../custom/typography';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardFooter } from '../ui/card';
import { RatingDisplay } from './rating-display';

type Props = {
  rating: Rating;
  isEditable: boolean;
  onClick?: () => void;
};

export const RatingCard = ({ rating, isEditable, onClick }: Props) => {
  const component = (
    <Card className="relative flex flex-col">
      <CardContent className="pt-4">
        <div className="flex flex-row items-center justify-center gap-2 text-white">
          <RatingDisplay
            rating={rating.song}
            icon={<Music />}
            className="bg-red-500"
          />
          <RatingDisplay
            rating={rating.singing}
            icon={<Mic />}
            className="bg-orange-500"
          />
          <RatingDisplay
            rating={rating.show}
            icon={<Star />}
            className="bg-green-500"
          />
          <RatingDisplay
            rating={rating.looks}
            icon={<Eye />}
            className="bg-blue-500"
          />
          <RatingDisplay
            rating={rating.clothes}
            icon={<Shirt />}
            className="bg-purple-500"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center justify-end gap-2">
        <Avatar>
          <AvatarImage
            src={toImagekitUrl(rating.user?.imageUrl ?? '', [
              { height: '128', width: '128', focus: 'auto' },
            ])}
          />
          <AvatarFallback>{`${rating.user?.firstname} ${rating.user?.lastname}`}</AvatarFallback>
        </Avatar>
        <Typography variant="span">
          {rating.user?.firstname} {rating.user?.lastname}
        </Typography>
      </CardFooter>
      <div className="absolute right-0 top-0 flex flex-col items-center gap-2">
        <div className="flex w-11 flex-col items-center rounded-bl-md rounded-tr-md bg-primary-500 p-2">
          <Typography variant="h4" className="text-white">
            {rating.total}
          </Typography>
        </div>
        {isEditable && <Pen className="text-black dark:text-white" />}
      </div>
    </Card>
  );

  if (isEditable) {
    return (
      <div
        onClick={onClick}
        className="cursor-pointer hover:*:bg-zinc-300 dark:*:hover:bg-zinc-700"
      >
        {component}
      </div>
    );
  }

  return component;
};
