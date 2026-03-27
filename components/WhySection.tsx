'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Lock, Gem, Clock, MapPin } from 'lucide-react';

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
      {/* Background image */}
      <Image
        src="/images/CasaSergio139+.jpg"
        alt="Villa Sera aerial Los Cabos"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[#0D0D0D]/80" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[#C9A84C] text-xs tracking-[0.35em] uppercase font-sans mb-4"
          >
            {t('label')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-white text-4xl lg:text-5xl font-light tracking-wide"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {t('title')}
          </motion.h2>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
          {pillars.map(({ key, icon: Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="bg-transparent hover:bg-white/5 transition-colors duration-300 p-10 text-center"
            >
              <Icon
                size={28}
                className="text-[#C9A84C] mx-auto mb-5"
                strokeWidth={1.5}
              />
              <h3
                className="text-white text-2xl font-light tracking-wide mb-2"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-white/50 text-sm font-sans font-light">
                {t(`items.${key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
