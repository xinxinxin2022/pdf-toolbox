import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Suspense } from 'react';
import SEOHead from '@/components/SEOHead';
import ToolCard from '@/components/ToolCard';
import FAQ from '@/components/FAQ';
import { getToolBySlug, getRelatedTools } from '@/tools/registry';
import { CheckCircle, Tag } from 'lucide-react';

export default function ToolPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const tool = slug ? getToolBySlug(slug) : undefined;
  const relatedTools = slug ? getRelatedTools(slug) : [];

  if (!tool) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tool not found</h1>
        <Link to="/" className="text-primary-600 hover:underline">{t('common.backToHome')}</Link>
      </div>
    );
  }

  const ToolComponent = tool.component;
  const faqItems = (t(tool.faqKey, { returnObjects: true }) as any) || [];
  const features = (t(tool.featuresKey, { returnObjects: true }) as any) || [];
  const howToUse = (t(tool.howToUseKey, { returnObjects: true }) as any) || [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: t(tool.seoTitleKey),
    description: t(tool.seoDescKey),
    url: `https://pdf-toolbox.asia/#/tool/${tool.slug}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pdf-toolbox.asia/' },
        { '@type': 'ListItem', position: 2, name: t(tool.nameKey), item: `https://pdf-toolbox.asia/#/tool/${tool.slug}` },
      ],
    },
  };

  return (
    <div>
      <SEOHead
        title={t(tool.seoTitleKey)}
        description={t(tool.seoDescKey)}
        canonical={`https://pdf-toolbox.asia/#/tool/${tool.slug}`}
        jsonLd={jsonLd}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary-600">{t('nav.home')}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">{t(tool.nameKey)}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main */}
          <div className="lg:col-span-3">
            {/* Tool operation area */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-2xl`}>
                  {tool.icon}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t(tool.nameKey)}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t(tool.shortDescKey)}</p>
                </div>
              </div>
              <Suspense fallback={<div className="text-center py-8 text-gray-500">{t('common.processing')}</div>}>
                <ToolComponent />
              </Suspense>
            </div>

            {/* About This Tool */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('toolPage.aboutThisTool')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {t(tool.descriptionKey)}
              </p>

              {/* How to Use */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('toolPage.howToUse')}
              </h3>
              <div className="space-y-3 mb-8">
                {howToUse.map((step: string, i: number) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold text-sm shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 pt-1">{step}</p>
                  </div>
                ))}
              </div>

              {/* Features */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('toolPage.features')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {features.map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="text-green-500 shrink-0" size={18} />
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Why Use */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('toolPage.whyUse')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                {t(tool.whyUseKey)}
              </p>

              {/* FAQ */}
              {faqItems.length > 0 && (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {t('toolPage.faq')}
                  </h3>
                  <FAQ items={faqItems} />
                </>
              )}

              {/* Keywords */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                  <Tag size={16} />
                  <span>{t('toolPage.tags')}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tool.keywords.map(kw => (
                    <span key={kw} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {t('common.relatedTools')}
                </h3>
                <div className="space-y-3">
                  {relatedTools.map(rt => (
                    <Link
                      key={rt.slug}
                      to={`/tool/${rt.slug}`}
                      className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 hover:shadow-sm transition"
                    >
                      <span className="text-xl">{rt.icon}</span>
                      <span className="text-sm text-gray-900 dark:text-white">{t(rt.nameKey)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
