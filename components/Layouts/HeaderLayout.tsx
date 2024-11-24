import React from 'react';
import { View } from 'react-native';
import { Header, HeaderProps } from '../molecules/Header';
import { BaseLayout } from './BaseLayout';

export const HeaderLayout = ({
  children,
  className,
  headerContent,
  withBackButton,
  ...props
}: HeaderProps) => {
  return (
    <BaseLayout>
      <Header headerContent={headerContent} withBackButton={withBackButton} />
      <View className={`flex-1 px-2 pt-2 ${className}`} {...props}>
        {children}
      </View>
    </BaseLayout>
  );
};
