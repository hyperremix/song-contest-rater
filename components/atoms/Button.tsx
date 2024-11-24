import React from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { Text } from './Text';

type Variant = 'filled' | 'outlined' | 'text';

export type Props = TouchableOpacityProps & {
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

export const Button = ({
  label,
  variant = 'filled',
  isLoading = false,
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
      <TouchableOpacity
        className={`rounded-md border-2 ${touchableStyles[variant]}`}
        {...props}
        disabled={isLoading}
      >
        <View className="flex justify-center items-center py-3 px-6">
          <Text className={`font-bold ${textStyles[variant]}`}>
            {label.toLocaleUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
