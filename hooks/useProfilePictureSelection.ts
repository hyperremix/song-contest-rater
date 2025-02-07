import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { extensionMimes } from '../utils/image/extension';

export type ProfilePictureSelection = {
  uri: string;
  blob: Blob;
  mime: string;
};

export const useProfilePictureSelection = () => {
  const [selection, setSelection] = useState<
    ProfilePictureSelection | undefined
  >(undefined);

  const handleChooseProfilePicture = useCallback(async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      allowsMultipleSelection: false,
      quality: 0.7,
      base64: true,
    });

    const asset = result?.assets?.[0];
    if (!asset) {
      Alert.alert('No image selected', 'Please select an image');
      return;
    }

    if (asset.fileSize && asset.fileSize > 4 * 1024 * 1024) {
      Alert.alert('File too large', 'Please select a file smaller than 4MB');
      return;
    }

    if (!(!result.canceled && asset.base64 && asset.mimeType)) {
      Alert.alert('No image selected', 'Please select an image');
      return;
    }

    const dataURI = toDataURI(asset.base64, asset.mimeType);
    const compressedResult = await manipulateAsync(
      dataURI,
      [{ resize: { width: 500 } }],
      {
        compress: 0.7,
        format: SaveFormat.JPEG,
        base64: true,
      },
    );

    if (!compressedResult.base64) {
      Alert.alert('No image selected', 'Please select an image');
      return;
    }

    const response = await fetch(compressedResult.uri);
    const blob = await response.blob();
    const mime = extensionMimes[SaveFormat.JPEG];

    setSelection({
      uri: toDataURI(compressedResult.base64, asset.mimeType),
      blob,
      mime,
    });
  }, []);

  return {
    selection,
    handleChooseProfilePicture,
  };
};

const toDataURI = (base64: string, mime: string): string =>
  `data:${mime};base64,${base64}`;
