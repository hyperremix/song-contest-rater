import React, { ReactElement } from 'react';
import { View, ViewProps } from 'react-native';
import { BaseLayout } from './BaseLayout';

type Props = ViewProps & {
  screenTitle?: string;
  hasDrawer?: boolean;
  onGoBack?: () => void;
  accessoryRightIcon?: ReactElement;
  children?: ReactElement;
};

export const NavBarScreenLayout = ({
  screenTitle,
  hasDrawer,
  onGoBack,
  accessoryRightIcon,
  children,
  ...props
}: Props) => (
  <BaseLayout {...props}>
    <View className="flex-1">{children}</View>
  </BaseLayout>
);
