'use client';

import { AppBar } from '@/components/custom/app-bar';
import { Typography } from '@/components/custom/typography';
import { Button } from '@/components/ui/button';
import { useErrorTranslation } from '@/hooks/useErrorTranslation';
import { translations } from '@/i18n';
import { useRouter } from '@/i18n/routing';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const t = useTranslations();
  const { reset } = useQueryErrorResetBoundary();
  const { titleKey, messageKey, status } = useErrorTranslation(error);
  const router = useRouter();

  return (
    <>
      <AppBar />
      <div className="mx-auto flex h-[calc(100vh-64px)] w-full max-w-3xl flex-col items-center justify-center gap-4 px-2 pt-2">
        <Typography variant="h2">{t(titleKey)}</Typography>
        <Typography variant="p">{t(messageKey)}</Typography>
        {status === 500 ? (
          <Button onClick={reset}>{t(translations.buttonLabelRetry)}</Button>
        ) : (
          <Button onClick={() => router.push('/')}>
            {t(translations.buttonLabelHome)}
          </Button>
        )}
      </div>
    </>
  );
}
