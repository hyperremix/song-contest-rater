import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export type TLocale = 'en' | 'de';

export const routing = defineRouting({
  locales: ['en', 'de'],
  defaultLocale: 'en',
  localeCookie: false,
  pathnames: {
    '/': '/',
    '/sign-in': {
      en: '/sign-in',
      de: '/anmelden',
    },
    '/contests': {
      en: '/contests',
      de: '/wettbewerbe',
    },
    '/contests/[contestId]': {
      en: '/contests/[contestId]',
      de: '/wettbewerbe/[contestId]',
    },
    '/contests/[contestId]/acts/[actId]': {
      en: '/contests/[contestId]/acts/[actId]',
      de: '/wettbewerbe/[contestId]/auftritte/[actId]',
    },
  },
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
