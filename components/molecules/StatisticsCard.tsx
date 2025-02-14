import { FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { View } from 'react-native';
import colors from 'tailwindcss/colors';
import { color } from '../../constants/color';
import { t } from '../../i18n';
import { translations } from '../../i18n/translations';
import { GlobalStatsResponse, UserStatsResponse } from '../../protos/stat';
import { Avatar } from '../atoms/Avatar';
import { Text } from '../atoms/Text';

type Props = {
  userStats: UserStatsResponse;
  globalStats: GlobalStatsResponse | null;
};

const criticTypeToIconMap: Record<number, ReactNode> = {
  0: (
    <View className="flex flex-row items-center gap-2">
      <View className="bg-zinc-500 rounded-lg p-2">
        <FontAwesome6 name="question" size={32} color="white" />
      </View>
      <Text className="text-sm opacity-70">
        {t(translations.statistics.criticType[0])}
      </Text>
    </View>
  ),
  1: (
    <View className="flex flex-row items-center gap-2">
      <View className="bg-red-500 rounded-lg p-2">
        <FontAwesome6 name="angry" size={32} color="white" />
      </View>
      <Text className="text-sm opacity-70">
        {t(translations.statistics.criticType[1])}
      </Text>
    </View>
  ),
  2: (
    <View className="flex flex-row items-center gap-2">
      <View className="bg-amber-500 rounded-lg p-2">
        <FontAwesome6 name="face-frown" size={32} color="white" />
      </View>
      <Text className="text-sm opacity-70">
        {t(translations.statistics.criticType[2])}
      </Text>
    </View>
  ),
  3: (
    <View className="flex flex-row items-center gap-2">
      <View className="bg-zinc-500 rounded-lg p-2">
        <FontAwesome name="balance-scale" size={32} color="white" />
      </View>
      <Text className="text-sm opacity-70">
        {t(translations.statistics.criticType[3])}
      </Text>
    </View>
  ),
  4: (
    <View className="flex flex-row items-center gap-2">
      <View className="bg-green-500 rounded-lg p-2">
        <FontAwesome6 name="smile-beam" size={32} color="white" />
      </View>
      <Text className="text-sm opacity-70">
        {t(translations.statistics.criticType[4])}
      </Text>
    </View>
  ),
  5: (
    <View className="flex flex-row items-center gap-2">
      <View className="bg-primary rounded-lg p-2">
        <FontAwesome6 name="grin-hearts" size={32} color="white" />
      </View>
      <Text className="text-sm opacity-70">
        {t(translations.statistics.criticType[5])}
      </Text>
    </View>
  ),
};

const criticTypeToTendencyDisplayMap: Record<
  number,
  (ratingBias: number) => ReactNode
> = {
  0: (ratingBias: number) => (
    <View className="flex flex-row items-center gap-2">
      <Text className="text-xl font-bold">{ratingBias}</Text>
      <View className="w-2 h-2 rounded-full bg-zinc-500" />
    </View>
  ),
  1: (ratingBias: number) => (
    <View className="flex flex-row items-center gap-2">
      <Text className="text-xl font-bold">{ratingBias}</Text>
      <Ionicons name="trending-down" size={20} color={colors.red[500]} />
    </View>
  ),
  2: (ratingBias: number) => (
    <View className="flex flex-row items-center gap-2">
      <Text className="text-xl font-bold">{ratingBias}</Text>
      <Ionicons name="trending-down" size={20} color={colors.amber[500]} />
    </View>
  ),
  3: (ratingBias: number) => (
    <View className="flex flex-row items-center gap-2">
      <Text className="text-xl font-bold">{ratingBias}</Text>
      <FontAwesome6 name="equals" size={20} color={colors.zinc[500]} />
    </View>
  ),
  4: (ratingBias: number) => (
    <View className="flex flex-row items-center gap-2">
      <Text className="text-xl font-bold">{ratingBias}</Text>
      <Ionicons name="trending-up" size={20} color={colors.green[500]} />
    </View>
  ),
  5: (ratingBias: number) => (
    <View className="flex flex-row items-center gap-2">
      <Text className="text-xl font-bold">{ratingBias}</Text>
      <Ionicons name="trending-up" size={20} color={color.primary} />
    </View>
  ),
};

export const StatisticsCard = ({ userStats, globalStats }: Props) => {
  return (
    <View className="flex flex-col gap-2 bg-white dark:bg-zinc-900 rounded-xl p-4">
      <View className="flex flex-row justify-between">
        <View className="flex flex-row justify-between items-center">
          {criticTypeToIconMap[userStats.critic_type]}
        </View>
        <View className="flex flex-row items-center gap-2">
          <Text className="text-sm">
            {userStats.user?.firstname} {userStats.user?.lastname}
          </Text>
          <Avatar src={userStats.user?.image_url} />
        </View>
      </View>
      {criticTypeToTendencyDisplayMap[userStats.critic_type](
        userStats.rating_bias ?? 0,
      )}
      <View className="flex flex-row gap-6">
        <View className="flex flex-col gap-2 mt-1">
          <Text className="text-sm opacity-70">
            {t(translations.statistics.ratingsCountLabel)}
          </Text>
          <View className="py-3 px-3 bg-zinc-100 dark:bg-zinc-700 rounded-lg">
            <Text className="text-center text-2xl font-bold">
              {userStats.total_ratings}
            </Text>
          </View>
        </View>
        <View className="flex-1 flex-col gap-2">
          <View>
            <View className="flex flex-row items-center justify-between">
              <Text className="text-sm opacity-70">
                {t(translations.statistics.ratingAvgLabel)}
              </Text>
              <Text className="text-xl font-bold">
                {userStats.user_rating_avg}
              </Text>
            </View>
            <View className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-1">
              <View
                className="flex flex-row items-center justify-center h-full bg-blue-500 rounded-full"
                style={{ width: `${(userStats.user_rating_avg / 75) * 100}%` }}
              />
            </View>
          </View>
          <View>
            <View className="flex flex-row items-center justify-between">
              <Text className="text-sm opacity-70">
                {t(translations.statistics.globalRatingAvgLabel)}
              </Text>
              <Text className="text-xl font-bold">
                {globalStats?.global_rating_avg}
              </Text>
            </View>
            <View className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-1">
              <View
                className="h-full bg-purple-500 rounded-full"
                style={{
                  width: `${((globalStats?.global_rating_avg ?? 0) / 75) * 100}%`,
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
