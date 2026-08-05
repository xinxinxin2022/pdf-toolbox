import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { tools } from '@/tools/registry';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📄</span>
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                {t('common.siteName')}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t('footer.description')}
            </p>
            <div className="flex gap-3 mt-4">
              <span className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                🔒 {t('common.privacy')}
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                💎 {t('common.free')}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">{t('nav.about')}</Link></li>
              <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">{t('nav.contact')}</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">{t('nav.privacy')}</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-600 dark:text-gray-400 hover:text-primary-600">{t('nav.terms')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t('footer.tools')}
            </h3>
            <ul className="space-y-2 text-sm">
              {tools.slice(0, 6).map(tool => (
                <li key={tool.slug}>
                  <Link
                    to={`/tool/${tool.slug}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600"
                  >
                    {tool.icon} {t(tool.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t('footer.tools')}
            </h3>
            <ul className="space-y-2 text-sm">
              {tools.slice(6).map(tool => (
                <li key={tool.slug}>
                  <Link
                    to={`/tool/${tool.slug}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600"
                  >
                    {tool.icon} {t(tool.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
}
