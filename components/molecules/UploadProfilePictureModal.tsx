import { useMemo, useState } from 'react';
import { Image, View } from 'react-native';
import { useProfilePictureSelection } from '../../hooks/useProfilePictureSelection';
import { t, translations } from '../../i18n';
import { toImagekitUrl } from '../../imagekit';
import { UserResponse } from '../../protos/user';
import { useUserStore } from '../../store';
import { mimeToExtension } from '../../utils/image/extension';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Picker } from '../atoms/Picker';
import { Text } from '../atoms/Text';
import { Modal, ModalProps } from './Modal';

type Props = ModalProps & {
  user: UserResponse;
};

type TProfilePictureSource = 'imageUrl' | 'library' | 'none';

export const UploadProfilePictureModal = ({
  user,
  onClose,
  className,
  ...props
}: Props) => {
  const uploadProfilePicture = useUserStore(
    (state) => state.uploadProfilePicture,
  );
  const updateUser = useUserStore((state) => state.updateUser);

  const isUploadProfilePictureLoading = useUserStore(
    (state) => state.isUploadProfilePictureLoading,
  );
  const [profilePictureSource, setProfilePictureSource] =
    useState<TProfilePictureSource>('none');
  const [imageUrl, setImageUrl] = useState<string>(user?.image_url ?? '');

  const { selection, handleChooseProfilePicture } =
    useProfilePictureSelection();

  const profilePictureSourcePickerData = useMemo(
    () => [
      {
        label: t(translations.user.profilePictureSourceNone),
        value: 'none',
      },
      {
        label: t(translations.user.profilePictureSourceImageUrl),
        value: 'imageUrl',
      },
      {
        label: t(translations.user.profilePictureSourceLibrary),
        value: 'library',
      },
    ],
    [],
  );

  const handleSave = () => {
    if (selection) {
      uploadProfilePicture(
        `${user.id}-${new Date().getTime()}.${mimeToExtension(selection.mime)}`,
        selection.blob,
        selection.mime,
      );
    } else if (imageUrl) {
      updateUser({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        image_url: imageUrl,
      });
    }

    onClose();
  };

  return (
    <Modal {...props} onClose={onClose} className={`${className} pt-10`}>
      <Text className="text-2xl font-bold">
        {t(translations.user.updateProfilePictureModalTitle)}
      </Text>
      <Picker
        data={profilePictureSourcePickerData}
        selectedValue={profilePictureSource}
        onValueChange={(value) => {
          setProfilePictureSource(value as TProfilePictureSource);
        }}
      />
      {profilePictureSource === 'library' && (
        <>
          <Button
            leftIcon="images"
            label={t(translations.user.chooseProfilePictureButtonLabel)}
            onPress={handleChooseProfilePicture}
            isLoading={isUploadProfilePictureLoading}
          />
          {selection && (
            <View className="flex flex-row items-center gap-2">
              <Text>{t(translations.user.profilePicturePreviewLabel)}</Text>
              <Image
                className="object-contain rounded-lg h-32 w-32"
                source={{
                  uri: selection.uri,
                }}
              />
            </View>
          )}
        </>
      )}
      {profilePictureSource === 'imageUrl' && (
        <>
          <Input
            label={t(translations.user.imageUrlInputLabel)}
            value={imageUrl}
            onChangeText={setImageUrl}
          />
          {imageUrl && (
            <View className="flex flex-row items-center gap-2">
              <Text>{t(translations.user.profilePicturePreviewLabel)}</Text>
              <Image
                className="object-contain rounded-lg h-32 w-32"
                source={{
                  uri: toImagekitUrl(imageUrl, [
                    { height: '128', width: '128', focus: 'auto' },
                  ]),
                }}
              />
            </View>
          )}
        </>
      )}
      <View className="flex flex-row items-center gap-2 mt-6">
        <Button
          label={t(translations.buttonLabelCancel)}
          onPress={onClose}
          className="grow"
          variant="outlined"
        />
        <Button
          label={t(translations.user.useProfilePictureButtonLabel)}
          onPress={handleSave}
          isLoading={isUploadProfilePictureLoading}
          className="grow"
        />
      </View>
    </Modal>
  );
};
