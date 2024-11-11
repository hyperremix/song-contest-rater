import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthData } from '../../hooks/useAuthData';
import { t, translations } from '../../i18n';
import { auth0Client } from '../../utils/auth';
import { Button } from '../atoms/Button';
import { Logo } from '../atoms/Logo';
import { Text } from '../atoms/Text';

export const DrawerContent = (props: DrawerContentComponentProps) => {
  const { bottom: marginBottom } = useSafeAreaInsets();
  const { authData, setIsAuthenticated } = useAuthData();
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  const handleLogout = async () => {
    await auth0Client.logout();
    setIsAuthenticated(false);
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerClassName={`flex-1 flex-col justify-between items-center bg-white dark:bg-zinc-800`}
    >
      <View
        className={`flex flex-col items-center gap-2${
          top === 0 ? ' mt-2' : ''
        }`}
      >
        <Logo />
        <Text className="text-primary text-lg font-extrabold">
          Song Contest Rater
        </Text>
      </View>
      <View className="flex flex-col items-center">
        <Text>{t(translations.auth.loggedInAsHeader)}</Text>
        {authData?.profile?.name !== authData?.profile?.email && (
          <Text>{authData?.profile?.name}</Text>
        )}
        <Text>{authData?.profile?.email}</Text>
        <Button
          variant="text"
          label={t(translations.auth.logoutButtonLabel)}
          onPress={handleLogout}
          style={{ marginBottom }}
        />
      </View>
    </DrawerContentScrollView>
  );
};
