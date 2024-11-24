import React, { useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, View } from 'react-native';
import { Text } from '../../components/atoms/Text';
import { HeaderLayout } from '../../components/Layouts/HeaderLayout';
import { ActCard } from '../../components/molecules/ActCard';
import { HttpErrorModal } from '../../components/molecules/HttpErrorModal';
import { color } from '../../constants/color';
import { toImagekitUrl } from '../../imagekit';
import { useCompetitionStore } from '../../store';

const CompetitionScreen = () => {
  const selectedCompetition = useCompetitionStore(
    (state) => state.selectedCompetition,
  );
  const error = useCompetitionStore((state) => state.getCompetitionError);

  const fetchSelectedCompetition = useCompetitionStore(
    (state) => state.fetchSelectedCompetition,
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isErrorVisible, setIsErrorVisible] = useState(false);

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
          <View className="flex flex-col items-center">
            {selectedCompetition?.image_url && (
              <Image
                className="object-contain rounded-lg h-32 w-32"
                source={{
                  uri: toImagekitUrl(selectedCompetition.image_url, [
                    { height: '256', width: '256' },
                  ]),
                }}
              />
            )}
            <Text className="text-2xl font-bold">
              {selectedCompetition?.description}
            </Text>
            <Text className="text-gray-700 dark:text-gray-500">
              {selectedCompetition?.city}, {selectedCompetition?.country}
            </Text>
          </View>
        }
        withBackButton
      >
        {selectedCompetition?.acts && selectedCompetition.acts.length > 0 && (
          <FlatList
            renderItem={({ item }) => <ActCard key={item.id} act={item} />}
            data={selectedCompetition.acts}
            contentContainerClassName="gap-2"
            refreshControl={
              <RefreshControl
                onRefresh={onRefresh}
                refreshing={isRefreshing}
                tintColor={color.primary}
              />
            }
          />
        )}
      </HeaderLayout>
      {isErrorVisible && (
        <HttpErrorModal
          httpError={error}
          isVisible={isErrorVisible}
          onClose={() => setIsErrorVisible(false)}
        />
      )}
    </>
  );
};

export default CompetitionScreen;
