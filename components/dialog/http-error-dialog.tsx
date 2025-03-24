'use client';

import { translations } from '@/i18n';
import { HttpError } from '@/utils/http';
import { AlertDialogAction } from '@radix-ui/react-alert-dialog';
import { useTranslations } from 'next-intl';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

type Props = {
  error: HttpError;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export const HttpErrorDialog = ({ error, isOpen, onOpenChange }: Props) => {
  const t = useTranslations();

  const title = error?.title || translations.error.default.title;
  const message = error?.message || translations.error.default.message;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t(title)}</AlertDialogTitle>
          <AlertDialogDescription>{t(message)}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>
            {t(translations.buttonLabelOkay)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
