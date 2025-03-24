'use client';

import { translations } from '@/i18n';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { AppBar } from './app-bar';
import { Typography } from './typography';

type Props = {
  statusCode: keyof typeof translations.error;
};

export const ErrorDisplay = ({ statusCode }: Props) => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <>
      <AppBar />
      <div className="mx-auto flex h-[calc(100vh-64px)] w-full max-w-3xl flex-col items-center justify-center gap-4 px-2 pt-2">
        <Typography variant="h1">
          {t(translations.error[statusCode].title)}
        </Typography>
        <Typography variant="p">
          {t(translations.error[statusCode].message)}
        </Typography>
        <Link
          href="/"
          locale={locale}
          className="text-blue-500 underline visited:text-purple-500 hover:text-blue-600 hover:visited:text-purple-600"
        >
          {t(translations.buttonLabelHome)}
        </Link>
      </div>
    </>
  );
};
