import { useTranslation } from 'react-i18next';
import SEOHead from '@/components/SEOHead';

export default function TermsOfService() {
  const { t } = useTranslation();
  const content = t('terms.content');

  return (
    <div>
      <SEOHead
        title={`${t('terms.title')} - PDFToolBox`}
        description="PDFToolBox Terms of Service - Free online PDF tools with 100% privacy."
        canonical="https://pdf-toolbox.asia/terms-of-service"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t('terms.title')}
        </h1>
        <p className="text-sm text-gray-500 mb-8">{t('terms.lastUpdated')}</p>
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
}
