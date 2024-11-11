import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

export const Text = ({ children, ...props }: TextProps) => {
  return (
    <RNText className="dark:text-white" {...props}>
      {children}
    </RNText>
  );
};
