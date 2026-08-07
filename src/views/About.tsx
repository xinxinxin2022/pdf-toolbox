import { useTranslation } from 'react-i18next';
import SEOHead from '@/components/SEOHead';

export default function About() {
  const { t } = useTranslation();
  const content = t('about.content');

  return (
    <div>
      <SEOHead
        title={`${t('about.title')} - PDFToolBox`}
        description="Learn about PDFToolBox — free online PDF tools with 100% privacy. All processing happens in your browser."
        canonical="https://pdf-toolbox.asia/about"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          {t('about.title')}
        </h1>
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
}
