'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import SectionHeader from './SectionHeader';

const experiences = [
  {
    key: 'chef',
    image: '/images/CasaSergio238.jpg',
    alt: 'Private dinner under the stars',
  },
  {
    key: 'yacht',
    image: '/images/yacht neptuno.jpg',
    alt: 'Private yacht charter',
  },
  {
    key: 'wellness',
    image: '/images/wellness-terrace.jpg',
    alt: 'In-villa wellness',
  },
] as const;

export default function ExperiencesSection() {
  const t = useTranslations('experiences');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="experiencias" ref={ref} className="py-24 lg:py-36 bg-[#04141C]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeader label={t('label')} title={t('title')} inView={inView} />

        {/* Experience cards */}
        <div className="space-y-4 lg:space-y-6">
          {experiences.map(({ key, image, alt }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch"
            >
              {/* Image */}
              <div
                className={`relative h-72 lg:h-[26rem] overflow-hidden lg:col-span-7 ${
                  i % 2 === 1 ? 'lg:order-2' : ''
                }`}
              >
                <Image
                  src={image}
                  alt={alt}
                  fill
                  quality={75}
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-[1400ms] ease-out"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04141C]/40 to-transparent" />
              </div>

              {/* Text */}
              <div
                className={`bg-[#0A2430] p-10 lg:p-14 flex flex-col justify-center lg:col-span-5 ${
                  i % 2 === 1 ? 'lg:order-1' : ''
                }`}
              >
                <h3
                  className="text-[#EFE7DA] text-3xl lg:text-[2.5rem] font-light leading-[1.1] tracking-[-0.02em] mb-5"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {t(`items.${key}.title`)}
                </h3>
                <p className="text-[#EFE7DA]/55 text-base leading-[1.75] font-sans font-light mb-9">
                  {t(`items.${key}.description`)}
                </p>
                <a
                  href="https://wa.me/526242175935"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 self-start text-[#C9A84C] hover:text-[#E4703A] text-[11px] tracking-[0.18em] uppercase font-sans border-b border-[#C9A84C]/30 hover:border-[#E4703A] pb-1.5 transition-colors duration-300"
                >
                  {t(`items.${key}.cta`)}
                  <ArrowRight size={13} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
