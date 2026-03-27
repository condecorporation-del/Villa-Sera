'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const t = useTranslations('testimonials');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const items = t.raw('items') as Array<{
    quote: string;
    author: string;
    origin: string;
  }>;

  return (
    <section id="testimonios" ref={ref} className="py-24 lg:py-32 bg-[#F8F4EF]">
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

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="bg-white border border-[#E5DDD4] p-10 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={12} className="text-[#C9A84C] fill-[#C9A84C]" />
                ))}
              </div>

              {/* Quote mark */}
              <span
                className="text-[#C9A84C] text-6xl font-light leading-none mb-2 select-none"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                "
              </span>

              <p className="text-[#0D0D0D]/70 text-base leading-relaxed font-sans font-light italic flex-1 mb-8">
                {item.quote}
              </p>

              <div className="border-t border-[#E5DDD4] pt-6">
                <p
                  className="text-[#0D0D0D] text-lg font-light"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  {item.author}
                </p>
                <p className="text-[#0D0D0D]/40 text-xs tracking-widest uppercase font-sans mt-1">
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
          className="text-center mt-10"
        >
          <a
            href="https://www.airbnb.mx/rooms/1583142544563137626"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D0D0D]/40 hover:text-[#C9A84C] text-xs tracking-[0.25em] uppercase font-sans transition-colors"
          >
            Ver más reseñas en Airbnb →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
