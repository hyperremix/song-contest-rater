'use client';

import { translations } from '@/i18n';
import { CreateRatingRequest } from '@hyperremix/song-contest-rater-proto/rating';
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
  contestId: string;
  actId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (createRatingRequest: CreateRatingRequest) => void;
};

export const CreateRatingDialog = ({
  contestId,
  actId,
  isOpen,
  onOpenChange,
  onSave,
}: Props) => {
  const t = useTranslations();

  const [song, setSong] = useState(1);
  const [singing, setSinging] = useState(1);
  const [show, setShow] = useState(1);
  const [looks, setLooks] = useState(1);
  const [clothes, setClothes] = useState(1);

  const handleSave = () => {
    onSave({
      competition_id: contestId,
      act_id: actId,
      song,
      singing,
      show,
      looks,
      clothes,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(translations.rating.addRatingModalTitle)}
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
        <DialogFooter className="mt-5">
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t(translations.buttonLabelCancel)}
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            {t(translations.rating.editRatingModalButtonLabel)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
