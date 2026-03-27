'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ChefHat, BellRing, Sailboat, Sparkles, Bike, Star, ArrowRight } from 'lucide-react';

const services = [
  { key: 'chef', icon: ChefHat },
  { key: 'butler', icon: BellRing },
  { key: 'yacht', icon: Sailboat },
  { key: 'massage', icon: Sparkles },
  { key: 'activities', icon: Bike },
  { key: 'concierge', icon: Star },
] as const;

export default function ServicesSection() {
  const t = useTranslations('services');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="servicios" ref={ref} className="py-24 lg:py-32 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
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
            className="text-white text-4xl lg:text-5xl font-light tracking-wide mb-4"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {t('title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/50 text-base font-sans font-light max-w-xl mx-auto mb-6"
          >
            {t('subtitle')}
          </motion.p>
          {/* Optional badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="inline-flex items-center gap-2 border border-[#C9A84C]/40 px-4 py-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
            <span className="text-[#C9A84C]/80 text-[10px] tracking-[0.3em] uppercase font-sans">
              {t('optional_badge')}
            </span>
          </motion.div>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
          {services.map(({ key, icon: Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-[#0D0D0D] p-10 group hover:bg-[#A0342A]/10 transition-colors duration-300"
            >
              <div className="mb-6">
                <Icon
                  size={24}
                  className="text-[#C9A84C] group-hover:scale-110 transition-transform duration-300"
                  strokeWidth={1.5}
                />
              </div>
              <h3
                className="text-white text-2xl font-light tracking-wide mb-3"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                {t(`items.${key}.title`)}
              </h3>
              <div className="w-8 h-px bg-[#C9A84C] mb-4 group-hover:w-12 transition-all duration-300" />
              <p className="text-white/50 text-sm leading-relaxed font-sans font-light mb-6">
                {t(`items.${key}.description`)}
              </p>
              <a
                href={`https://wa.me/526242175935?text=${encodeURIComponent(`Hola! Me interesa el servicio de ${t(`items.${key}.title`)} en Villa Sera.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#C9A84C]/60 hover:text-[#C9A84C] text-[10px] tracking-[0.25em] uppercase font-sans transition-all duration-300 group"
              >
                {t('cta')}
                <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
