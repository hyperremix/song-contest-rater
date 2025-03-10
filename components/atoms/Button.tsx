import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { color } from '../../constants/color';
import { Text } from './Text';

type Variant = 'filled' | 'outlined' | 'text';

export type Props = TouchableOpacityProps & {
  leftIcon?: keyof typeof Ionicons.glyphMap;
  label: string;
  variant?: Variant;
  isLoading?: boolean;
};

const touchableStyles: Record<Variant, string> = {
  filled: 'bg-primary border-primary',
  outlined: 'border-primary',
  text: 'border-transparent',
};

const textStyles: Record<Variant, string> = {
  filled: 'text-white',
  outlined: 'text-primary dark:text-primary',
  text: 'text-primary dark:text-primary',
};

const iconColor: Record<Variant, string> = {
  filled: 'white',
  outlined: color.primary,
  text: color.primary,
};

export const Button = ({
  leftIcon,
  label,
  variant = 'filled',
  isLoading = false,
  disabled = false,
  className,
  ...props
}: Props) => {
  return (
    <View className={className}>
      {isLoading && (
        <View className="absolute w-full h-full rounded-md flex items-center justify-center bg-black/50 z-10">
          <ActivityIndicator color="white" size="small" />
        </View>
      )}
      {disabled && (
        <View className="absolute w-full h-full rounded-md flex items-center justify-center bg-black/50 z-10" />
      )}
      <TouchableOpacity
        className={`rounded-md border-2 ${touchableStyles[variant]}`}
        {...props}
        disabled={isLoading || disabled}
      >
        <View className="flex flex-row justify-center items-center gap-2 py-3 px-6">
          {leftIcon && (
            <Ionicons name={leftIcon} size={24} color={iconColor[variant]} />
          )}
          <Text className={`font-bold ${textStyles[variant]}`}>
            {label.toLocaleUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
