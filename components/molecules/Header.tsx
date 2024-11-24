import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { ActivityIndicator, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color } from '../../constants/color';
import { useUserStore } from '../../store';
import { Avatar } from '../atoms/Avatar';
import { IconButton } from '../atoms/IconButton';

export type HeaderProps = ViewProps & {
  withBackButton?: boolean;
  headerContent?: React.ReactNode;
};

export const Header = ({
  withBackButton,
  headerContent,
  ...props
}: HeaderProps) => {
  const { top: paddingTop, left: paddingLeft } = useSafeAreaInsets();
  const navigation = useNavigation();
  const authData = useUserStore((state) => state.authData);
  const isLoading = useUserStore((state) => state.isLoading);
  const { colorScheme } = useColorScheme();

  const openDrawer = () => navigation.dispatch(DrawerActions.toggleDrawer());
  const handleBack = () => navigation.goBack();

  return (
    <View
      className="flex flex-row items-center bg-white dark:bg-zinc-900"
      style={{ paddingTop, paddingLeft }}
      {...props}
    >
      <View className="px-4 py-2 flex flex-row items-stretch justify-between gap-2 w-full">
        <View className="flex flex-row items-start">
          {withBackButton ? (
            <IconButton
              icon="arrow-back"
              variant="text"
              onPress={handleBack}
              color={colorScheme === 'dark' ? 'white' : 'black'}
            />
          ) : isLoading ? (
            <ActivityIndicator color={color.primary} className="p-3" />
          ) : (
            <Avatar
              onPress={openDrawer}
              src={authData?.profile?.picture}
              name={authData?.profile?.name}
            />
          )}
        </View>
        <View className="flex flex-row items-center">
          {!!headerContent && headerContent}
        </View>
        {withBackButton ? (
          <IconButton
            icon="arrow-back"
            variant="text"
            onPress={handleBack}
            className="opacity-0"
          />
        ) : (
          <Avatar
            onPress={openDrawer}
            src={authData?.profile?.picture}
            name={authData?.profile?.name}
            className="opacity-0"
          />
        )}
      </View>
    </View>
  );
};
