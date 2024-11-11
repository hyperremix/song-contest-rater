import React, { ReactNode } from 'react';
import { View, ViewProps } from 'react-native';

type Props = ViewProps & {
  children?: ReactNode;
};

export const BaseLayout = ({ children, className, ...props }: Props) => {
  return (
    <View
      className={`flex-1 bg-zinc-400 dark:bg-zinc-800 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};
