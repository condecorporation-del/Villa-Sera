'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import VillaConditions from './VillaConditions';

const ease = [0.16, 1, 0.3, 1] as const;

export default function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden bg-[#04141C]">
      {/* Background image — slow drift keeps the water feeling alive */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease }}
        className="absolute inset-0"
      >
        <Image
          src="/images/CasaSergio233.jpg"
          alt="Villa Sera — Los Cabos sunset"
          fill
          priority
          quality={80}
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      {/* Depth gradient: the page's own water tone, not flat black */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#04141C]/75 via-[#04141C]/35 to-[#04141C]" />

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        {/* Timings are deliberately tight: the h1 is this page's LCP element,
            so every millisecond of delay/duration here is a millisecond of
            Largest Contentful Paint. The sequence still reads as a reveal. */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease }}
          className="text-[#C9A84C] text-[10px] tracking-[0.32em] uppercase font-sans mb-8"
        >
          {t('location')}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease }}
          className="text-[#EFE7DA] text-6xl sm:text-7xl md:text-[7.5rem] font-light leading-[0.92] tracking-[-0.035em] mb-7"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Villa Sera
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32, ease }}
          className="text-[#EFE7DA]/70 text-base sm:text-lg font-light leading-relaxed mb-11 font-sans max-w-xl mx-auto"
        >
          {t('tagline')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease }}
          className="flex justify-center"
        >
          <a
            href="https://wa.me/526242175935"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-3 bg-[#C9A84C] hover:bg-[#EFE7DA] text-[#04141C] text-[11px] tracking-[0.18em] uppercase font-sans font-semibold px-9 py-4 transition-colors duration-300"
          >
            <MessageCircle size={15} strokeWidth={2} />
            {t('cta_whatsapp')}
          </a>
        </motion.div>
      </div>

      {/* Signature: what it is actually like at the villa right now */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-0 left-0 right-0 z-20 border-t border-[#EFE7DA]/10 bg-[#04141C]/40 backdrop-blur-sm py-4 px-6"
      >
        <VillaConditions />
      </motion.div>
    </section>
  );
}
