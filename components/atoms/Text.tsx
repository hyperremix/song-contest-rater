import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

export const Text = ({ children, className, ...props }: TextProps) => {
  const darkTextColor = className?.includes('dark:text')
    ? ''
    : 'dark:text-white';

  return (
    <RNText className={`${darkTextColor} ${className}`} {...props}>
      {children}
    </RNText>
  );
};
