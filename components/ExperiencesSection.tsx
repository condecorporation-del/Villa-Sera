'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const experiences = [
  {
    key: 'chef',
    image: '/images/CasaSergio238.jpg',
    alt: 'Private dinner under the stars',
  },
  {
    key: 'yacht',
    image: '/images/CasaSergio182.jpg',
    alt: 'Private yacht charter',
  },
  {
    key: 'wellness',
    image: '/images/CasaSergio181.jpg',
    alt: 'In-villa wellness',
  },
] as const;

export default function ExperiencesSection() {
  const t = useTranslations('experiences');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="experiencias" ref={ref} className="py-24 lg:py-32 bg-[#F8F4EF]">
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
            className="text-[#0D0D0D] text-4xl lg:text-5xl font-light tracking-wide"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {t('title')}
          </motion.h2>
        </div>

        {/* Experience cards */}
        <div className="space-y-16">
          {experiences.map(({ key, image, alt }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch ${
                i % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <div
                className={`relative h-72 lg:h-96 overflow-hidden ${
                  i % 2 === 1 ? 'lg:order-2' : ''
                }`}
              >
                <Image
                  src={image}
                  alt={alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Text */}
              <div
                className={`bg-[#0D0D0D] p-10 lg:p-14 flex flex-col justify-center ${
                  i % 2 === 1 ? 'lg:order-1' : ''
                }`}
              >
                <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase font-sans mb-4">
                  0{i + 1}
                </p>
                <h3
                  className="text-white text-3xl lg:text-4xl font-light tracking-wide mb-4"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  {t(`items.${key}.title`)}
                </h3>
                <div className="w-12 h-px bg-[#C9A84C] mb-6" />
                <p className="text-white/60 text-base leading-relaxed font-sans font-light mb-8">
                  {t(`items.${key}.description`)}
                </p>
                <a
                  href="https://wa.me/526242175935"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#C9A84C] text-sm tracking-[0.15em] uppercase font-sans hover:gap-4 transition-all duration-300 group"
                >
                  {t(`items.${key}.cta`)}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
