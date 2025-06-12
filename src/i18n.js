import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ur from './locales/ur.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ur: { translation: ur },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Only change lang class — do NOT use dir or affect layout
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.body.classList.remove('lang-en', 'lang-ur');
  document.body.classList.add(`lang-${lng}`);
});


export default i18n;
