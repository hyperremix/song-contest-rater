import React from 'react';
import { View, ViewProps } from 'react-native';
import { Header } from '../molecules/Header';
import { BaseLayout } from './BaseLayout';

type Props = ViewProps & {};

export const HeaderLayout = ({ children, ...props }: Props) => {
  return (
    <BaseLayout>
      <Header />
      <View {...props}>{children}</View>
    </BaseLayout>
  );
};
