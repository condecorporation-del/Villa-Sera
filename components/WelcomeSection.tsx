'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Waves, TreePalm, ShieldCheck, Users, BedDouble } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.09, ease },
  }),
};

export default function WelcomeSection() {
  const t = useTranslations('welcome');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const features = [
    { key: 'layout', icon: BedDouble, full: true },
    { key: 'beach', icon: Waves, full: false },
    { key: 'ocean', icon: TreePalm, full: false },
    { key: 'privacy', icon: ShieldCheck, full: false },
    { key: 'staff', icon: Users, full: false },
  ] as const;

  return (
    <section id="bienvenida" ref={ref} className="py-24 lg:py-36 bg-[#04141C]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-center">
          {/* Text */}
          <div className="lg:col-span-6">
            <motion.p
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="text-[#C9A84C] text-[10px] tracking-[0.22em] uppercase font-sans mb-7"
            >
              {t('label')}
            </motion.p>

            <motion.h2
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="text-[#EFE7DA] text-4xl sm:text-5xl lg:text-[3.75rem] font-light leading-[1.05] tracking-[-0.025em] mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('title')}
            </motion.h2>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="text-[#E4703A] text-xl font-light italic mb-9"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('subtitle')}
            </motion.p>

            <motion.p
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="text-[#EFE7DA]/60 text-base leading-[1.75] font-sans font-light mb-12 max-w-lg"
            >
              {t('description')}
            </motion.p>

            {/* Feature list */}
            <div className="grid grid-cols-2 gap-x-8">
              {features.map(({ key, icon: Icon, full }, i) => (
                <motion.div
                  key={key}
                  custom={4 + i}
                  variants={fadeUp}
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  className={`flex items-center gap-3 py-4 border-b border-[#EFE7DA]/10 ${
                    full ? 'col-span-2' : ''
                  }`}
                >
                  <Icon size={15} className="text-[#C9A84C] shrink-0" strokeWidth={1.5} />
                  <span className="text-[11px] tracking-[0.14em] uppercase font-sans text-[#EFE7DA]/70">
                    {t(`features.${key}`)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Images — offset editorial stack rather than a flat grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.25, ease }}
            className="lg:col-span-6 grid grid-cols-2 gap-4"
          >
            <div className="relative h-[300px] sm:h-[420px] lg:h-[520px] overflow-hidden lg:mt-14">
              <Image
                src="/images/CasaSergio126.jpg"
                alt="Villa Sera fachada"
                fill
                quality={75}
                className="object-cover hover:scale-[1.04] transition-transform duration-[1200ms] ease-out"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="relative overflow-hidden">
                <Image
                  src="/images/livingroom villa serena.jpg"
                  alt="Villa Sera sala principal"
                  fill
                  quality={75}
                  className="object-cover hover:scale-[1.04] transition-transform duration-[1200ms] ease-out"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative overflow-hidden">
                <Image
                  src="/images/master room 1.jpg"
                  alt="Villa Sera master suite"
                  fill
                  quality={75}
                  className="object-cover hover:scale-[1.04] transition-transform duration-[1200ms] ease-out"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
