import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import zh from './zh';
import { blogContentEn, blogContentZh } from '@/blog';

// Merge blog content into translation resources
const enWithBlog = { ...en, blog: blogContentEn };
const zhWithBlog = { ...zh, blog: blogContentZh };

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enWithBlog },
    zh: { translation: zhWithBlog },
  },
  lng: savedLang || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
