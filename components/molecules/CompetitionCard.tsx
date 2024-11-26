import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Image,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import colors from 'tailwindcss/colors';
import { t, translations } from '../../i18n';
import { toImagekitUrl } from '../../imagekit';
import { CompetitionResponse } from '../../protos/competition';
import { useCompetitionStore } from '../../store';
import {
  FormatDate,
  isAfterNow,
  nowIsBetweenTimestampTodayAndEndOfDay,
} from '../../utils/dayjs';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';

type Props = ViewProps & {
  competition: CompetitionResponse;
};

export const CompetitionCard = ({ competition, ...props }: Props) => {
  const fetchSelectedCompetition = useCompetitionStore(
    (state) => state.fetchSelectedCompetition,
  );
  const router = useRouter();

  const handlePress = () => {
    fetchSelectedCompetition(competition.id);
    router.navigate(`/competitions/${competition.id}`);
  };

  const isCompetitionStarted = useMemo(
    () => !isAfterNow(competition.start_time),
    [competition],
  );

  const anim = useRef(new Animated.Value(1));

  const isCompetitionLive = useMemo(
    () => nowIsBetweenTimestampTodayAndEndOfDay(competition.start_time),
    [competition],
  );

  useEffect(
    () =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim.current, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(anim.current, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
        ]),
      ).start(),
    [],
  );

  return (
    <TouchableOpacity onPress={handlePress} disabled={!isCompetitionStarted}>
      <Card {...props}>
        {!isCompetitionStarted && (
          <View className="absolute w-full h-full rounded-md flex items-center justify-center bg-black/50 z-10">
            <View className="flex flex-row items-center">
              <Ionicons name="time" size={24} color="white" />
              <Text className="text-white">
                {t(translations.competition.competitionNotYetStartedText)}
              </Text>
            </View>
          </View>
        )}
        {isCompetitionLive && (
          <View className="absolute top-2 right-3 flex flex-row items-center gap-1">
            <Animated.View style={{ transform: [{ scale: anim.current }] }}>
              <Ionicons name="ellipse" size={16} color={colors.red[500]} />
            </Animated.View>
            <Text className="text-red-500 dark:text-red-500">
              {t(translations.competition.competitionLiveText)}
            </Text>
          </View>
        )}
        <View className="flex flex-row">
          {competition.image_url && (
            <Image
              className="object-contain rounded-l-lg min-h-full w-32"
              source={{
                uri: toImagekitUrl(competition.image_url, [
                  { height: '512', width: '512' },
                ]),
              }}
            />
          )}
          <View className="flex flex-col p-4 gap-2">
            <Text className="text-2xl font-bold">
              {competition.description}
            </Text>
            <Text className="text-gray-700 dark:text-gray-500">
              {competition.city}, {competition.country}
            </Text>
            <Text className="text-gray-700 dark:text-gray-500">
              {FormatDate(competition.start_time)}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};
