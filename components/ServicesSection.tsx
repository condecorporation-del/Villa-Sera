'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ChefHat, BellRing, Sailboat, Sparkles, Bike, Star, ArrowRight } from 'lucide-react';
import SectionHeader from './SectionHeader';

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
    <section id="servicios" ref={ref} className="py-24 lg:py-36 bg-[#0A2430]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeader
          label={t('label')}
          title={t('title')}
          subtitle={t('subtitle')}
          inView={inView}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-2.5 mt-7 border border-[#C9A84C]/30 px-4 py-2"
          >
            <span className="w-1 h-1 rounded-full bg-[#C9A84C]" />
            <span className="text-[#C9A84C]/85 text-[9px] tracking-[0.22em] uppercase font-sans">
              {t('optional_badge')}
            </span>
          </motion.div>
        </SectionHeader>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#EFE7DA]/10">
          {services.map(({ key, icon: Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#0A2430] p-10 group hover:bg-[#12384A] transition-colors duration-500"
            >
              <Icon size={20} className="text-[#C9A84C] mb-7" strokeWidth={1.5} />
              <h3
                className="text-[#EFE7DA] text-2xl font-light tracking-[-0.01em] mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-[#EFE7DA]/50 text-sm leading-[1.7] font-sans font-light mb-8">
                {t(`items.${key}.description`)}
              </p>
              <a
                href={`https://wa.me/526242175935?text=${encodeURIComponent(`Hola! Me interesa el servicio de ${t(`items.${key}.title`)} en Villa Sera.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#EFE7DA]/55 group-hover:text-[#C9A84C] text-[10px] tracking-[0.18em] uppercase font-sans transition-colors duration-300"
              >
                {t('cta')}
                <ArrowRight size={11} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
