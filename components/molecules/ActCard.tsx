import { useRouter } from 'expo-router';
import { Image, TouchableOpacity, View, ViewProps } from 'react-native';
import { toImagekitUrl } from '../../imagekit';
import { ActResponse } from '../../protos/act';
import { useActStore } from '../../store';
import { useRatingStore } from '../../store/rating';
import { ratingSum } from '../../utils/rating';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';

type Props = ViewProps & {
  act: ActResponse;
};

export const ActCard = ({ act, ...props }: Props) => {
  const router = useRouter();
  const setSelectedAct = useActStore((state) => state.setSelectedAct);
  const setRatings = useRatingStore((state) => state.setRatings);

  const handlePress = () => {
    router.navigate(`/competitions/acts/${act.id}`);
    setSelectedAct(act);
    setRatings(act.ratings);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Card {...props}>
        <View className="flex flex-row">
          <View className="absolute top-0 right-0 p-2 rounded-tr-md rounded-bl-md w-11 flex flex-col items-center bg-primary">
            <Text className="text-white text-xl font-bold">
              {ratingSum(act.ratings)}
            </Text>
          </View>
          {act.image_url && (
            <Image
              className="object-contain rounded-l-lg min-h-full w-32"
              source={{
                uri: toImagekitUrl(act.image_url, [
                  { height: '512', width: '512' },
                ]),
              }}
            />
          )}
          <View className="flex flex-col p-4 gap-2">
            <Text className="text-2xl font-bold">{act.song_name}</Text>
            <Text>{act.artist_name}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};
