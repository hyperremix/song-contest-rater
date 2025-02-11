import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { t, translations } from '../../i18n';
import { UserResponse } from '../../protos/user';
import { useUserStore } from '../../store';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { HttpErrorModal } from './HttpErrorModal';
import { Modal, ModalProps } from './Modal';

type Props = ModalProps & {
  user: UserResponse;
};

export const UpdateUserModal = ({ user, onClose, ...props }: Props) => {
  const updateUser = useUserStore((state) => state.updateUser);

  const isUpdateUserLoading = useUserStore(
    (state) => state.isUpdateUserLoading,
  );
  const updateUserError = useUserStore((state) => state.updateUserError);
  const confirmUpdateUserError = useUserStore(
    (state) => state.confirmUpdateUserError,
  );

  const [firstName, setFirstName] = useState(user?.firstname ?? '');
  const [lastName, setLastName] = useState(user?.lastname ?? '');
  const isSaveDisabled = useMemo(
    () => firstName === '' || lastName === '',
    [firstName, lastName],
  );

  const handleSave = () => {
    updateUser({
      id: user.id,
      firstname: firstName,
      lastname: lastName,
      image_url: user.image_url,
    });
    onClose();
  };

  return (
    <>
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
        <View className="flex flex-row items-center gap-2 mt-6">
          <Button
            label={t(translations.user.updateProfileButtonLabel)}
            onPress={handleSave}
            isLoading={isUpdateUserLoading}
            className="grow"
            disabled={isSaveDisabled}
          />
        </View>
      </Modal>
      {!!updateUserError && (
        <HttpErrorModal
          httpError={updateUserError}
          isVisible={!!updateUserError}
          onClose={confirmUpdateUserError}
        />
      )}
    </>
  );
};
