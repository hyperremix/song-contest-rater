import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Image, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Text } from './Text';

export type Props = TouchableOpacityProps & {
  src?: string;
  name?: string;
};

export const Avatar = ({ src, className, name, ...props }: Props) => {
  const initials = useMemo(() => {
    if (!name) {
      return undefined;
    }
    const nameParts = name.split(' ');
    if (nameParts.length < 2) {
      return undefined;
    }

    const firstname = nameParts[0];
    const lastname = nameParts[nameParts.length - 1];

    return `${firstname[0]}${lastname ? lastname[0] : ''}`;
  }, [name]);

  return (
    <TouchableOpacity
      className={`rounded-full bg-gray-500 size-12 flex justify-center items-center ${className}`}
      {...props}
    >
      {src ? (
        <Image source={{ uri: src }} className="size-12 rounded-full" />
      ) : initials ? (
        <Text className="font-extrabold text-lg text-black">{initials}</Text>
      ) : (
        <Ionicons name="person" size={32} color="white" />
      )}
    </TouchableOpacity>
  );
};
