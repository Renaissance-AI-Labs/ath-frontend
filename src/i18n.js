import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import ru from './locales/ru.json';

const messages = {
  en,
  zh,
  ja,
  ko,
  ru
};

const i18n = createI18n({
  legacy: false, // Must be set to false to use Composition API
  locale: 'zh', // Set default locale
  fallbackLocale: 'en', // Set fallback locale
  messages,
});

export default i18n;
