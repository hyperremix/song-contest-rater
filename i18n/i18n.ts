import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import { Platform } from 'react-native';
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

const i18n = new I18n(translations);

const getUserLocale = () =>
  (Platform.OS === 'web' ? navigator.language : getLocales()[0].languageCode) ??
  'en';

i18n.locale = getUserLocale();
i18n.enableFallback = true;

export const t = i18n.t.bind(i18n);
