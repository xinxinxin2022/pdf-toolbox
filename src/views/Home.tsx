import { useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Hero3D from '@/components/Hero3D';
import SearchBar from '@/components/SearchBar';
import ToolCard from '@/components/ToolCard';
import SEOHead from '@/components/SEOHead';
import { tools, getToolsByCategory } from '@/tools/registry';
import { Shield, Zap, Globe, DollarSign } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const displayTools = getToolsByCategory(activeCategory);

  const { t: _ } = useTranslation();

  return (
    <div>
      <SEOHead
        title={t('common.siteName') + ' - ' + t('common.tagline')}
        description={t('common.heroSubtitle')}
      />

      {/* Hero */}
      <section className="relative">
        <div className="relative h-[500px] md:h-[550px]">
          <Hero3D />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center px-4 max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                {t('common.heroTitle')}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow">
                {t('common.heroSubtitle')}
              </p>
              <SearchBar />
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <span className="flex items-center gap-1.5 text-white/90 text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Shield size={16} /> {t('common.privacy')}
                </span>
                <span className="flex items-center gap-1.5 text-white/90 text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <DollarSign size={16} /> {t('common.free')}
                </span>
                <span className="flex items-center gap-1.5 text-white/90 text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Globe size={16} /> {t('common.noInstall')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: DollarSign, title: t('home.trustFree'), desc: t('home.trustFreeDesc'), color: 'text-green-500' },
              { icon: Shield, title: t('home.trustPrivacy'), desc: t('home.trustPrivacyDesc'), color: 'text-blue-500' },
              { icon: Globe, title: t('home.trustNoInstall'), desc: t('home.trustNoInstallDesc'), color: 'text-purple-500' },
              { icon: Zap, title: t('home.trustFast'), desc: t('home.trustFastDesc'), color: 'text-orange-500' },
            ].map((item, i) => (
              <div key={i} className="text-center p-4">
                <item.icon className={`mx-auto mb-3 ${item.color}`} size={32} />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {t('common.allTools')}
          </h2>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {['all', 'convert', 'edit', 'security'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {t(`categories.${cat}`)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayTools.map(tool => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* SEO Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {t('home.whyTitle')}
          </h2>
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>{t('home.whyText')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
