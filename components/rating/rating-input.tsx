'use client';

import { ReactNode } from 'react';
import { Typography } from '../custom/typography';
import { Slider } from '../ui/slider';

type Props = {
  icon: ReactNode;
  label: string;
  color: string;
  value: number;
  setValue: (value: number) => void;
};

export const RatingInput = ({ icon, label, value, setValue, color }: Props) => {
  return (
    <div className="flex flex-col items-stretch gap-2">
      <Typography variant="h5">
        {label}: {value}
      </Typography>
      <Slider
        color={color}
        value={[value]}
        icon={icon}
        min={1}
        max={15}
        step={1}
        onValueChange={(value) => setValue(value[0])}
      />
    </div>
  );
};
