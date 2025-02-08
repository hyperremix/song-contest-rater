import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from 'tailwindcss/colors';
import { t, translations } from '../../i18n';
import { useUserStore } from '../../store';
import { Avatar } from '../atoms/Avatar';
import { Button } from '../atoms/Button';
import { Divider } from '../atoms/Divider';
import { Logo } from '../atoms/Logo';
import { Text } from '../atoms/Text';

export const DrawerContent = (props: DrawerContentComponentProps) => {
  const { bottom: marginBottom } = useSafeAreaInsets();
  const logout = useUserStore((state) => state.logout);
  const appUser = useUserStore((state) => state.appUser);
  const navigation = useNavigation();
  const router = useRouter();
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
        <View className="flex flex-row items-center gap-2 py-2">
          <Avatar
            src={appUser?.image_url}
            name={`${appUser?.firstname} ${appUser?.lastname}`}
          />
          <View className="flex flex-col">
            <Text className="text-lg font-bold">
              {`${appUser?.firstname} ${appUser?.lastname}`}
            </Text>
            <Text className="text-sm text-zinc-500 dark:text-zinc-500">
              {appUser?.email}
            </Text>
          </View>
        </View>
        <Divider />
        <Button
          variant="text"
          label={t(translations.drawer.viewProfileButtonLabel)}
          onPress={() => router.navigate(`/users/${appUser?.id}`)}
          leftIcon="person-outline"
        />
      </View>
      <View className="flex flex-col gap-2">
        <Divider />
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
