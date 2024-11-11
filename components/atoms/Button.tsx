import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Text } from './Text';

type Variant = 'filled' | 'outlined' | 'text';

export type Props = TouchableOpacityProps & {
  label: string;
  variant?: Variant;
};

const touchableStyles: Record<Variant, string> = {
  filled: 'bg-primary border-primary',
  outlined: 'border-primary',
  text: 'border-transparent',
};

const textStyles: Record<Variant, string> = {
  filled: 'text-white',
  outlined: 'text-primary',
  text: 'text-primary',
};

export const Button = ({ label, variant = 'filled', ...props }: Props) => {
  return (
    <TouchableOpacity
      className={`rounded-md py-3 px-6 border ${touchableStyles[variant]}`}
      {...props}
    >
      <Text className={`font-bold ${textStyles[variant]}`}>
        {label.toLocaleUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};
