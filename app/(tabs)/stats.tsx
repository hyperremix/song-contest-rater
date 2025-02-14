import React, { useEffect, useMemo, useState } from 'react';
import { RefreshControl, SectionList, View } from 'react-native';
import { Text } from '../../components/atoms/Text';
import { HeaderLayout } from '../../components/Layouts/HeaderLayout';
import { HttpErrorModal } from '../../components/molecules/HttpErrorModal';
import { LoadingCard } from '../../components/molecules/LoadingCard';
import { StatisticsCard } from '../../components/molecules/StatisticsCard';
import { color } from '../../constants/color';
import { t } from '../../i18n';
import { translations } from '../../i18n/translations';
import { useStatsStore } from '../../store/stats';
import { splitStats } from '../../utils/stats/splitStats';

const StatsScreen = () => {
  const userStats = useStatsStore((state) => state.userStats);
  const fetchUserStats = useStatsStore((state) => state.fetchUserStats);
  const isFetchUserStatsLoading = useStatsStore(
    (state) => state.isFetchUserStatsLoading,
  );
  const fetchUserStatsError = useStatsStore(
    (state) => state.fetchUserStatsError,
  );
  const confirmFetchUserStatsError = useStatsStore(
    (state) => state.confirmFetchUserStatsError,
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

  const [isRefreshing, setIsRefreshing] = useState(false);

  const statsSections = useMemo(() => splitStats(userStats), [userStats]);

  useEffect(() => {
    fetchUserStats();
    fetchGlobalStats();
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchUserStats();
    await fetchGlobalStats();
    setIsRefreshing(false);
  };

  return (
    <>
      <HeaderLayout
        headerContent={
          <Text className="text-2xl font-bold">
            {t(translations.statistics.statsScreenTitle)}
          </Text>
        }
        withBackButton
      >
        {isFetchUserStatsLoading ||
          (isFetchGlobalStatsLoading ? (
            [0, 1, 2, 3, 4].map((i) => <LoadingCard key={i} />)
          ) : (
            <SectionList
              sections={statsSections}
              renderItem={({ item }) => (
                <StatisticsCard
                  key={item.user?.id}
                  userStats={item}
                  globalStats={globalStats}
                />
              )}
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
          ))}
      </HeaderLayout>
      {fetchUserStatsError && (
        <HttpErrorModal
          isVisible={!!fetchUserStatsError}
          onClose={confirmFetchUserStatsError}
          httpError={fetchUserStatsError}
        />
      )}
      {fetchGlobalStatsError && (
        <HttpErrorModal
          isVisible={!!fetchGlobalStatsError}
          onClose={confirmFetchGlobalStatsError}
          httpError={fetchGlobalStatsError}
        />
      )}
    </>
  );
};

export default StatsScreen;
