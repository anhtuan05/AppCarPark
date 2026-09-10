import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import vi from './locales/vi';

export const supportedLanguages = ['vi', 'en'];
export const languageStorageKey = 'gcp:language:v1';

function getInitialLanguage() {
  try {
    const storedLanguage = window.localStorage.getItem(languageStorageKey);
    if (supportedLanguages.includes(storedLanguage)) return storedLanguage;
  } catch {
    // Storage may be unavailable in privacy-restricted browser contexts.
  }

  return window.navigator.language.toLowerCase().startsWith('vi') ? 'vi' : 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'vi',
  supportedLngs: supportedLanguages,
  load: 'languageOnly',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

function syncDocumentLanguage(language) {
  const resolvedLanguage = supportedLanguages.includes(language) ? language : 'vi';
  document.documentElement.lang = resolvedLanguage;

  try {
    window.localStorage.setItem(languageStorageKey, resolvedLanguage);
  } catch {
    // The UI can still switch languages when persistence is unavailable.
  }
}

syncDocumentLanguage(i18n.resolvedLanguage || i18n.language);
i18n.on('languageChanged', syncDocumentLanguage);

export default i18n;
