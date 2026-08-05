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
    <header className={`sticky top-0 z-50 transition-all duration-200 ${
      scrolled
        ? 'bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-neutral-100 dark:border-neutral-800'
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-xl transition-transform group-hover:scale-110">📄</span>
            <span className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
              PDFToolBox
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-[15px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition">
              {t('nav.home')}
            </Link>
            <Link to="/about" className="text-[15px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition">
              {t('nav.about')}
            </Link>
            <Link to="/contact" className="text-[15px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition">
              {t('nav.contact')}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden py-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex flex-col gap-1">
              {[
                { to: '/', label: t('nav.home') },
                { to: '/about', label: t('nav.about') },
                { to: '/contact', label: t('nav.contact') },
                { to: '/privacy-policy', label: t('nav.privacy') },
                { to: '/terms-of-service', label: t('nav.terms') },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white py-2.5 px-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
