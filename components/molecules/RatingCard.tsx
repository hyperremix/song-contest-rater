import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import { TouchableOpacity, View, ViewProps } from 'react-native';
import { RatingResponse } from '../../protos/rating';
import { useUserStore } from '../../store';
import { Avatar } from '../atoms/Avatar';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';
import { Rating } from './Rating';
import { UpsertRatingModal } from './UpsertRatingModal';

type Props = ViewProps & {
  rating: RatingResponse;
};

export const RatingCard = ({ rating, ...props }: Props) => {
  const user = useUserStore((state) => state.appUser);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const { colorScheme } = useColorScheme();

  const component = (
    <>
      <Card {...props}>
        <View className="flex flex-col p-4 gap-4">
          <View className="flex flex-row items-center justify-center gap-4">
            <Rating
              rating={rating.song}
              icon="musical-notes"
              className="bg-red-500"
            />
            <Rating
              rating={rating.singing}
              icon="mic"
              className="bg-orange-500"
            />
            <Rating rating={rating.show} icon="star" className="bg-green-500" />
            <Rating rating={rating.looks} icon="eye" className="bg-blue-500" />
            <Rating
              rating={rating.clothes}
              icon="shirt"
              className="bg-purple-500"
            />
          </View>
          <View className="absolute top-0 right-0 flex flex-col items-center">
            <View className="p-2 rounded-tr-md rounded-bl-md w-11 flex flex-col items-center bg-primary">
              <Text className="text-white text-xl font-bold">
                {rating.total}
              </Text>
            </View>
            {user?.id === rating.user?.id && (
              <Ionicons
                name="pencil"
                className="p-2"
                size={20}
                color={colorScheme === 'dark' ? 'white' : 'black'}
              />
            )}
          </View>
          <View className="flex flex-row items-center justify-end gap-2">
            <Avatar
              src={rating.user?.image_url}
              name={`${rating.user?.firstname} ${rating.user?.lastname}`}
              size="size-8"
            />
            <Text className="text-sm">
              {rating.user?.firstname} {rating.user?.lastname}
            </Text>
          </View>
        </View>
      </Card>
    </>
  );

  if (user?.id === rating.user?.id) {
    return (
      <>
        <TouchableOpacity onPress={() => setIsEditModalVisible(true)}>
          {component}
        </TouchableOpacity>
        {isEditModalVisible && (
          <UpsertRatingModal
            isVisible={isEditModalVisible}
            onClose={() => setIsEditModalVisible(false)}
            rating={rating}
          />
        )}
      </>
    );
  }

  return component;
};
