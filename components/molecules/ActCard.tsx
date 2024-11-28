import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Image, TouchableOpacity, View, ViewProps } from 'react-native';
import { toImagekitUrl } from '../../imagekit';
import { ActResponse } from '../../protos/act';
import { useActStore } from '../../store';
import { useRatingStore } from '../../store/rating';
import { ratingSum } from '../../utils/rating';
import { Avatar } from '../atoms/Avatar';
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

  const actRaters = useMemo(() => {
    if (!act.ratings || act.ratings.length === 0) {
      return [];
    }

    const actRaters = act.ratings?.map((r) => r.user).slice(0, 3);

    if (actRaters.length > 3) {
      actRaters.unshift({
        id: 'more',
        firstname: '+',
        lastname: `${actRaters.length - 3}`,
      } as any);
    }

    return actRaters;
  }, [act]);

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
              className="object-contain rounded-l-lg min-h-fit w-28 aspect-square"
              source={{
                uri: toImagekitUrl(act.image_url, [
                  {
                    height: '256',
                    width: '256',
                    cropMode: 'pad_resize',
                  },
                ]),
              }}
            />
          )}
          <View className="flex flex-col items-stretch grow p-4 gap-2 w-0">
            <Text className="text-2xl font-bold pr-16">{act.song_name}</Text>
            <View className="flex flex-row justify-between items-start">
              <Text className="flex-shrink">{act.artist_name}</Text>
              <View className="flex flex-row-reverse mr-3">
                {actRaters.map((user) => (
                  <Avatar
                    key={user?.id}
                    src={user?.image_url}
                    name={`${user?.firstname} ${user?.lastname}`}
                    size="size-10"
                    className="-mr-3 border-2 border-white dark:border-zinc-800"
                  />
                ))}
              </View>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};
