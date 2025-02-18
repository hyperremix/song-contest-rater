import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useEffect } from 'react';
import { ActivityIndicator, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color } from '../../constants/color';
import { useUserStore } from '../../store';
import { Avatar } from '../atoms/Avatar';
import { IconButton } from '../atoms/IconButton';
import { HttpErrorModal } from './HttpErrorModal';

export type HeaderProps = ViewProps & {
  withBackButton?: boolean;
  headerContent?: React.ReactNode;
  rightActionsContent?: React.ReactNode;
};

export const Header = ({
  withBackButton,
  headerContent,
  rightActionsContent,
  ...props
}: HeaderProps) => {
  const { top: paddingTop, left: paddingLeft } = useSafeAreaInsets();
  const navigation = useNavigation();
  const appUser = useUserStore((state) => state.appUser);
  const isFetchAppUserLoading = useUserStore(
    (state) => state.isFetchAppUserLoading,
  );
  const fetchAppUserError = useUserStore((state) => state.fetchAppUserError);
  const confirmFetchAppUserError = useUserStore(
    (state) => state.confirmFetchAppUserError,
  );
  const { colorScheme } = useColorScheme();

  const fetchAppUser = useUserStore((state) => state.fetchAppUser);
  const openDrawer = () => navigation.dispatch(DrawerActions.toggleDrawer());
  const handleBack = () => navigation.goBack();

  useEffect(() => {
    if (!withBackButton && !appUser) {
      fetchAppUser();
    }
  }, [appUser, withBackButton]);

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
              icon="arrow-left"
              variant="text"
              onPress={handleBack}
              color={colorScheme === 'dark' ? 'white' : 'black'}
            />
          ) : isFetchAppUserLoading ? (
            <ActivityIndicator color={color.primary} className="p-3" />
          ) : (
            <Avatar
              onPress={openDrawer}
              src={appUser?.image_url}
              name={`${appUser?.firstname} ${appUser?.lastname}`}
            />
          )}
        </View>
        <View className="flex flex-row items-center">
          {!!headerContent && headerContent}
        </View>
        {rightActionsContent ? (
          <View className="flex flex-col items-center gap-2">
            {rightActionsContent}
          </View>
        ) : withBackButton ? (
          <IconButton
            icon="arrow-left"
            variant="text"
            onPress={handleBack}
            className="opacity-0"
          />
        ) : (
          <Avatar
            onPress={openDrawer}
            src={appUser?.image_url}
            name={`${appUser?.firstname} ${appUser?.lastname}`}
            className="opacity-0"
          />
        )}
      </View>
      {!!fetchAppUserError && (
        <HttpErrorModal
          httpError={fetchAppUserError}
          isVisible={!!fetchAppUserError}
          onClose={confirmFetchAppUserError}
        />
      )}
    </View>
  );
};
