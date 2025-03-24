import { redirect } from '@/i18n/routing';
import { auth } from '@clerk/nextjs/server';
import { getLocale } from 'next-intl/server';

export default async function HomePage() {
  const { userId } = await auth();
  const locale = await getLocale();
  if (userId) {
    redirect({ href: '/contests', locale });
  } else {
    redirect({ href: '/sign-in', locale });
  }
}
