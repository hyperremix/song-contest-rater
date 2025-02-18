import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import { Button } from '../../../../../components/atoms/Button';
import { IconButton } from '../../../../../components/atoms/IconButton';
import { Text } from '../../../../../components/atoms/Text';
import { HeaderLayout } from '../../../../../components/Layouts/HeaderLayout';
import { HttpErrorModal } from '../../../../../components/molecules/HttpErrorModal';
import { ImageViewer } from '../../../../../components/molecules/ImageViewer';
import { RatingCard } from '../../../../../components/molecules/RatingCard';
import { UpsertActModal } from '../../../../../components/molecules/UpsertActModal';
import { UpsertRatingModal } from '../../../../../components/molecules/UpsertRatingModal';
import { color } from '../../../../../constants/color';
import { t, translations } from '../../../../../i18n';
import { toImagekitUrl } from '../../../../../imagekit';
import {
  useActStore,
  useCompetitionStore,
  useUserStore,
} from '../../../../../store';
import { useRatingStore } from '../../../../../store/rating';
import { Permission } from '../../../../../utils/auth';

const ActScreen = () => {
  const user = useUserStore((state) => state.appUser);
  const selectedCompetition = useCompetitionStore(
    (state) => state.selectedCompetition,
  );
  const selectedAct = useActStore((state) => state.selectedAct);
  const ratings = useRatingStore((state) => state.ratings);
  const fetchRatingError = useRatingStore((state) => state.fetchRatingsError);
  const upsertRatingError = useRatingStore((state) => state.upsertRatingError);
  const confirmUpsertRatingError = useRatingStore(
    (state) => state.confirmUpsertRatingError,
  );
  const authData = useUserStore((state) => state.authData);
  const hasPermission = useUserStore((state) => state.hasPermission);

  const fetchRatings = useRatingStore((state) => state.fetchRatings);
  const confirmFetchRatingsError = useRatingStore(
    (state) => state.confirmFetchRatingsError,
  );

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpsertRatingModalVisible, setIsUpsertRatingModalVisible] =
    useState(false);
  const [isUpsertActModalVisible, setIsUpsertActModalVisible] = useState(false);

  const canAddRating = useMemo(
    () => !ratings?.some((rating) => rating.user?.id === user?.id),
    [selectedAct],
  );

  const canEditAct = useMemo(
    () => hasPermission(Permission.WriteActs),
    [authData],
  );

  const refresh = async () => {
    setIsRefreshing(true);
    await fetchRatings(selectedAct!.id);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchRatings(selectedAct!.id);
  }, []);

  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);

  return (
    <>
      <HeaderLayout
        headerContent={
          <View className="flex flex-col items-center">
            {selectedAct?.image_url && (
              <TouchableOpacity
                onPress={() => setIsImageViewerVisible(true)}
                className="rounded-lg h-32 w-32"
              >
                <ImageViewer
                  baseUri={toImagekitUrl(selectedAct.image_url, [
                    { height: '256', width: '256', cropMode: 'pad_resize' },
                  ])}
                  zoomableImageUri={toImagekitUrl(selectedAct.image_url, [
                    { width: '512' },
                  ])}
                  isVisible={isImageViewerVisible}
                  onClose={() => setIsImageViewerVisible(false)}
                />
              </TouchableOpacity>
            )}
            <Text className="text-2xl font-bold">{selectedAct?.song_name}</Text>
            <Text>{selectedAct?.artist_name}</Text>
          </View>
        }
        withBackButton
        rightActionsContent={
          canEditAct && (
            <IconButton
              icon="pen"
              variant="text"
              onPress={() => setIsUpsertActModalVisible(true)}
            />
          )
        }
      >
        <View className="flex-1 flex-col items-stretch gap-6">
          {canAddRating && (
            <Button
              label={t(translations.rating.addRatingButtonLabel)}
              className="mt-4"
              onPress={() => setIsUpsertRatingModalVisible(true)}
            />
          )}
          {(ratings?.length ?? 0) > 0 && (
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
      {!!fetchRatingError && (
        <HttpErrorModal
          httpError={fetchRatingError}
          isVisible={!!fetchRatingError}
          onClose={confirmFetchRatingsError}
        />
      )}
      {!!upsertRatingError && (
        <HttpErrorModal
          httpError={upsertRatingError}
          isVisible={!!upsertRatingError}
          onClose={confirmUpsertRatingError}
        />
      )}
      {isUpsertRatingModalVisible && (
        <UpsertRatingModal
          competitionId={selectedCompetition?.id}
          actId={selectedAct?.id}
          isVisible={isUpsertRatingModalVisible}
          onClose={() => setIsUpsertRatingModalVisible(false)}
        />
      )}
      {isUpsertActModalVisible && (
        <UpsertActModal
          act={selectedAct}
          isVisible={isUpsertActModalVisible}
          onClose={() => setIsUpsertActModalVisible(false)}
        />
      )}
    </>
  );
};

export default ActScreen;
