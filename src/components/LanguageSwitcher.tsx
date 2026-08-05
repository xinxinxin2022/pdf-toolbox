import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1.5 text-[13px] font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
      >
        {i18n.language === 'zh' ? '中文' : 'EN'}
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg overflow-hidden z-50">
          <button
            onClick={() => changeLang('en')}
            className={`w-full text-left px-4 py-2.5 text-[13px] transition ${
              i18n.language === 'en'
                ? 'text-neutral-900 dark:text-white font-medium bg-neutral-50 dark:bg-neutral-800'
                : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            English
          </button>
          <button
            onClick={() => changeLang('zh')}
            className={`w-full text-left px-4 py-2.5 text-[13px] transition ${
              i18n.language === 'zh'
                ? 'text-neutral-900 dark:text-white font-medium bg-neutral-50 dark:bg-neutral-800'
                : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            中文
          </button>
        </div>
      )}
    </div>
  );
}
