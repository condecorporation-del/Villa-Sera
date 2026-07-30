'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star } from 'lucide-react';
import SectionHeader from './SectionHeader';

export default function TestimonialsSection() {
  const t = useTranslations('testimonials');
  const locale = useLocale();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const items = t.raw('items') as Array<{
    quote: string;
    author: string;
    origin: string;
  }>;

  return (
    <section id="testimonios" ref={ref} className="py-24 lg:py-36 bg-[#04141C]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeader label={t('label')} title={t('title')} inView={inView} />

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#EFE7DA]/10">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#0A2430] p-10 flex flex-col"
            >
              <div className="flex gap-1 mb-7">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={11} className="text-[#C9A84C] fill-[#C9A84C]" />
                ))}
              </div>

              <p
                className="text-[#EFE7DA]/80 text-lg leading-[1.6] font-light flex-1 mb-9"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {item.quote}
              </p>

              <div className="border-t border-[#EFE7DA]/10 pt-6">
                <p className="text-[#EFE7DA] text-sm font-sans font-medium tracking-wide">
                  {item.author}
                </p>
                <p className="text-[#EFE7DA]/35 text-[10px] tracking-[0.22em] uppercase font-sans mt-1.5">
                  {item.origin}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Airbnb link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10"
        >
          <a
            href="https://www.airbnb.mx/rooms/1583142544563137626"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#EFE7DA]/40 hover:text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-sans transition-colors"
          >
            {locale === 'es' ? 'Ver más reseñas en Airbnb' : 'Read more reviews on Airbnb'} →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
