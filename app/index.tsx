import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  View,
} from 'react-native';
import { Button } from '../components/atoms/Button';
import { Text } from '../components/atoms/Text';
import { HeaderLayout } from '../components/Layouts/HeaderLayout';
import { CompetitionCard } from '../components/molecules/CompetitionCard';
import { HttpErrorModal } from '../components/molecules/HttpErrorModal';
import { UpsertCompetitionModal } from '../components/molecules/UpsertCompetitionModal';
import { LoginContent } from '../components/organisms/LoginContent';
import { color } from '../constants/color';
import { t, translations } from '../i18n';
import { useCompetitionStore, useUserStore } from '../store';
import { Permission } from '../utils/auth';

const Index = () => {
  const fetchCompetitions = useCompetitionStore(
    (state) => state.fetchCompetitions,
  );
  const competitions = useCompetitionStore((state) => state.competitions);
  const archivedCompetitions = useCompetitionStore(
    (state) => state.archivedCompetitions,
  );
  const authData = useUserStore((state) => state.authData);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const hasPermission = useUserStore((state) => state.hasPermission);
  const isCompetitionsListLoading = useCompetitionStore(
    (state) => state.isLoading,
  );
  const listCompetitionsError = useCompetitionStore(
    (state) => state.listCompetitionsError,
  );

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isListCompetitionsErrorVisible, setIsListCompetitionsErrorVisible] =
    useState(false);
  const [isUpsertCompetitionModalVisible, setIsUpsertCompetitionModalVisible] =
    useState(false);

  const canAddCompetition = useMemo(
    () => hasPermission(Permission.WriteCompetitions),
    [authData],
  );

  const competitionSections = useMemo(() => {
    const sections = [];

    if (competitions.length > 0) {
      sections.push({
        title: t(translations.competition.upcomingCompetitionsTitle),
        data: competitions,
      });
    }

    if (archivedCompetitions.length > 0) {
      sections.push({
        title: t(translations.competition.archivedCompetitionsTitle),
        data: archivedCompetitions,
      });
    }

    return sections;
  }, [competitions, archivedCompetitions]);

  const refresh = async () => {
    setIsRefreshing(true);
    await fetchCompetitions();
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCompetitions();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (listCompetitionsError) {
      setIsListCompetitionsErrorVisible(true);
    }
  }, [listCompetitionsError]);

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
        <View className="flex-1 flex-col items-stretch gap-6">
          {isCompetitionsListLoading && !isRefreshing && (
            <View className="flex flex-col items-center">
              <ActivityIndicator color={color.primary} size="large" />
            </View>
          )}
          {canAddCompetition && (
            <Button
              label={t(translations.competition.addCompetitionButtonLabel)}
              className="mt-4"
              onPress={() => setIsUpsertCompetitionModalVisible(true)}
            />
          )}
          <SectionList
            sections={competitionSections}
            renderItem={({ item }) => (
              <CompetitionCard key={item.id} competition={item} />
            )}
            ItemSeparatorComponent={() => <View className="h-2" />}
            renderSectionHeader={({ section: { title } }) => (
              <View className="flex flex-col items-center mb-2">
                <Text className="text-xl font-bold">{title}</Text>
              </View>
            )}
            refreshControl={
              <RefreshControl
                onRefresh={refresh}
                refreshing={isRefreshing}
                tintColor={color.primary}
              />
            }
          />
        </View>
      </HeaderLayout>
      {isListCompetitionsErrorVisible && (
        <HttpErrorModal
          httpError={listCompetitionsError}
          isVisible={isListCompetitionsErrorVisible}
          onClose={() => setIsListCompetitionsErrorVisible(false)}
        />
      )}
      {isUpsertCompetitionModalVisible && (
        <UpsertCompetitionModal
          isVisible={isUpsertCompetitionModalVisible}
          onClose={() => setIsUpsertCompetitionModalVisible(false)}
        />
      )}
    </>
  );
};

export default Index;
