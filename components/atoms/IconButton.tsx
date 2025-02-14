import { FontAwesome6 } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { color } from '../../constants/color';

type Variant = 'filled' | 'outlined' | 'text';

export type Props = TouchableOpacityProps & {
  icon: keyof typeof FontAwesome6.glyphMap;
  variant?: Variant;
  color?: string;
  size?: number;
};

const touchableStyles: Record<Variant, string> = {
  filled: 'bg-primary border-primary',
  outlined: 'border-primary',
  text: 'border-transparent',
};

const colors: Record<Variant, string> = {
  filled: 'white',
  outlined: color.primary,
  text: color.primary,
};

export const IconButton = ({
  icon,
  variant = 'filled',
  color,
  size = 30,
  className,
  ...props
}: Props) => {
  return (
    <TouchableOpacity
      className={`rounded-full size-12 p-2 border ${touchableStyles[variant]} ${className}`}
      {...props}
    >
      <FontAwesome6
        name={icon}
        size={size}
        color={color ? color : colors[variant]}
      />
    </TouchableOpacity>
  );
};
