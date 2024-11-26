import dayjs from 'dayjs';
import { useState } from 'react';
import { Image, View } from 'react-native';
import { t, translations } from '../../i18n';
import { CompetitionResponse } from '../../protos/competition';
import { useCompetitionStore } from '../../store';
import { toISOString, toTimestamp } from '../../utils/dayjs';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Text } from '../atoms/Text';
import { Modal, ModalProps } from './Modal';

type Props = ModalProps & {
  competition?: CompetitionResponse | null;
};

export const UpsertCompetitionModal = ({
  competition,
  onClose,
  ...props
}: Props) => {
  const createCompetition = useCompetitionStore(
    (state) => state.createCompetition,
  );
  const updateCompetition = useCompetitionStore(
    (state) => state.updateCompetition,
  );
  const deleteCompetition = useCompetitionStore(
    (state) => state.deleteCompetition,
  );

  const isUpsertCompetitionLoading = useCompetitionStore(
    (state) => state.isUpsertCompetitionLoading,
  );

  const [description, setDescription] = useState(
    competition?.description || '',
  );
  const [city, setCity] = useState(competition?.city ?? '');
  const [country, setCountry] = useState(competition?.country ?? '');
  const [startTime, setStartTime] = useState(
    toISOString(competition?.start_time) ??
      dayjs()
        .set('hour', 20)
        .set('minute', 0)
        .set('second', 0)
        .set('milliseconds', 0)
        .toISOString(),
  );
  const [imageUrl, setImageUrl] = useState(competition?.image_url ?? '');

  const handleSave = () => {
    if (!competition) {
      createCompetition({
        description,
        city,
        country,
        start_time: toTimestamp(startTime),
        image_url: imageUrl,
      });
    } else {
      updateCompetition({
        id: competition.id,
        description,
        city,
        country,
        start_time: toTimestamp(startTime),
        image_url: imageUrl,
      });
    }
    onClose();
  };

  return (
    <Modal onClose={onClose} {...props}>
      <Text className="text-2xl font-bold">
        {competition?.id
          ? t(translations.competition.editCompetitionModalTitle)
          : t(translations.competition.addCompetitionModalTitle)}
      </Text>
      <Input
        label={t(translations.competition.descriptionInputLabel)}
        value={description}
        onChangeText={setDescription}
      />
      <Input
        label={t(translations.competition.cityInputLabel)}
        value={city}
        onChangeText={setCity}
      />
      <Input
        label={t(translations.competition.countryInputLabel)}
        value={country}
        onChangeText={setCountry}
      />
      <Input
        label={t(translations.competition.startTimeInputLabel)}
        value={startTime}
        onChangeText={setStartTime}
      />
      <Input
        label={t(translations.competition.imageUrlInputLabel)}
        value={imageUrl}
        onChangeText={setImageUrl}
      />
      {imageUrl && (
        <Image
          className="object-contain rounded-lg h-32 w-32"
          source={{ uri: imageUrl }}
        />
      )}
      <View className="flex flex-row items-center gap-2 mt-6">
        {competition?.id && (
          <Button
            label={t(
              translations.competition.deleteCompetitionModalButtonLabel,
            )}
            onPress={() => deleteCompetition(competition.id)}
            isLoading={isUpsertCompetitionLoading}
            className="grow"
            variant="outlined"
          />
        )}
        <Button
          label={t(translations.competition.editCompetitionModalButtonLabel)}
          onPress={handleSave}
          isLoading={isUpsertCompetitionLoading}
          className="grow"
        />
      </View>
    </Modal>
  );
};
