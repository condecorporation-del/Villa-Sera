'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Mail, Phone } from 'lucide-react';

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
