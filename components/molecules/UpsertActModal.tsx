import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import { color } from '../../constants/color';
import { t, translations } from '../../i18n';
import { toImagekitUrl } from '../../imagekit';
import { ActResponse } from '../../protos/act';
import { useActStore, useCompetitionStore } from '../../store';
import { getComplementSet } from '../../utils/getComplementSet';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { NumberInput } from '../atoms/NumberInput';
import { Picker } from '../atoms/Picker';
import { Text } from '../atoms/Text';
import { HttpErrorModal } from './HttpErrorModal';
import { Modal, ModalProps } from './Modal';
type Props = ModalProps & {
  act?: ActResponse | null;
};

export const UpsertActModal = ({ act, onClose, ...props }: Props) => {
  const router = useRouter();

  const selectedCompetition = useCompetitionStore(
    (state) => state.selectedCompetition,
  );
  const acts = useActStore((state) => state.acts);
  const isFetchActsLoading = useActStore((state) => state.isFetchActsLoading);
  const fetchActsError = useActStore((state) => state.fetchActsError);
  const createAct = useCompetitionStore((state) => state.createAct);
  const updateAct = useCompetitionStore((state) => state.updateAct);
  const upsertActError = useCompetitionStore((state) => state.upsertActError);
  const confirmUpsertActError = useCompetitionStore(
    (state) => state.confirmUpsertActError,
  );
  const fetchActs = useActStore((state) => state.fetchActs);
  const confirmFetchActsError = useActStore(
    (state) => state.confirmFetchActsError,
  );
  const deleteParticipation = useCompetitionStore(
    (state) => state.deleteParticipation,
  );
  const createParticipation = useCompetitionStore(
    (state) => state.createParticipation,
  );

  const isUpsertActLoading = useCompetitionStore(
    (state) => state.isUpsertActLoading,
  );

  const actData = useMemo(
    () => [
      {
        label: t(translations.act.createNewActItemLabel),
        value: 'new',
      },
      ...getComplementSet(acts, selectedCompetition?.acts).map((act) => ({
        label: `${act.artist_name} - ${act.song_name}`,
        value: act.id,
      })),
    ],
    [acts],
  );

  useEffect(() => {
    if (!act) {
      fetchActs();
    }
  }, [act]);

  const [selectedActId, setSelectedActId] = useState<string>('new');
  const [artistName, setArtistName] = useState(act?.artist_name || '');
  const [songName, setSongName] = useState(act?.song_name || '');
  const [imageUrl, setImageUrl] = useState(act?.image_url ?? '');
  const [order, setOrder] = useState<number | undefined>(
    act?.order !== undefined
      ? act.order
      : (selectedCompetition?.acts.length ?? 0) + 1,
  );
  const isSaveDisabled = useMemo(
    () =>
      order === undefined ||
      artistName === '' ||
      songName === '' ||
      imageUrl === '',
    [order, artistName, songName, imageUrl],
  );

  const handleSave = () => {
    if (order === undefined) {
      return;
    }

    if (selectedActId !== 'new') {
      createParticipation(acts.find((a) => a.id === selectedActId)!, order);
    } else if (!act) {
      createAct(
        {
          artist_name: artistName,
          song_name: songName,
          image_url: imageUrl,
        },
        order,
      );
    } else {
      updateAct({
        id: act.id,
        artist_name: artistName,
        song_name: songName,
        image_url: imageUrl,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    deleteParticipation(act!.id);
    router.navigate(`/competitions/${selectedCompetition?.id}`);
    onClose();
  };

  return (
    <>
      <Modal onClose={onClose} {...props}>
        <Text className="text-2xl font-bold">
          {act?.id
            ? t(translations.act.editActModalTitle)
            : t(translations.act.addActModalTitle)}
        </Text>
        {isFetchActsLoading && (
          <View className="flex flex-row items-center gap-2 mt-6">
            <ActivityIndicator size="large" color={color.primary} />
          </View>
        )}
        {!act?.id && !isFetchActsLoading && (
          <Picker
            label={t(translations.act.chooseActPickerLabel)}
            data={actData}
            selectedValue={selectedActId}
            onValueChange={(value) => setSelectedActId(value.toString())}
          />
        )}
        {selectedActId === 'new' && (
          <Input
            label={t(translations.act.artistNameInputLabel)}
            value={artistName}
            onChangeText={setArtistName}
          />
        )}
        {selectedActId === 'new' && (
          <Input
            label={t(translations.act.songNameInputLabel)}
            value={songName}
            onChangeText={setSongName}
          />
        )}
        <NumberInput
          label={t(translations.act.orderLabel)}
          value={order}
          onChange={setOrder}
        />
        {selectedActId === 'new' && (
          <Input
            label={t(translations.act.imageUrlInputLabel)}
            value={imageUrl}
            onChangeText={setImageUrl}
          />
        )}
        {selectedActId === 'new' && imageUrl && (
          <Image
            className="object-contain rounded-lg h-32 w-32"
            source={{
              uri: toImagekitUrl(imageUrl, [
                {
                  height: '256',
                  width: '256',
                  cropMode: 'pad_resize',
                },
              ]),
            }}
          />
        )}
        <View className="flex flex-row items-center gap-2 mt-6">
          {act?.id && (
            <Button
              label={t(translations.act.deleteParticipationModalButtonLabel)}
              onPress={handleDelete}
              isLoading={isUpsertActLoading}
              className="grow"
              variant="outlined"
            />
          )}
          <Button
            label={t(translations.act.editActModalButtonLabel)}
            onPress={handleSave}
            isLoading={isUpsertActLoading}
            className="grow"
            disabled={isSaveDisabled}
          />
        </View>
      </Modal>
      {!!fetchActsError && (
        <HttpErrorModal
          httpError={fetchActsError}
          isVisible={!!fetchActsError}
          onClose={confirmFetchActsError}
        />
      )}
      {!!upsertActError && (
        <HttpErrorModal
          httpError={upsertActError}
          isVisible={!!upsertActError}
          onClose={confirmUpsertActError}
        />
      )}
    </>
  );
};
