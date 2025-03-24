export const locales = ['en', 'de'] as const;
export const localePrefix = 'always'; // 'as-needed' | 'always' | 'never'

export type Locale = (typeof locales)[number];
