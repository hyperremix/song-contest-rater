import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { color } from '../../constants/color';

type Variant = 'filled' | 'outlined' | 'text';

export type Props = TouchableOpacityProps & {
  icon: keyof typeof Ionicons.glyphMap;
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
  size = 32,
  className,
  ...props
}: Props) => {
  return (
    <TouchableOpacity
      className={`rounded-full p-3 border ${touchableStyles[variant]} ${className}`}
      {...props}
    >
      <Ionicons
        name={icon}
        size={size}
        color={color ? color : colors[variant]}
      />
    </TouchableOpacity>
  );
};
