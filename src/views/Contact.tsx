import { useTranslation } from 'react-i18next';
import SEOHead from '@/components/SEOHead';
import { Mail } from 'lucide-react';

export default function Contact() {
  const { t } = useTranslation();
  const content = t('contact.content');

  return (
    <div>
      <SEOHead
        title={`${t('contact.title')} - PDFToolBox`}
        description="Contact PDFToolBox team. We're here to help with questions, feedback, and feature requests."
        canonical="https://pdf-toolbox.asia/contact"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          {t('contact.title')}
        </h1>

        {/* Quick contact card */}
        <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl p-6 mb-8 border border-primary-100 dark:border-primary-800">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="text-primary-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Email Us</h2>
          </div>
          <p className="text-primary-700 dark:text-primary-300">ben357753@163.com</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">We typically respond within 48 hours.</p>
        </div>

        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
}
