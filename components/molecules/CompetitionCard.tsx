import { useRouter } from 'expo-router';
import { Image, TouchableOpacity, View, ViewProps } from 'react-native';
import { toImagekitUrl } from '../../imagekit';
import { CompetitionResponse } from '../../protos/competition';
import { useCompetitionStore } from '../../store';
import { FormatDate } from '../../utils/dayjs';
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

  return (
    <TouchableOpacity onPress={handlePress}>
      <Card {...props}>
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
