import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Suspense } from 'react';
import SEOHead from '@/components/SEOHead';
import FAQ from '@/components/FAQ';
import { getToolBySlug, getRelatedTools } from '@/tools/registry';
import { ArrowRight, Check } from 'lucide-react';

export default function ToolPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const tool = slug ? getToolBySlug(slug) : undefined;
  const relatedTools = slug ? getRelatedTools(slug) : [];

  if (!tool) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Tool not found</h1>
        <Link to="/" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition">
          ← {t('common.backToHome')}
        </Link>
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
  };

  return (
    <div>
      <SEOHead
        title={t(tool.seoTitleKey)}
        description={t(tool.seoDescKey)}
        canonical={`https://pdf-toolbox.asia/#/tool/${tool.slug}`}
        jsonLd={jsonLd}
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-[13px] text-neutral-400 dark:text-neutral-500 mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition">Home</Link>
          <span>/</span>
          <span className="text-neutral-600 dark:text-neutral-300">{t(tool.nameKey)}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Main */}
          <div className="lg:col-span-2">
            {/* Tool Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{tool.icon}</span>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  {t(tool.nameKey)}
                </h1>
              </div>
              <p className="text-[17px] text-neutral-500 dark:text-neutral-400">
                {t(tool.shortDescKey)}
              </p>
            </div>

            {/* Tool operation area */}
            <div className="mb-16 p-6 md:p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800">
              <Suspense fallback={<div className="text-center py-8 text-neutral-400">{t('common.processing')}</div>}>
                <ToolComponent />
              </Suspense>
            </div>

            {/* About This Tool */}
            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
                  {t('toolPage.aboutThisTool')}
                </h2>
                <p className="text-[16px] text-neutral-500 dark:text-neutral-400 leading-[1.8]">
                  {t(tool.descriptionKey)}
                </p>
              </section>

              {/* How to Use */}
              <section>
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
                  {t('toolPage.howToUse')}
                </h2>
                <div className="space-y-4">
                  {howToUse.map((step: string, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-center justify-center text-[13px] font-semibold shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-[15px] text-neutral-500 dark:text-neutral-400 pt-1 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Features */}
              <section>
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
                  {t('toolPage.features')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Check className="text-neutral-400 dark:text-neutral-500 shrink-0" size={16} strokeWidth={2.5} />
                      <span className="text-[15px] text-neutral-500 dark:text-neutral-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Why Use */}
              <section>
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
                  {t('toolPage.whyUse')}
                </h2>
                <p className="text-[16px] text-neutral-500 dark:text-neutral-400 leading-[1.8]">
                  {t(tool.whyUseKey)}
                </p>
              </section>

              {/* FAQ */}
              {faqItems.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
                    {t('toolPage.faq')}
                  </h2>
                  <FAQ items={faqItems} />
                </section>
              )}

              {/* Keywords */}
              <section className="pt-8 border-t border-neutral-100 dark:border-neutral-800">
                <p className="text-[13px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">
                  {t('toolPage.tags')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tool.keywords.map(kw => (
                    <span key={kw} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-full text-[13px]">
                      {kw}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-[13px] font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
                {t('common.relatedTools')}
              </h3>
              <div className="space-y-1">
                {relatedTools.map(rt => (
                  <Link
                    key={rt.slug}
                    to={`/tool/${rt.slug}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 group transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{rt.icon}</span>
                      <span className="text-[14px] font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition">
                        {t(rt.nameKey)}
                      </span>
                    </div>
                    <ArrowRight size={14} className="text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-900 dark:group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
