import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  SectionList,
  View,
} from 'react-native';
import { Button } from '../../../components/atoms/Button';
import { IconButton } from '../../../components/atoms/IconButton';
import { Text } from '../../../components/atoms/Text';
import { HeaderLayout } from '../../../components/Layouts/HeaderLayout';
import { ActCard } from '../../../components/molecules/ActCard';
import { HttpErrorModal } from '../../../components/molecules/HttpErrorModal';
import { LoadingCard } from '../../../components/molecules/LoadingCard';
import { UpsertActModal } from '../../../components/molecules/UpsertActModal';
import { UpsertCompetitionModal } from '../../../components/molecules/UpsertCompetitionModal';
import { color } from '../../../constants/color';
import { t, translations } from '../../../i18n';
import { toImagekitUrl } from '../../../imagekit';
import { useCompetitionStore, useUserStore } from '../../../store';
import { splitRatedActs } from '../../../utils/act';
import { Permission } from '../../../utils/auth';

const CompetitionScreen = () => {
  const selectedCompetition = useCompetitionStore(
    (state) => state.selectedCompetition,
  );
  const error = useCompetitionStore((state) => state.getCompetitionError);
  const authData = useUserStore((state) => state.authData);
  const hasPermission = useUserStore((state) => state.hasPermission);

  const fetchSelectedCompetition = useCompetitionStore(
    (state) => state.fetchSelectedCompetition,
  );
  const isFetchSelectedCompetitionLoading = useCompetitionStore(
    (state) => state.isFetchSelectedCompetitionLoading,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isUpsertCompetitionModalVisible, setIsUpsertCompetitionModalVisible] =
    useState(false);
  const [isUpsertActModalVisible, setIsUpsertActModalVisible] = useState(false);

  const canEditCompetition = useMemo(
    () => hasPermission(Permission.WriteCompetitions),
    [authData],
  );

  const canAddAct = useMemo(
    () => hasPermission(Permission.WriteActs),
    [authData],
  );

  const actSections = useMemo(
    () => splitRatedActs(selectedCompetition?.acts),
    [selectedCompetition],
  );

  useEffect(() => {
    if (error) {
      setIsErrorVisible(true);
    }
  }, [error]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchSelectedCompetition(selectedCompetition!.id);
    setIsRefreshing(false);
  };

  return (
    <>
      <HeaderLayout
        headerContent={
          <View>
            {isFetchSelectedCompetitionLoading && (
              <ActivityIndicator
                color={color.primary}
                size="large"
                className="absolute flex items-center justify-center h-full w-full z-10"
              />
            )}
            <View
              className={`flex flex-col items-center ${isFetchSelectedCompetitionLoading ? 'opacity-0' : ''}`}
            >
              {selectedCompetition?.image_url && (
                <Image
                  className="object-contain rounded-lg h-32 w-32"
                  source={{
                    uri: toImagekitUrl(selectedCompetition.image_url, [
                      { height: '256', width: '256', focus: 'auto' },
                    ]),
                  }}
                />
              )}
              <Text className="text-2xl font-bold">
                {t(`competition.heat.${selectedCompetition?.heat}`)}
              </Text>
              <Text className="text-gray-700 dark:text-gray-500">
                {selectedCompetition?.city},{' '}
                {t(`countries.${selectedCompetition?.country.toLowerCase()}`)}
              </Text>
            </View>
          </View>
        }
        withBackButton
        rightActionsContent={
          canEditCompetition && (
            <IconButton
              icon="pencil"
              variant="text"
              onPress={() => setIsUpsertCompetitionModalVisible(true)}
            />
          )
        }
      >
        <View className="flex-1 flex-col items-stretch gap-6">
          {canAddAct && (
            <Button
              label={t(translations.act.addActButtonLabel)}
              className="mt-4"
              onPress={() => setIsUpsertActModalVisible(true)}
            />
          )}
          {isFetchSelectedCompetitionLoading ? (
            <View className="flex flex-col gap-2">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <LoadingCard key={i} />
              ))}
            </View>
          ) : (
            <SectionList
              sections={actSections}
              renderItem={({ item }) => <ActCard key={item.id} act={item} />}
              ItemSeparatorComponent={() => <View className="h-2" />}
              renderSectionHeader={({ section: { title } }) => (
                <View className="flex flex-col items-center mb-2">
                  <Text className="text-xl font-bold">{title}</Text>
                </View>
              )}
              SectionSeparatorComponent={() => <View className="h-2" />}
              refreshControl={
                <RefreshControl
                  onRefresh={onRefresh}
                  refreshing={isRefreshing}
                  tintColor={color.primary}
                />
              }
            />
          )}
        </View>
      </HeaderLayout>
      {isErrorVisible && (
        <HttpErrorModal
          httpError={error}
          isVisible={isErrorVisible}
          onClose={() => setIsErrorVisible(false)}
        />
      )}
      {isUpsertCompetitionModalVisible && (
        <UpsertCompetitionModal
          competition={selectedCompetition}
          isVisible={isUpsertCompetitionModalVisible}
          onClose={() => setIsUpsertCompetitionModalVisible(false)}
        />
      )}
      {isUpsertActModalVisible && (
        <UpsertActModal
          isVisible={isUpsertActModalVisible}
          onClose={() => setIsUpsertActModalVisible(false)}
        />
      )}
    </>
  );
};

export default CompetitionScreen;
