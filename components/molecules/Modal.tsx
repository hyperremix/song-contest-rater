import { Modal as RNModal, View, ViewProps } from 'react-native';
import { Card } from '../atoms/Card';
import { IconButton } from '../atoms/IconButton';

export type ModalProps = ViewProps & {
  isVisible: boolean;
  onClose: () => void;
};

export const Modal = ({
  children,
  className,
  isVisible,
  onClose,
  ...props
}: ModalProps) => (
  <RNModal
    animationType="fade"
    transparent={true}
    visible={isVisible}
    onRequestClose={onClose}
  >
    <View
      className="flex-1 justify-center items-center p-2"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
      }}
    >
      <Card className="p-4 w-full max-w-2xl" {...props}>
        <View className="absolute top-0 right-0 z-10">
          <IconButton icon="xmark" onPress={onClose} variant="text" />
        </View>
        <View className={`min-w-full flex flex-col gap-4 ${className}`}>
          {children}
        </View>
      </Card>
    </View>
  </RNModal>
);
