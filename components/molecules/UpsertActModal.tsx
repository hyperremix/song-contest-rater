import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, View } from 'react-native';
import { t, translations } from '../../i18n';
import { ActResponse } from '../../protos/act';
import { useActStore, useCompetitionStore } from '../../store';
import { getComplementSet } from '../../utils/getComplementSet';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Picker } from '../atoms/Picker';
import { Text } from '../atoms/Text';
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
  const createAct = useCompetitionStore((state) => state.createAct);
  const updateAct = useCompetitionStore((state) => state.updateAct);
  const fetchActs = useActStore((state) => state.fetchActs);
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

  const handleSave = () => {
    if (selectedActId !== 'new') {
      createParticipation(
        acts.find((a) => a.id === selectedActId)!,
        selectedCompetition?.acts.length ?? 0,
      );
    } else if (!act) {
      createAct({
        artist_name: artistName,
        song_name: songName,
        image_url: imageUrl,
      });
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
    <Modal onClose={onClose} {...props}>
      <Text className="text-2xl font-bold">
        {act?.id
          ? t(translations.act.editActModalTitle)
          : t(translations.act.addActModalTitle)}
      </Text>
      {!act?.id && (
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
          source={{ uri: imageUrl }}
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
        />
      </View>
    </Modal>
  );
};
