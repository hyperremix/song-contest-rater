import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from '../../../components/atoms/Button';
import { Card } from '../../../components/atoms/Card';
import { Text } from '../../../components/atoms/Text';
import { HeaderLayout } from '../../../components/Layouts/HeaderLayout';
import { HttpErrorModal } from '../../../components/molecules/HttpErrorModal';
import { LoadingCard } from '../../../components/molecules/LoadingCard';
import { StatisticsCard } from '../../../components/molecules/StatisticsCard';
import { UpdateUserModal } from '../../../components/molecules/UpdateUserModal';
import { UploadProfilePictureModal } from '../../../components/molecules/UploadProfilePictureModal';
import { color } from '../../../constants/color';
import { t, translations } from '../../../i18n';
import { toImagekitUrl } from '../../../imagekit';
import { useUserStore } from '../../../store';
import { useStatsStore } from '../../../store/stats';
import { Permission } from '../../../utils/auth';

const UserScreen = () => {
  const appUser = useUserStore((state) => state.appUser);
  const selectedUser = useUserStore((state) => state.selectedUser);
  const fetchSelectedUserError = useUserStore(
    (state) => state.fetchSelectedUserError,
  );
  const confirmFetchSelectedUserError = useUserStore(
    (state) => state.confirmFetchSelectedUserError,
  );
  const authData = useUserStore((state) => state.authData);
  const hasPermission = useUserStore((state) => state.hasPermission);
  const params = useLocalSearchParams();
  const fetchSelectedUser = useUserStore((state) => state.fetchSelectedUser);
  const isFetchSelectedUserLoading = useUserStore(
    (state) => state.isFetchSelectedUserLoading,
  );
  const appUserStats = useStatsStore((state) => state.appUserStats);
  const fetchAppUserStats = useStatsStore((state) => state.fetchAppUserStats);
  const isFetchAppUserStatsLoading = useStatsStore(
    (state) => state.isFetchAppUserStatsLoading,
  );
  const fetchAppUserStatsError = useStatsStore(
    (state) => state.fetchAppUserStatsError,
  );
  const confirmFetchAppUserStatsError = useStatsStore(
    (state) => state.confirmFetchAppUserStatsError,
  );

  const globalStats = useStatsStore((state) => state.globalStats);
  const fetchGlobalStats = useStatsStore((state) => state.fetchGlobalStats);
  const isFetchGlobalStatsLoading = useStatsStore(
    (state) => state.isFetchGlobalStatsLoading,
  );
  const fetchGlobalStatsError = useStatsStore(
    (state) => state.fetchGlobalStatsError,
  );
  const confirmFetchGlobalStatsError = useStatsStore(
    (state) => state.confirmFetchGlobalStatsError,
  );

  const [isUpdateUserModalVisible, setIsUpdateUserModalVisible] =
    useState(false);
  const [
    isUploadProfilePictureModalVisible,
    setIsUploadProfilePictureModalVisible,
  ] = useState(false);

  const canEditUser = useMemo(
    () => hasPermission(Permission.WriteUsers) || appUser?.id === params.userId,
    [authData],
  );

  useEffect(() => {
    fetchSelectedUser(params.userId as string);
    fetchAppUserStats();
    fetchGlobalStats();
  }, []);

  return (
    <>
      <HeaderLayout
        headerContent={
          <View>
            {isFetchSelectedUserLoading && (
              <ActivityIndicator
                color={color.primary}
                size="large"
                className="absolute flex items-center justify-center h-full w-full z-10"
              />
            )}
            <View
              className={`flex flex-col items-center ${isFetchSelectedUserLoading ? 'opacity-0' : ''}`}
            >
              {selectedUser?.image_url && (
                <Image
                  className="object-contain rounded-lg h-32 w-32"
                  source={{
                    uri: toImagekitUrl(selectedUser.image_url, [
                      { height: '256', width: '256', focus: 'auto' },
                    ]),
                  }}
                />
              )}
              <Text className="text-2xl font-bold">
                {selectedUser?.firstname} {selectedUser?.lastname}
              </Text>
              <Text className="text-gray-700 dark:text-gray-500">
                {selectedUser?.email}
              </Text>
            </View>
          </View>
        }
        withBackButton
      >
        <ScrollView className="flex-1 flex-col items-stretch gap-2">
          {isFetchSelectedUserLoading ? (
            <View className="flex flex-col gap-2">
              {[0].map((i) => (
                <LoadingCard key={i} />
              ))}
            </View>
          ) : (
            <View className="flex flex-col gap-2">
              <Text className="text-lg font-bold">
                {t(translations.user.personalInformationTitle)}
              </Text>
              <Card className="flex flex-col gap-2 p-4">
                <View className="flex flex-row gap-2">
                  <Text className="font-bold">
                    {t(translations.user.firstNameInputLabel)}:
                  </Text>
                  <Text>{selectedUser?.firstname}</Text>
                </View>
                <View className="flex flex-row gap-2">
                  <Text className="font-bold">
                    {t(translations.user.lastNameInputLabel)}:
                  </Text>
                  <Text>{selectedUser?.lastname}</Text>
                </View>
                <View className="flex flex-row gap-2">
                  <Text className="font-bold">
                    {t(translations.user.emailInputLabel)}:
                  </Text>
                  <Text>{selectedUser?.email}</Text>
                </View>
                {canEditUser && (
                  <Button
                    label={t(translations.user.editProfileButtonLabel)}
                    className="mt-4"
                    onPress={() => setIsUpdateUserModalVisible(true)}
                  />
                )}
              </Card>
              <Text className="text-lg font-bold">
                {t(translations.user.profilePictureLabel)}
              </Text>
              <Card className="flex flex-col gap-2 p-4">
                <Image
                  className="object-contain rounded-lg h-32 w-32"
                  source={{
                    uri: toImagekitUrl(selectedUser?.image_url, [
                      { height: '256', width: '256', focus: 'auto' },
                    ]),
                  }}
                />
                {canEditUser && (
                  <Button
                    label={t(translations.user.editProfileButtonLabel)}
                    className="mt-4"
                    onPress={() => setIsUploadProfilePictureModalVisible(true)}
                  />
                )}
              </Card>
              {isFetchAppUserStatsLoading ||
                (isFetchGlobalStatsLoading && <LoadingCard />)}
              {appUserStats && globalStats && (
                <>
                  <Text className="text-lg font-bold">
                    {t(translations.statistics.criticTypeTitle)}
                  </Text>
                  <StatisticsCard
                    userStats={appUserStats}
                    globalStats={globalStats}
                  />
                </>
              )}
            </View>
          )}
        </ScrollView>
      </HeaderLayout>
      {!!fetchSelectedUserError && (
        <HttpErrorModal
          httpError={fetchSelectedUserError}
          isVisible={!!fetchSelectedUserError}
          onClose={confirmFetchSelectedUserError}
        />
      )}
      {fetchAppUserStatsError && (
        <HttpErrorModal
          httpError={fetchAppUserStatsError}
          isVisible={!!fetchAppUserStatsError}
          onClose={confirmFetchAppUserStatsError}
        />
      )}
      {fetchGlobalStatsError && (
        <HttpErrorModal
          httpError={fetchGlobalStatsError}
          isVisible={!!fetchGlobalStatsError}
          onClose={confirmFetchGlobalStatsError}
        />
      )}
      {isUploadProfilePictureModalVisible && selectedUser && (
        <UploadProfilePictureModal
          user={selectedUser}
          isVisible={isUploadProfilePictureModalVisible}
          onClose={() => setIsUploadProfilePictureModalVisible(false)}
        />
      )}
      {isUpdateUserModalVisible && selectedUser && (
        <UpdateUserModal
          user={selectedUser}
          isVisible={isUpdateUserModalVisible}
          onClose={() => setIsUpdateUserModalVisible(false)}
        />
      )}
    </>
  );
};

export default UserScreen;
