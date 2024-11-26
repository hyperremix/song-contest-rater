import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Image, TouchableOpacity, TouchableOpacityProps } from 'react-native';
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
  ...props
}: Props) => {
  const initials = useMemo(() => {
    const { firstname, lastname } = extractNames(name);
    return `${firstname[0]}${lastname[0]}`;
  }, [name]);

  return (
    <TouchableOpacity
      className={`rounded-full bg-gray-500 ${size} flex justify-center items-center ${className}`}
      {...props}
    >
      {src ? (
        <Image
          source={{
            uri: toImagekitUrl(src, [{ height: '128', width: '128' }]),
          }}
          className={`${size} rounded-full`}
        />
      ) : initials ? (
        <Text className="font-extrabold text-lg text-black">{initials}</Text>
      ) : (
        <Ionicons name="person" size={32} color="white" />
      )}
    </TouchableOpacity>
  );
};
