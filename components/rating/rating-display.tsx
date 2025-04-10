'use client';

import { ReactNode } from 'react';
import { Typography } from '../custom/typography';

type RatingProps = {
  rating: number;
  icon: ReactNode;
  className?: string;
};

export const RatingDisplay = ({
  rating,
  icon,
  className = '',
}: RatingProps) => (
  <div
    className={`flex flex-col items-center gap-0.5 rounded-md p-2 ${className}`}
  >
    {icon}
    <Typography className="text-white">{rating}</Typography>
  </div>
);
