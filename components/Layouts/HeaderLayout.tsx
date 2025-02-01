import React from 'react';
import { View } from 'react-native';
import { Header, HeaderProps } from '../molecules/Header';
import { BaseLayout } from './BaseLayout';

export const HeaderLayout = ({
  children,
  className,
  headerContent,
  withBackButton,
  rightActionsContent,
  ...props
}: HeaderProps) => (
  <BaseLayout>
    <Header
      headerContent={headerContent}
      withBackButton={withBackButton}
      rightActionsContent={rightActionsContent}
    />
    <View className="flex-1 items-center">
      <View
        className={`flex-1 px-2 pt-2 w-full max-w-3xl ${className}`}
        {...props}
      >
        {children}
      </View>
    </View>
  </BaseLayout>
);
