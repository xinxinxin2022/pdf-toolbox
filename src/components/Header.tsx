import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm'
        : 'bg-white dark:bg-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-400">
            <span className="text-2xl">📄</span>
            <span>{t('common.siteName')}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">
              {t('nav.home')}
            </Link>
            <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">
              {t('nav.about')}
            </Link>
            <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">
              {t('nav.contact')}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 py-2">
                {t('nav.home')}
              </Link>
              <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 py-2">
                {t('nav.about')}
              </Link>
              <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 py-2">
                {t('nav.contact')}
              </Link>
              <Link to="/privacy-policy" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 py-2">
                {t('nav.privacy')}
              </Link>
              <Link to="/terms-of-service" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 py-2">
                {t('nav.terms')}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
