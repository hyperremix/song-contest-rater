import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from 'tailwindcss/colors';
import { t, translations } from '../../i18n';
import { useUserStore } from '../../store';
import { Button } from '../atoms/Button';
import { Logo } from '../atoms/Logo';
import { Text } from '../atoms/Text';

export const DrawerContent = (props: DrawerContentComponentProps) => {
  const { bottom: marginBottom } = useSafeAreaInsets();
  const logout = useUserStore((state) => state.logout);
  const authData = useUserStore((state) => state.authData);
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();

  const handleLogout = async () => {
    await logout();
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor:
          colorScheme === 'dark' ? colors.zinc[800] : colors.white,
      }}
    >
      <View
        className={`flex flex-col items-center gap-2${
          top === 0 ? ' mt-2' : ''
        }`}
      >
        <Logo />
        <Text className="text-primary dark:text-primary text-lg font-extrabold">
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
function useAuthStore(arg0: (state: any) => any) {
  throw new Error('Function not implemented.');
}
