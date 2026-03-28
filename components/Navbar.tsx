'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import Image from 'next/image';
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
    { href: '#servicios', label: t('services') },
    { href: '#galeria', label: t('gallery') },
    { href: '#experiencias', label: t('experiences') },
    { href: '#contacto', label: t('contact') },
  ];

  const otherLocale = locale === 'es' ? 'en' : 'es';

  const handleAnchor = (href: string) => {
    setMenuOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? 'bg-[#0D0D0D]/95 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-b from-black/50 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-28 md:h-40">
          {/* Logo */}
          <Link href="/" className="flex items-center -ml-3">
            <Image
              src="/logo.png"
              alt="Villa Sera"
              width={480}
              height={192}
              className="object-contain h-28 md:h-40 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleAnchor(link.href)}
                className="text-white/80 hover:text-[#C9A84C] text-sm tracking-[0.12em] uppercase font-sans font-light transition-colors duration-200 bg-transparent border-none cursor-pointer"
              >
                {link.label}
              </button>
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
            <button
              onClick={() => handleAnchor('#contacto')}
              className="border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0D0D0D] text-xs tracking-[0.2em] uppercase font-sans px-5 py-2.5 transition-all duration-300 cursor-pointer"
            >
              {t('book')}
            </button>
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
              <button
                key={link.href}
                onClick={() => handleAnchor(link.href)}
                className="text-white/80 hover:text-[#C9A84C] text-base tracking-[0.12em] uppercase font-sans font-light transition-colors text-left bg-transparent border-none cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleAnchor('#contacto')}
              className="mt-2 border border-[#C9A84C] text-[#C9A84C] text-center text-xs tracking-[0.2em] uppercase font-sans px-5 py-3 transition-all cursor-pointer"
            >
              {t('book')}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
