import { useState } from 'react';
import { Image, View } from 'react-native';
import { t, translations } from '../../i18n';
import { toImagekitUrl } from '../../imagekit';
import { UserResponse } from '../../protos/user';
import { useUserStore } from '../../store';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Modal, ModalProps } from './Modal';

type Props = ModalProps & {
  user: UserResponse;
};

export const UpdateUserModal = ({ user, onClose, ...props }: Props) => {
  const updateUser = useUserStore((state) => state.updateUser);

  const isUpdateUserLoading = useUserStore(
    (state) => state.isUpdateUserLoading,
  );

  const [firstName, setFirstName] = useState(user?.firstname ?? '');
  const [lastName, setLastName] = useState(user?.lastname ?? '');
  const [imageUrl, setImageUrl] = useState(user?.image_url ?? '');

  const handleSave = () => {
    updateUser({
      id: user.id,
      firstname: firstName,
      lastname: lastName,
      image_url: imageUrl,
    });
    onClose();
  };

  return (
    <Modal {...props} onClose={onClose}>
      <Input
        label={t(translations.user.firstNameInputLabel)}
        value={firstName}
        onChangeText={setFirstName}
      />
      <Input
        label={t(translations.user.lastNameInputLabel)}
        value={lastName}
        onChangeText={setLastName}
      />
      <Input
        label={t(translations.user.imageUrlInputLabel)}
        value={imageUrl}
        onChangeText={setImageUrl}
      />
      {imageUrl && (
        <Image
          className="object-contain rounded-lg h-32 w-32"
          source={{
            uri: toImagekitUrl(imageUrl, [
              { height: '128', width: '128', focus: 'auto' },
            ]),
          }}
        />
      )}
      <View className="flex flex-row items-center gap-2 mt-6">
        <Button
          label={t(translations.user.updateProfileButtonLabel)}
          onPress={handleSave}
          isLoading={isUpdateUserLoading}
          className="grow"
        />
      </View>
    </Modal>
  );
};
