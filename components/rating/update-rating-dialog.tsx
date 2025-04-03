'use client';

import { translations } from '@/i18n';
import {
  RatingResponse,
  UpdateRatingRequest,
} from '@hyperremix/song-contest-rater-protos/rating';
import { Eye, Mic, Music, Shirt, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { RatingInput } from './rating-input';

type Props = {
  rating: RatingResponse | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (updateRatingRequest: UpdateRatingRequest) => void;
};

export const UpdateRatingDialog = ({
  rating,
  isOpen,
  onOpenChange,
  onSave,
}: Props) => {
  const t = useTranslations();

  const [song, setSong] = useState(rating?.song ?? 1);
  const [singing, setSinging] = useState(rating?.singing ?? 1);
  const [show, setShow] = useState(rating?.show ?? 1);
  const [looks, setLooks] = useState(rating?.looks ?? 1);
  const [clothes, setClothes] = useState(rating?.clothes ?? 1);

  const handleSave = () => {
    if (rating) {
      onSave({
        id: rating.id,
        song,
        singing,
        show,
        looks,
        clothes,
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(translations.rating.editRatingModalTitle)}
          </DialogTitle>
        </DialogHeader>
        <RatingInput
          icon={<Music />}
          label={t(translations.rating.song)}
          color="bg-red-500"
          value={song}
          setValue={setSong}
        />
        <RatingInput
          icon={<Mic />}
          label={t(translations.rating.singing)}
          color="bg-orange-500"
          value={singing}
          setValue={setSinging}
        />
        <RatingInput
          icon={<Star />}
          color="bg-green-500"
          label={t(translations.rating.show)}
          value={show}
          setValue={setShow}
        />
        <RatingInput
          icon={<Eye />}
          label={t(translations.rating.looks)}
          color="bg-blue-500"
          value={looks}
          setValue={setLooks}
        />
        <RatingInput
          icon={<Shirt />}
          label={t(translations.rating.clothes)}
          color="bg-purple-500"
          value={clothes}
          setValue={setClothes}
        />
        <DialogFooter>
          <Button onClick={handleSave}>
            {t(translations.rating.editRatingModalButtonLabel)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
