import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthData } from '../../hooks/useAuthData';
import { Avatar } from '../atoms/Avatar';

export const Header = () => {
  const { top: paddingTop, left: paddingLeft } = useSafeAreaInsets();
  const navigation = useNavigation();
  const { authData } = useAuthData();

  const openDrawer = () => navigation.dispatch(DrawerActions.toggleDrawer());

  return (
    <View
      className="flex flex-row items-center bg-white dark:bg-zinc-900"
      style={{ paddingTop, paddingLeft }}
    >
      <View className={`px-4 pb-2${paddingTop === 0 ? ' pt-2' : ''}`}>
        <Avatar
          onPress={openDrawer}
          src={authData?.profile?.picture}
          name={authData?.profile?.name}
        />
      </View>
    </View>
  );
};
