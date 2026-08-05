import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Hero3D from '@/components/Hero3D';
import SearchBar from '@/components/SearchBar';
import ToolCard from '@/components/ToolCard';
import SEOHead from '@/components/SEOHead';
import { getToolsByCategory } from '@/tools/registry';
import { Shield, Zap, Globe, Lock } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const displayTools = getToolsByCategory(activeCategory);

  return (
    <div>
      <SEOHead
        title="PDFToolBox — Free Online PDF Tools"
        description={t('common.heroSubtitle')}
      />

      {/* Hero */}
      <section className="relative">
        <div className="relative h-[520px] md:h-[580px]">
          <Hero3D />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center px-6 max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-5 leading-[1.05]">
                {t('common.heroTitle')}
              </h1>
              <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 mb-10 max-w-xl mx-auto leading-relaxed font-normal">
                {t('common.heroSubtitle')}
              </p>
              <SearchBar />
              <div className="flex flex-wrap justify-center gap-6 mt-10">
                {[
                  { icon: Lock, text: t('common.privacy') },
                  { icon: Zap, text: t('common.free') },
                  { icon: Globe, text: t('common.noInstall') },
                ].map((item, i) => (
                  <span key={i} className="flex items-center gap-2 text-[14px] text-neutral-500 dark:text-neutral-400">
                    <item.icon size={15} className="text-neutral-400 dark:text-neutral-500" />
                    {item.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
              {t('common.allTools')}
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-lg">
              12 professional PDF tools, all running in your browser.
            </p>
          </div>

          {/* Category Filter — minimal pill tabs */}
          <div className="flex justify-center gap-1 mb-12 bg-neutral-100 dark:bg-neutral-800/50 rounded-full p-1 max-w-md mx-auto">
            {['all', 'convert', 'edit', 'security'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-1 px-4 py-2 rounded-full text-[14px] font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                {t(`categories.${cat}`)}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayTools.map(tool => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section — minimal */}
      <section className="py-20 md:py-28 border-t border-neutral-100 dark:border-neutral-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              { icon: Lock, title: t('home.trustPrivacy'), desc: t('home.trustPrivacyDesc') },
              { icon: Zap, title: t('home.trustFast'), desc: t('home.trustFastDesc') },
              { icon: Shield, title: t('home.trustFree'), desc: t('home.trustFreeDesc') },
            ].map((item, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4 mx-auto md:mx-0">
                  <item.icon size={20} className="text-neutral-600 dark:text-neutral-300" />
                </div>
                <h3 className="text-[17px] font-semibold text-neutral-900 dark:text-white mb-1.5 tracking-tight">{item.title}</h3>
                <p className="text-[15px] text-neutral-500 dark:text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Section */}
      <section className="py-20 md:py-28 border-t border-neutral-100 dark:border-neutral-800">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6 text-center">
            {t('home.whyTitle')}
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 leading-[1.8] text-[16px]">
            {t('home.whyText')}
          </p>
        </div>
      </section>
    </div>
  );
}
