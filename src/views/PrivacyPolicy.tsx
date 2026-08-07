import { useTranslation } from 'react-i18next';
import SEOHead from '@/components/SEOHead';

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const content = t('privacy.content');

  return (
    <div>
      <SEOHead
        title={`${t('privacy.title')} - PDFToolBox`}
        description="PDFToolBox Privacy Policy - All PDF processing happens in your browser. Your files never leave your device."
        canonical="https://pdf-toolbox.asia/privacy-policy"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t('privacy.title')}
        </h1>
        <p className="text-sm text-gray-500 mb-8">{t('privacy.lastUpdated')}</p>
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
}
