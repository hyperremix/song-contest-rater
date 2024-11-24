import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import { Text } from '../components/atoms/Text';
import { HeaderLayout } from '../components/Layouts/HeaderLayout';
import { CompetitionCard } from '../components/molecules/CompetitionCard';
import { HttpErrorModal } from '../components/molecules/HttpErrorModal';
import { LoginContent } from '../components/organisms/LoginContent';
import { color } from '../constants/color';
import { t, translations } from '../i18n';
import { useCompetitionStore, useUserStore } from '../store';

const Index = () => {
  const fetchUser = useUserStore((state) => state.fetchUser);
  const fetchCompetitions = useCompetitionStore(
    (state) => state.fetchCompetitions,
  );
  const competitions = useCompetitionStore((state) => state.competitions);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isCompetitionsListLoading = useCompetitionStore(
    (state) => state.isLoading,
  );
  const getUserError = useUserStore((state) => state.getUserError);
  const listCompetitionsError = useCompetitionStore(
    (state) => state.listCompetitionsError,
  );

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isListCompetitionsErrorVisible, setIsListCompetitionsErrorVisible] =
    useState(false);
  const [isUserErrorVisible, setIsUserErrorVisible] = useState(false);

  const refresh = async () => {
    setIsRefreshing(true);
    await fetchCompetitions();
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser().then(() => fetchCompetitions());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (listCompetitionsError) {
      setIsListCompetitionsErrorVisible(true);
    }
  }, [listCompetitionsError]);

  useEffect(() => {
    if (getUserError) {
      setIsUserErrorVisible(true);
    }
  }, [getUserError]);

  if (!isAuthenticated) {
    return <LoginContent />;
  }

  return (
    <>
      <HeaderLayout
        headerContent={
          <Text className="text-2xl font-bold">
            {t(translations.homeScreenTitle)}
          </Text>
        }
      >
        {isCompetitionsListLoading && !isRefreshing && (
          <View className="flex flex-col items-center">
            <ActivityIndicator color={color.primary} size="large" />
          </View>
        )}
        {competitions?.length > 0 && (
          <FlatList
            renderItem={({ item }) => (
              <CompetitionCard key={item.id} competition={item} />
            )}
            data={competitions}
            contentContainerClassName="gap-2"
            refreshControl={
              <RefreshControl
                onRefresh={refresh}
                refreshing={isRefreshing}
                tintColor={color.primary}
              />
            }
          />
        )}
      </HeaderLayout>
      {isListCompetitionsErrorVisible && (
        <HttpErrorModal
          httpError={listCompetitionsError}
          isVisible={isListCompetitionsErrorVisible}
          onClose={() => setIsListCompetitionsErrorVisible(false)}
        />
      )}
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

export default Index;
