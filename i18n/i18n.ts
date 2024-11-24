import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import de from './locales/de.json';
import en from './locales/en.json';
import { convertLanguageJsonToObject } from './translations';
import { TranslationJsonType } from './types';

enum Language {
  English = 'en',
  German = 'de',
}

const translations: Record<Language, TranslationJsonType> = {
  en,
  de,
};

convertLanguageJsonToObject(en);

export const locale = getLocales()?.[0]?.languageCode ?? 'en';

const i18n = new I18n(translations);

i18n.locale = locale;
i18n.enableFallback = true;

export const t = i18n.t.bind(i18n);
