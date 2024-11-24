import { View } from 'react-native';
import { t, translations } from '../../i18n';
import { THttpError } from '../../utils/http';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { Modal, ModalProps } from './Modal';

type Props = ModalProps & {
  httpError: THttpError | null;
};

export const HttpErrorModal = ({ httpError, ...props }: Props) => {
  const title = httpError?.title || translations.error.default.title;
  const message = httpError?.message || translations.error.default.message;

  return (
    <Modal {...props}>
      <Text className="text-3xl font-bold">
        {httpError?.status} {t(title)}
      </Text>
      <Text className="text-gray-700 dark:text-gray-500">{t(message)}</Text>
      <View className="flex flex-row justify-end">
        <Button
          onPress={props.onClose}
          label={t(translations.buttonLabelOkay)}
        />
      </View>
    </Modal>
  );
};
