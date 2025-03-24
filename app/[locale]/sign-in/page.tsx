import { Button } from '@/components/ui/button';
import { translations } from '@/i18n';
import { SignInButton } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <div className="relative h-64 w-64">
        <Image
          src="/logo512.png"
          alt="logo"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <SignInButton>
        <Button className="text-2xl">
          {t(translations.auth.loginButtonLabel)}
        </Button>
      </SignInButton>
    </div>
  );
}
