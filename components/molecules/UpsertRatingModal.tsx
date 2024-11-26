import { useState } from 'react';
import colors from 'tailwindcss/colors';
import { t, translations } from '../../i18n';
import { RatingResponse } from '../../protos/rating';
import { useRatingStore } from '../../store/rating';
import { Button } from '../atoms/Button';
import { RatingInput } from '../atoms/RatingInput';
import { Text } from '../atoms/Text';
import { Modal, ModalProps } from './Modal';

type Props = ModalProps & {
  competitionId?: string;
  actId?: string;
  rating?: RatingResponse;
};

export const UpsertRatingModal = ({
  competitionId,
  actId,
  rating,
  onClose,
  ...props
}: Props) => {
  const createRating = useRatingStore((state) => state.createRating);
  const updateRating = useRatingStore((state) => state.updateRating);
  const isUpsertRatingLoading = useRatingStore(
    (state) => state.isUpsertRatingLoading,
  );

  const [song, setSong] = useState(rating ? rating.song : 1);
  const [singing, setSinging] = useState(rating ? rating.singing : 1);
  const [show, setShow] = useState(rating ? rating.show : 1);
  const [looks, setLooks] = useState(rating ? rating.looks : 1);
  const [clothes, setClothes] = useState(rating ? rating.clothes : 1);

  const handleSave = () => {
    if (!rating) {
      createRating({
        competition_id: competitionId!,
        act_id: actId!,
        song,
        singing,
        show,
        looks,
        clothes,
      });
    } else {
      updateRating({
        id: rating.id,
        song,
        singing,
        show,
        looks,
        clothes,
      });
    }
    onClose();
  };

  return (
    <Modal onClose={onClose} {...props}>
      <Text className="text-2xl font-bold">
        {rating?.id
          ? t(translations.rating.editRatingModalTitle)
          : t(translations.rating.addRatingModalTitle)}
      </Text>
      <RatingInput
        icon="musical-notes"
        label={t(translations.rating.song)}
        color={colors.red[500]}
        value={song}
        setValue={setSong}
      />
      <RatingInput
        icon="mic"
        label={t(translations.rating.singing)}
        color={colors.orange[500]}
        value={singing}
        setValue={setSinging}
      />
      <RatingInput
        icon="star"
        color={colors.green[500]}
        label={t(translations.rating.show)}
        value={show}
        setValue={setShow}
      />
      <RatingInput
        icon="eye"
        label={t(translations.rating.looks)}
        color={colors.blue[500]}
        value={looks}
        setValue={setLooks}
      />
      <RatingInput
        icon="shirt"
        label={t(translations.rating.clothes)}
        color={colors.purple[500]}
        value={clothes}
        setValue={setClothes}
      />
      <Button
        label={t(translations.rating.editRatingModalButtonLabel)}
        className="mt-6"
        onPress={handleSave}
        isLoading={isUpsertRatingLoading}
      />
    </Modal>
  );
};
