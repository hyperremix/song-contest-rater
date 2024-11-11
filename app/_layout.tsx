import * as NavigationBar from 'expo-navigation-bar';
import { SplashScreen } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { BaseLayout } from '../components/Layouts/BaseLayout';
import { DrawerContent } from '../components/organisms/DrawerContent';
import { useAppSetup } from '../hooks/useAppSetup';

import '../style/global.css';

SplashScreen.preventAutoHideAsync();
WebBrowser.maybeCompleteAuthSession();

const setTransparentNavigationBar = () => {
  if (Platform.OS === 'android') {
    NavigationBar.setPositionAsync('absolute');
    NavigationBar.setBackgroundColorAsync('#ffffff00');
  }
};

setTransparentNavigationBar();

const RootLayout = () => {
  const { appIsReady, setupApplication } = useAppSetup();

  useEffect(() => {
    setupApplication();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <BaseLayout onLayout={onLayoutRootView}>
      <Drawer drawerContent={DrawerContent}>
        <Drawer.Screen name="index" options={{ headerShown: false }} />
      </Drawer>
    </BaseLayout>
  );
};

export default RootLayout;
