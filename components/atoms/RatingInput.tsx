import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useColorScheme } from 'nativewind';
import { Platform, View, ViewProps } from 'react-native';
import colors from 'tailwindcss/colors';
import { Text } from './Text';

type Props = ViewProps & {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  value: number;
  setValue: (value: number) => void;
};

export const RatingInput = ({
  icon,
  label,
  color,
  value,
  setValue,
  className,
  ...props
}: Props) => {
  const { colorScheme } = useColorScheme();

  return (
    <View
      className={`flex flex-col items-stretch gap-2 ${className}`}
      {...props}
    >
      <View className="flex flex-row items-center gap-1">
        <Ionicons name={icon} size={24} color={color} />
        <Text className="text-lg">
          {label}: {value}
        </Text>
      </View>
      <Slider
        value={value}
        minimumValue={1}
        maximumValue={15}
        step={1}
        minimumTrackTintColor={color}
        thumbTintColor={color}
        maximumTrackTintColor={
          colorScheme === 'dark' ? colors.zinc[300] : colors.zinc[400]
        }
        onValueChange={Platform.OS === 'android' ? undefined : setValue}
        onSlidingComplete={Platform.OS === 'android' ? setValue : undefined}
      />
    </View>
  );
};
