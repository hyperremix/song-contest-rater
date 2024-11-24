import React from 'react';
import { View } from 'react-native';
import { t, translations } from '../../i18n';
import { auth0Client } from '../../utils/auth';
import { Button } from '../atoms/Button';
import { Logo } from '../atoms/Logo';

export const LoginContent = () => (
  <View className="flex-1 justify-center items-center gap-4 dark:bg-zinc-800">
    <Logo size={256} />
    <Button
      label={t(translations.auth.loginButtonLabel)}
      onPress={() => auth0Client.authorize()}
    />
  </View>
);
