import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { Image, View } from 'react-native';
import { t, translations } from '../../i18n';
import { toImagekitUrl } from '../../imagekit';
import { CompetitionResponse } from '../../protos/competition';
import { useCompetitionStore } from '../../store';
import { toISOString, toTimestamp } from '../../utils/dayjs';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Picker } from '../atoms/Picker';
import { Text } from '../atoms/Text';
import { HttpErrorModal } from './HttpErrorModal';
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
  const upsertCompetitionError = useCompetitionStore(
    (state) => state.upsertCompetitionError,
  );
  const confirmUpsertCompetitionError = useCompetitionStore(
    (state) => state.confirmUpsertCompetitionError,
  );

  const isUpsertCompetitionLoading = useCompetitionStore(
    (state) => state.isUpsertCompetitionLoading,
  );

  const [heat, setHeat] = useState(competition?.heat ?? 1);
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
  const isSaveDisabled = useMemo(
    () =>
      heat === 0 ||
      city === '' ||
      country === '' ||
      startTime === '' ||
      imageUrl === '',
    [heat, city, country, startTime, imageUrl],
  );

  const competitionHeatData = useMemo(
    () =>
      Object.entries(translations.competition.heat)
        .filter(([key]) => key !== '0' && key !== '-1')
        .map(([key, value]) => ({
          label: t(value),
          value: key,
        })),
    [],
  );

  const handleSave = () => {
    if (!competition) {
      createCompetition({
        heat,
        city,
        country,
        start_time: toTimestamp(startTime),
        image_url: imageUrl,
      });
    } else {
      updateCompetition({
        id: competition.id,
        heat,
        city,
        country,
        start_time: toTimestamp(startTime),
        image_url: imageUrl,
      });
    }
    onClose();
  };

  return (
    <>
      <Modal onClose={onClose} {...props}>
        <Text className="text-2xl font-bold">
          {competition?.id
            ? t(translations.competition.editCompetitionModalTitle)
            : t(translations.competition.addCompetitionModalTitle)}
        </Text>
        <Picker
          label={t(translations.competition.heatInputLabel)}
          data={competitionHeatData}
          selectedValue={heat}
          onValueChange={(value) => setHeat(+value)}
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
            source={{
              uri: toImagekitUrl(imageUrl, [
                { height: '256', width: '256', focus: 'auto' },
              ]),
            }}
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
            disabled={isSaveDisabled}
          />
        </View>
      </Modal>
      {!!upsertCompetitionError && (
        <HttpErrorModal
          httpError={upsertCompetitionError}
          isVisible={!!upsertCompetitionError}
          onClose={confirmUpsertCompetitionError}
        />
      )}
    </>
  );
};
