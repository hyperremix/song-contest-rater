import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import * as NavigationBar from 'expo-navigation-bar';
import { SplashScreen } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect } from 'react';
import { BaseLayout } from '../components/Layouts/BaseLayout';
import { DrawerContent } from '../components/organisms/DrawerContent';
import { environment } from '../environment';
import { useAppSetup } from '../hooks/useAppSetup';
import { tokenCache } from '../utils/cache';

import 'react-native-url-polyfill/auto';
import '../style/global.css';
import '../utils/sse/rating-sse';

SplashScreen.preventAutoHideAsync();
WebBrowser.maybeCompleteAuthSession();

const RootLayout = () => {
  const { appIsReady, setupApplication } = useAppSetup();

  useEffect(() => {
    setupApplication();

    NavigationBar.setPositionAsync('absolute');
    NavigationBar.setBackgroundColorAsync('#ffffff00');
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
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={environment.clerkPublishableKey}
    >
      <ClerkLoaded>
        <BaseLayout onLayout={onLayoutRootView}>
          <Drawer
            drawerContent={DrawerContent}
            screenOptions={{ headerShown: false }}
          >
            <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
          </Drawer>
        </BaseLayout>
      </ClerkLoaded>
    </ClerkProvider>
  );
};

export default RootLayout;
