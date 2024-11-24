import { Ionicons } from '@expo/vector-icons';
import { View, ViewProps } from 'react-native';
import { Text } from '../atoms/Text';

type RatingProps = ViewProps & {
  rating: number;
  color?: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export const Rating = ({
  rating,
  icon,
  color,
  className,
  ...props
}: RatingProps) => {
  return (
    <View
      className={`flex items-center gap-0.5 rounded-md p-1.5 ${className}`}
      {...props}
    >
      <Ionicons name={icon} size={24} color="white" />
      <Text className="text-white">{rating}</Text>
    </View>
  );
};
