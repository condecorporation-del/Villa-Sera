'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/servicios' as const, label: t('services') },
    { href: '/galeria' as const, label: t('gallery') },
    { href: '/experiencias' as const, label: t('experiences') },
    { href: '/contacto' as const, label: t('contact') },
  ];

  const otherLocale = locale === 'es' ? 'en' : 'es';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? 'bg-[#0D0D0D]/95 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-b from-black/50 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span
              className="text-[#C9A84C] font-heading text-2xl font-light tracking-[0.2em] uppercase"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Villa Sera
            </span>
            <span className="text-white/60 text-[10px] tracking-[0.35em] uppercase font-sans mt-0.5">
              Los Cabos, México
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-[#C9A84C] text-sm tracking-[0.12em] uppercase font-sans font-light transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: lang switcher + CTA */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              href={pathname}
              locale={otherLocale}
              className="text-white/60 hover:text-white text-xs tracking-[0.2em] uppercase font-sans transition-colors"
            >
              {otherLocale.toUpperCase()}
            </Link>
            <Link
              href="/contacto"
              className="border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0D0D0D] text-xs tracking-[0.2em] uppercase font-sans px-5 py-2.5 transition-all duration-300"
            >
              {t('book')}
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-4">
            <Link
              href={pathname}
              locale={otherLocale}
              className="text-white/60 text-xs tracking-widest uppercase"
            >
              {otherLocale.toUpperCase()}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white p-1"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0D0D0D] border-t border-white/10">
          <nav className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-white/80 hover:text-[#C9A84C] text-base tracking-[0.12em] uppercase font-sans font-light transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contacto"
              onClick={() => setMenuOpen(false)}
              className="mt-2 border border-[#C9A84C] text-[#C9A84C] text-center text-xs tracking-[0.2em] uppercase font-sans px-5 py-3 transition-all"
            >
              {t('book')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
