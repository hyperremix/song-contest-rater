import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { t, translations } from '../../i18n';
import { useUserStore } from '../../store';
import { auth0Client } from '../../utils/auth';
import { Button } from '../atoms/Button';
import { Logo } from '../atoms/Logo';
import { HttpErrorModal } from '../molecules/HttpErrorModal';

export const LoginContent = () => {
  const fetchAppUserError = useUserStore((state) => state.fetchAppUserError);
  const isFetchAppUserLoading = useUserStore(
    (state) => state.isFetchAppUserLoading,
  );
  const confirmFetchAppUserError = useUserStore(
    (state) => state.confirmFetchAppUserError,
  );

  return (
    <>
      <View className="flex-1 justify-center items-center gap-4 dark:bg-zinc-800">
        {isFetchAppUserLoading && (
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
      {!!fetchAppUserError && (
        <HttpErrorModal
          httpError={fetchAppUserError}
          isVisible={!!fetchAppUserError}
          onClose={confirmFetchAppUserError}
        />
      )}
    </>
  );
};
