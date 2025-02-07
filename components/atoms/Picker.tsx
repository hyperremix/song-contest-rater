import { PickerProps, Picker as RNPicker } from '@react-native-picker/picker';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import colors from 'tailwindcss/colors';
import { Text } from './Text';

export type TPickerData = { label: string; value: string };

type Props = PickerProps & {
  label?: string;
  data: TPickerData[];
};

export const Picker = ({ label, data, className, ...props }: Props) => {
  const { colorScheme } = useColorScheme();

  return (
    <View className={`flex flex-col gap-1 ${className}`}>
      {label && <Text className="text-lg">{label}</Text>}
      <RNPicker
        className="bg-white dark:bg-zinc-900 text-black dark:text-white border border-black dark:border-white rounded-md p-3"
        placeholder={label}
        dropdownIconColor={colorScheme === 'dark' ? 'white' : 'black'}
        {...props}
      >
        {data.map(({ label, value }) => (
          <RNPicker.Item
            style={{
              color: colorScheme === 'dark' ? 'white' : 'black',
              backgroundColor:
                colorScheme === 'dark' ? colors.zinc[900] : 'white',
            }}
            key={value}
            label={label}
            value={value}
            enabled={value !== 'none'}
          />
        ))}
      </RNPicker>
    </View>
  );
};
