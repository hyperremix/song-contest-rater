import { Ionicons } from '@expo/vector-icons';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import React from 'react';
import { Image, Modal, Pressable, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import colors from 'tailwindcss/colors';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  baseUri: string;
  zoomableImageUri: string;
};

export const ImageViewer = ({
  isVisible,
  onClose,
  baseUri,
  zoomableImageUri,
}: Props) => {
  return (
    <>
      <Image
        source={{ uri: baseUri }}
        className="w-full h-full rounded-lg"
        resizeMode="contain"
      />
      <Modal visible={isVisible} transparent animationType="fade">
        <GestureHandlerRootView className="flex-1">
          <View className="flex-1 justify-center bg-black/80">
            <Pressable
              onPress={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50"
            >
              <Ionicons name="close" size={24} color={colors.white} />
            </Pressable>

            <ImageZoom uri={zoomableImageUri} isDoubleTapEnabled />
          </View>
        </GestureHandlerRootView>
      </Modal>
    </>
  );
};
