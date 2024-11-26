import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Image, TouchableOpacity, View, ViewProps } from 'react-native';
import { t, translations } from '../../i18n';
import { toImagekitUrl } from '../../imagekit';
import { CompetitionResponse } from '../../protos/competition';
import { useCompetitionStore } from '../../store';
import { FormatDate, isAfterNow } from '../../utils/dayjs';
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
