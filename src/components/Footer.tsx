import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { tools } from '@/tools/registry';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-neutral-100 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-lg">📄</span>
              <span className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
                PDFToolBox
              </span>
            </Link>
            <p className="text-[14px] text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[13px] font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: '/about', label: t('nav.about') },
                { to: '/contact', label: t('nav.contact') },
                { to: '/privacy-policy', label: t('nav.privacy') },
                { to: '/terms-of-service', label: t('nav.terms') },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-[14px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-[13px] font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
              {t('footer.tools')}
            </h3>
            <ul className="space-y-2.5">
              {tools.slice(0, 6).map(tool => (
                <li key={tool.slug}>
                  <Link to={`/tool/${tool.slug}`} className="text-[14px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition">
                    {t(tool.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Tools */}
          <div>
            <h3 className="text-[13px] font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
              &nbsp;
            </h3>
            <ul className="space-y-2.5">
              {tools.slice(6).map(tool => (
                <li key={tool.slug}>
                  <Link to={`/tool/${tool.slug}`} className="text-[14px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition">
                    {t(tool.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-neutral-400 dark:text-neutral-500">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              All processing happens locally
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
