'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Mail, Phone, MapPin } from 'lucide-react';

const SOCIAL = {
  google:
    'https://www.google.com/maps/search/?api=1&query=Villa+Sera+Los+Cabos',
  instagram: 'https://www.instagram.com/villasera/',
  tiktok: 'https://www.tiktok.com/@villaseraloscabos',
} as const;

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const locale = useLocale();
  const year = new Date().getFullYear();

  const links = [
    { href: '/servicios' as const, label: nav('services') },
    { href: '/galeria' as const, label: nav('gallery') },
    { href: '/experiencias' as const, label: nav('experiences') },
    { href: '/contacto' as const, label: nav('contact') },
  ];

  return (
    <footer className="bg-[#0D0D0D] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <h2
                className="text-[#C9A84C] text-3xl font-light tracking-[0.2em] uppercase"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                Villa Sera
              </h2>
              <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mt-1">
                Los Cabos, México
              </p>
            </div>
            <p className="text-white/60 text-sm leading-relaxed font-sans font-light">
              {t('tagline')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-6 font-sans">
              {locale === 'es' ? 'Navegación' : 'Navigation'}
            </h3>
            <nav className="space-y-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-white/70 hover:text-[#C9A84C] text-sm tracking-wide font-sans font-light transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-6 font-sans">
              {locale === 'es' ? 'Contacto' : 'Contact'}
            </h3>
            <div className="space-y-3">
              <a
                href="https://wa.me/526242175935"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/70 hover:text-[#C9A84C] text-sm font-sans font-light transition-colors"
              >
                <Phone size={14} className="text-[#C9A84C]" />
                +52 624 217 5935
              </a>
              <a
                href="mailto:villasera@seraholding.com"
                className="flex items-center gap-3 text-white/70 hover:text-[#C9A84C] text-sm font-sans font-light transition-colors"
              >
                <Mail size={14} className="text-[#C9A84C]" />
                villasera@seraholding.com
              </a>
              <a
                href="https://www.airbnb.mx/rooms/1583142544563137626"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/70 hover:text-[#C9A84C] text-sm font-sans font-light transition-colors"
              >
                <svg
                  className="text-[#C9A84C]"
                  width="14"
                  height="14"
                  viewBox="0 0 32 32"
                  fill="currentColor"
                >
                  <path d="M16 1C7.715 1 1 7.715 1 16s6.715 15 15 15 15-6.715 15-15S24.285 1 16 1zm0 4c2.51 0 4.785 1.01 6.44 2.64L16 14.28 9.56 7.64C11.215 6.01 13.49 5 16 5zm0 22c-5.205 0-9.52-3.765-10.47-8.7L16 10.72l10.47 7.58C25.52 23.235 21.205 27 16 27z" />
                </svg>
                Airbnb
              </a>
            </div>
            <h3 className="text-white/40 text-[10px] tracking-[0.3em] uppercase mt-8 mb-4 font-sans">
              {t('social_title')}
            </h3>
            <div className="space-y-3">
              <a
                href={SOCIAL.google}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/70 hover:text-[#C9A84C] text-sm font-sans font-light transition-colors"
              >
                <MapPin size={14} className="text-[#C9A84C] shrink-0" aria-hidden />
                {t('social_google')}
              </a>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/70 hover:text-[#C9A84C] text-sm font-sans font-light transition-colors"
              >
                <svg
                  className="text-[#C9A84C] shrink-0"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                {t('social_instagram')}
              </a>
              <a
                href={SOCIAL.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/70 hover:text-[#C9A84C] text-sm font-sans font-light transition-colors"
              >
                <svg
                  className="text-[#C9A84C] shrink-0"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64v-3.5a6.33 6.33 0 00-1-.1 6.34 6.34 0 000 12.68 6.34 6.34 0 006.34-6.35V8.15a8.16 8.16 0 004.77 1.52v-3.5a4.85 4.85 0 01-1-.48z" />
                </svg>
                {t('social_tiktok')}
              </a>
            </div>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/30 text-xs font-sans tracking-wide">
            © {year} Villa Sera · {t('company')}. {t('rights')}.
          </p>
          <p className="text-white/20 text-[10px] tracking-widest uppercase font-sans">
            Los Cabos, Baja California Sur
          </p>
        </div>
      </div>
    </footer>
  );
}
