import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  Image,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { toImagekitUrl } from '../../imagekit';
import { extractNames } from '../../utils/extractNames';
import { Text } from './Text';

export type Props = TouchableOpacityProps & {
  src?: string;
  name?: string;
  size?: string;
};

export const Avatar = ({
  src,
  className,
  name,
  size = 'size-12',
  onPress,
  ...props
}: Props) => {
  const initials = useMemo(() => {
    const { firstname, lastname } = extractNames(name);
    return `${firstname[0]}${lastname[0]}`;
  }, [name]);

  const component = src ? (
    <Image
      source={{
        uri: toImagekitUrl(src, [
          { height: '128', width: '128', focus: 'auto' },
        ]),
      }}
      className={`${size} rounded-full ${onPress ? '' : className}`}
    />
  ) : initials ? (
    <View
      className={`flex flex-row items-center justify-center rounded-full bg-gray-500 ${size}`}
    >
      <Text className="text-lg text-black dark:text-black">{initials}</Text>
    </View>
  ) : (
    <Ionicons name="person" size={32} color="white" />
  );

  if (!onPress) {
    return component;
  }

  return (
    <TouchableOpacity
      className={`rounded-full bg-gray-500 ${size} flex justify-center items-center ${className}`}
      onPress={onPress}
      {...props}
    >
      {component}
    </TouchableOpacity>
  );
};
