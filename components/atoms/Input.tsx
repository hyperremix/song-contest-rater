import { useColorScheme } from 'nativewind';
import { TextInput, TextInputProps, View } from 'react-native';
import colors from 'tailwindcss/colors';
import { color } from '../../constants/color';
import { Text } from './Text';

type Props = Omit<TextInputProps, 'placeholder'> & {
  label: string;
};

export const Input = ({ label, className, ...props }: Props) => {
  const { colorScheme } = useColorScheme();
  return (
    <View className={`flex flex-col gap-1 ${className}`}>
      <Text className="text-lg">{label}</Text>
      <TextInput
        className="p-3 rounded-md text-black dark:text-white border border-black dark:border-white"
        placeholderTextColor={
          colorScheme === 'dark' ? colors.zinc[500] : colors.zinc[600]
        }
        cursorColor={color.primary}
        placeholder={label}
        {...props}
      />
    </View>
  );
};
