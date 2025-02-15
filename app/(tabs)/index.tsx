import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  View,
} from 'react-native';
import { Button } from '../../components/atoms/Button';
import { Text } from '../../components/atoms/Text';
import { HeaderLayout } from '../../components/Layouts/HeaderLayout';
import { CompetitionCard } from '../../components/molecules/CompetitionCard';
import { HttpErrorModal } from '../../components/molecules/HttpErrorModal';
import { UpsertCompetitionModal } from '../../components/molecules/UpsertCompetitionModal';
import { color } from '../../constants/color';
import { t, translations } from '../../i18n';
import { useCompetitionStore, useUserStore } from '../../store';
import { Permission } from '../../utils/auth';

const Index = () => {
  const fetchCompetitions = useCompetitionStore(
    (state) => state.fetchCompetitions,
  );
  const competitions = useCompetitionStore((state) => state.competitions);
  const archivedCompetitions = useCompetitionStore(
    (state) => state.archivedCompetitions,
  );
  const authData = useUserStore((state) => state.authData);
  const hasPermission = useUserStore((state) => state.hasPermission);
  const isFetchCompetitionsLoading = useCompetitionStore(
    (state) => state.isFetchCompetitionsLoading,
  );
  const fetchCompetitionsError = useCompetitionStore(
    (state) => state.fetchCompetitionsError,
  );
  const confirmFetchCompetitionsError = useCompetitionStore(
    (state) => state.confirmFetchCompetitionsError,
  );

  const [isRefreshing, setIsRefreshing] = useState(false);
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

  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      fetchCompetitions();
    }
  }, [isSignedIn]);

  if (isSignedIn) {
    return <Redirect href={'/'} />;
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
          {isFetchCompetitionsLoading && !isRefreshing && (
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
          {competitionSections.length > 0 ? (
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
          ) : (
            <Text className="text-center text-2xl font-bold">
              {t(translations.competition.noCompetitionsFound)}
            </Text>
          )}
        </View>
      </HeaderLayout>
      {!!fetchCompetitionsError && (
        <HttpErrorModal
          httpError={fetchCompetitionsError}
          isVisible={!!fetchCompetitionsError}
          onClose={confirmFetchCompetitionsError}
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
