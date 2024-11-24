import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, RefreshControl, View } from 'react-native';
import { Button } from '../../../components/atoms/Button';
import { Text } from '../../../components/atoms/Text';
import { HeaderLayout } from '../../../components/Layouts/HeaderLayout';
import { UpsertRatingModal } from '../../../components/molecules/EditRatingModal';
import { HttpErrorModal } from '../../../components/molecules/HttpErrorModal';
import { RatingCard } from '../../../components/molecules/RatingCard';
import { color } from '../../../constants/color';
import { t, translations } from '../../../i18n';
import { toImagekitUrl } from '../../../imagekit';
import { useActStore, useCompetitionStore, useUserStore } from '../../../store';
import { useRatingStore } from '../../../store/rating';

const ActScreen = () => {
  const user = useUserStore((state) => state.user);
  const selectedCompetition = useCompetitionStore(
    (state) => state.selectedCompetition,
  );
  const selectedAct = useActStore((state) => state.selectedAct);
  const ratings = useRatingStore((state) => state.ratings);
  const fetchRatingError = useRatingStore((state) => state.fetchRatingsError);
  const upsertRatingError = useRatingStore((state) => state.upsertRatingError);

  const fetchRatings = useRatingStore((state) => state.fetchRatings);
  const dismissError = useRatingStore((state) => state.dismissError);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchErrorModalVisible, setIsFetchErrorModalVisible] =
    useState(false);
  const [isUpsertRatingErrorModalVisible, setIsUpsertRatingErrorModalVisible] =
    useState(false);
  const [isEditRatingModalVisible, setIsEditRatingModalVisible] =
    useState(false);

  const canAddRating = useMemo(
    () => !ratings.some((rating) => rating.user?.id === user?.id),
    [selectedAct],
  );

  useEffect(() => {
    if (fetchRatingError) {
      setIsFetchErrorModalVisible(true);
    }
  }, [fetchRatingError]);

  useEffect(() => {
    if (upsertRatingError) {
      setIsUpsertRatingErrorModalVisible(true);
    }
  }, [upsertRatingError]);

  const refresh = async () => {
    setIsRefreshing(true);
    await fetchRatings(selectedAct!.id);
    setIsRefreshing(false);
  };

  const handleCloseErrorModal = () => {
    setIsFetchErrorModalVisible(false);
    setIsUpsertRatingErrorModalVisible(false);
    dismissError();
  };

  return (
    <>
      <HeaderLayout
        headerContent={
          <View className="flex flex-col items-center">
            {selectedAct?.image_url && (
              <Image
                className="object-contain rounded-lg h-32 w-32"
                source={{
                  uri: toImagekitUrl(selectedAct.image_url, [
                    { height: '256', width: '256' },
                  ]),
                }}
              />
            )}
            <Text className="text-2xl font-bold">{selectedAct?.song_name}</Text>
            <Text>{selectedAct?.artist_name}</Text>
          </View>
        }
        withBackButton
      >
        <View className="flex-1 flex-col items-stretch gap-6">
          {canAddRating && (
            <Button
              label={t(translations.rating.addRatingButtonLabel)}
              className="mt-4"
              onPress={() => setIsEditRatingModalVisible(true)}
            />
          )}
          {ratings.length > 0 && (
            <FlatList
              renderItem={({ item }) => (
                <RatingCard key={item.id} rating={item} />
              )}
              data={ratings}
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
        </View>
      </HeaderLayout>
      {isFetchErrorModalVisible && (
        <HttpErrorModal
          httpError={fetchRatingError}
          isVisible={isFetchErrorModalVisible}
          onClose={handleCloseErrorModal}
        />
      )}
      {isUpsertRatingErrorModalVisible && (
        <HttpErrorModal
          httpError={upsertRatingError}
          isVisible={isUpsertRatingErrorModalVisible}
          onClose={handleCloseErrorModal}
        />
      )}
      {isEditRatingModalVisible && (
        <UpsertRatingModal
          competitionId={selectedCompetition?.id}
          actId={selectedAct?.id}
          isVisible={isEditRatingModalVisible}
          onClose={() => setIsEditRatingModalVisible(false)}
        />
      )}
    </>
  );
};

export default ActScreen;
