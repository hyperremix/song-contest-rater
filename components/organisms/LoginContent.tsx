import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { t, translations } from '../../i18n';
import { useUserStore } from '../../store';
import { auth0Client } from '../../utils/auth';
import { Button } from '../atoms/Button';
import { Logo } from '../atoms/Logo';
import { HttpErrorModal } from '../molecules/HttpErrorModal';

export const LoginContent = () => {
  const getUserError = useUserStore((state) => state.getUserError);
  const isLoading = useUserStore((state) => state.isLoading);

  const [isUserErrorVisible, setIsUserErrorVisible] = useState(false);

  useEffect(() => {
    if (getUserError) {
      setIsUserErrorVisible(true);
    }
  }, [getUserError]);

  return (
    <>
      <View className="flex-1 justify-center items-center gap-4 dark:bg-zinc-800">
        {isLoading && (
          <View className="absolute w-full h-full rounded-md flex items-center justify-center bg-black/50 z-10">
            <ActivityIndicator color="white" size="large" />
          </View>
        )}
        <Logo size={256} />
        <Button
          label={t(translations.auth.loginButtonLabel)}
          onPress={() => auth0Client.authorize()}
        />
      </View>
      {isUserErrorVisible && (
        <HttpErrorModal
          httpError={getUserError}
          isVisible={isUserErrorVisible}
          onClose={() => setIsUserErrorVisible(false)}
        />
      )}
    </>
  );
};
