import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronDown } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

export default function FAQPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = (t('faqPage.items', { returnObjects: true }) as Array<{ q: string; a: string }>) || [];

  const filtered = items.filter(item => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.slice(0, 20).map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <div>
      <SEOHead
        title={t('faqPage.seoTitle')}
        description={t('faqPage.seoDesc')}
        canonical="https://pdf-toolbox.asia/faq"
        jsonLd={jsonLd}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {t('faqPage.title')}
        </h1>
        <p className="text-[17px] text-neutral-500 dark:text-neutral-400 mb-8">
          {t('faqPage.subtitle')}
        </p>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpenIndex(null);
            }}
            placeholder="Search questions..."
            className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          />
        </div>

        {/* FAQ items */}
        <div className="space-y-2">
          {filtered.map((item, i) => (
            <div key={i} className="border border-neutral-100 dark:border-neutral-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition"
              >
                <span className="text-[15px] font-medium text-neutral-900 dark:text-white pr-4">{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-neutral-400 dark:text-neutral-500 transition-transform duration-200 shrink-0 ${openIndex === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4 bg-white dark:bg-neutral-900">
                  <p className="text-[14px] text-neutral-500 dark:text-neutral-400 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-neutral-400">
            No questions match "{search}". Try a different search term.
          </div>
        )}
      </div>
    </div>
  );
}
