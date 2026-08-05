import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { searchTools } from '@/tools/registry';

export default function SearchBar() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const results = query ? searchTools(query) : [];

  return (
    <div className="relative max-w-lg mx-auto">
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder={t('common.searchPlaceholder')}
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 shadow-sm"
        />
      </div>
      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden z-50">
          {results.slice(0, 5).map(tool => (
            <button
              key={tool.slug}
              onClick={() => { navigate(`/tool/${tool.slug}`); setQuery(''); setShowResults(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-left transition"
            >
              <span className="text-xl">{tool.icon}</span>
              <span className="text-[14px] text-neutral-900 dark:text-white font-medium">{t(tool.nameKey)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
