'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Waves, TreePalm, ShieldCheck, Users } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15 },
  }),
};

export default function WelcomeSection() {
  const t = useTranslations('welcome');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const features = [
    { key: 'beach', icon: Waves },
    { key: 'ocean', icon: TreePalm },
    { key: 'privacy', icon: ShieldCheck },
    { key: 'staff', icon: Users },
  ] as const;

  return (
    <section id="bienvenida" ref={ref} className="py-24 lg:py-32 bg-[#F8F4EF]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <motion.p
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="text-[#C9A84C] text-xs tracking-[0.35em] uppercase font-sans mb-4"
            >
              {t('label')}
            </motion.p>

            <motion.h2
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="text-[#0D0D0D] text-5xl lg:text-6xl font-light tracking-wide mb-2"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {t('title')}
            </motion.h2>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="text-[#A0342A] text-xl font-light italic mb-8"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="w-16 h-px bg-[#C9A84C] mb-8"
            />

            <motion.p
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="text-[#0D0D0D]/70 text-base leading-relaxed font-sans font-light mb-12"
            >
              {t('description')}
            </motion.p>

            {/* Feature pills */}
            <div className="grid grid-cols-2 gap-4">
              {features.map(({ key, icon: Icon }, i) => (
                <motion.div
                  key={key}
                  custom={4 + i}
                  variants={fadeUp}
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  className="flex items-center gap-3 py-3 border-b border-[#E5DDD4]"
                >
                  <Icon size={16} className="text-[#C9A84C] shrink-0" />
                  <span className="text-sm tracking-[0.08em] uppercase font-sans text-[#0D0D0D]/80">
                    {t(`features.${key}`)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Images grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="grid grid-cols-2 gap-3 h-[520px]"
          >
            <div className="relative rounded-sm overflow-hidden row-span-2">
              <Image
                src="/images/CasaSergio126.jpg"
                alt="Villa Sera fachada"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="relative rounded-sm overflow-hidden">
              <Image
                src="/images/livingroom villa serena.jpg"
                alt="Villa Sera sala principal"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="relative rounded-sm overflow-hidden">
              <Image
                src="/images/master room 1.jpg"
                alt="Villa Sera master suite"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
