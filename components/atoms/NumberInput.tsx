import { useCallback, useMemo } from 'react';
import { TextInputProps } from 'react-native';
import { Input } from './Input';

export type Props = Omit<
  TextInputProps,
  'placeholder' | 'value' | 'onChangeText' | 'keyboardType' | 'onChange'
> & {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
};

export const NumberInput = ({ label, value, onChange, ...props }: Props) => {
  const stringValue = useMemo(() => value?.toString() ?? '', [value]);

  const handleOnChangeText = useCallback(
    (text: string) => {
      if (text === '') {
        onChange(undefined);
        return;
      }

      const number = Number(text);
      if (!isNaN(number)) {
        onChange(number);
      }
    },
    [onChange],
  );

  return (
    <Input
      label={label}
      keyboardType="numeric"
      value={stringValue}
      onChangeText={handleOnChangeText}
      {...props}
    />
  );
};
