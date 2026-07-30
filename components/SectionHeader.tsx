'use client';

import { motion } from 'framer-motion';

/**
 * Editorial section header: the label sits in a narrow left column and the
 * headline runs wide on the right. Replaces the centered eyebrow/title/subtitle
 * stack that every section used to repeat identically.
 */
export default function SectionHeader({
  label,
  title,
  subtitle,
  inView,
  tone = 'dark',
  children,
}: {
  label: string;
  title: string;
  subtitle?: string;
  inView: boolean;
  tone?: 'dark' | 'light';
  children?: React.ReactNode;
}) {
  const titleColor = tone === 'dark' ? 'text-[#EFE7DA]' : 'text-[#04141C]';
  const subColor = tone === 'dark' ? 'text-[#EFE7DA]/55' : 'text-[#04141C]/60';
  const ruleColor = tone === 'dark' ? 'bg-[#EFE7DA]/20' : 'bg-[#04141C]/15';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mb-16 lg:mb-20">
      {/* Label column */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="lg:col-span-3 flex items-start gap-4 pt-2"
      >
        <span className={`hidden lg:block h-px w-8 mt-2 shrink-0 ${ruleColor}`} />
        <span className="text-[#C9A84C] text-[10px] tracking-[0.22em] uppercase font-sans">
          {label}
        </span>
      </motion.div>

      {/* Headline column */}
      <div className="lg:col-span-9">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`${titleColor} text-4xl sm:text-5xl lg:text-[3.75rem] font-light leading-[1.05] tracking-[-0.02em] max-w-3xl`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </motion.h2>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.12 }}
            className={`${subColor} text-base leading-relaxed font-sans font-light max-w-xl mt-6`}
          >
            {subtitle}
          </motion.p>
        )}

        {children}
      </div>
    </div>
  );
}
