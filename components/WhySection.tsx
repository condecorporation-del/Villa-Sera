'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Lock, Gem, Clock, MapPin } from 'lucide-react';
import SectionHeader from './SectionHeader';

const pillars = [
  { key: 'privacy', icon: Lock },
  { key: 'luxury', icon: Gem },
  { key: 'service', icon: Clock },
  { key: 'location', icon: MapPin },
] as const;

export default function WhySection() {
  const t = useTranslations('why');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="porque" ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background image — sits under a ~90% opaque gradient, so it is
          decorative texture rather than something anyone reads detail from.
          Low quality here is invisible and saves ~250KB. */}
      <Image
        src="/images/CasaSergio139+.jpg"
        alt=""
        aria-hidden
        fill
        quality={45}
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#04141C]/92 via-[#04141C]/80 to-[#04141C]/95" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeader label={t('label')} title={t('title')} inView={inView} />

        {/* Pillars */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#EFE7DA]/10">
          {pillars.map(({ key, icon: Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#04141C]/40 hover:bg-[#12384A]/50 backdrop-blur-[2px] transition-colors duration-500 p-9 lg:p-10"
            >
              <Icon size={22} className="text-[#C9A84C] mb-6" strokeWidth={1.5} />
              <h3
                className="text-[#EFE7DA] text-2xl font-light tracking-[-0.01em] mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-[#EFE7DA]/55 text-sm leading-relaxed font-sans font-light">
                {t(`items.${key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
