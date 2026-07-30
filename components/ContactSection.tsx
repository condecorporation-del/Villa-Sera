'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MessageCircle, Mail, ExternalLink, Send } from 'lucide-react';
import SectionHeader from './SectionHeader';

export default function ContactSection() {
  const t = useTranslations('contact');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const name = data.get('name');
    const msg = data.get('message') || '';
    const checkin = data.get('checkin');
    const checkout = data.get('checkout');
    const guests = data.get('guests');
    const text = `Hola! Soy ${name}. Me interesa reservar Villa Sera.\nLlegada: ${checkin}\nSalida: ${checkout}\nHuéspedes: ${guests}\n${msg}`;
    window.open(`https://wa.me/526242175935?text=${encodeURIComponent(text as string)}`, '_blank');
  };

  return (
    <section id="contacto" ref={ref} className="py-24 lg:py-36 bg-[#0A2430]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeader
          label={t('label')}
          title={t('title')}
          subtitle={t('subtitle')}
          inView={inView}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Contact options */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Direct booking */}
            <div className="border border-[#C9A84C]/25 bg-[#04141C]/40 p-8">
              <h3
                className="text-[#EFE7DA] text-2xl font-light tracking-[-0.01em] mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t('direct.title')}
              </h3>
              <p className="text-[#C9A84C] text-[10px] tracking-[0.22em] uppercase font-sans mb-7">
                {t('direct.subtitle')}
              </p>

              <div className="space-y-3">
                <a
                  href="https://wa.me/526242175935"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-sans tracking-wide px-6 py-4 transition-colors duration-300"
                >
                  <MessageCircle size={18} />
                  <span>{t('direct.whatsapp')} — +52 624 217 5935</span>
                </a>
                <a
                  href="mailto:villasera@seraholding.com"
                  className="flex items-center gap-4 border border-[#EFE7DA]/15 hover:border-[#C9A84C] text-[#EFE7DA]/70 hover:text-[#EFE7DA] text-sm font-sans tracking-wide px-6 py-4 transition-colors duration-300"
                >
                  <Mail size={18} className="text-[#C9A84C]" />
                  <span>{t('direct.email')} — villasera@seraholding.com</span>
                </a>
              </div>
            </div>

            {/* Airbnb */}
            <div className="border border-[#EFE7DA]/10 p-8">
              <h3
                className="text-[#EFE7DA] text-2xl font-light tracking-[-0.01em] mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t('airbnb.title')}
              </h3>
              <p className="text-[#EFE7DA]/35 text-[10px] tracking-[0.22em] uppercase font-sans mb-7">
                {t('airbnb.subtitle')}
              </p>
              <a
                href="https://www.airbnb.mx/rooms/1583142544563137626"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border border-[#FF5A5F]/40 hover:border-[#FF5A5F] text-[#FF5A5F]/80 hover:text-[#FF5A5F] text-sm font-sans tracking-wide px-6 py-4 transition-all duration-300"
              >
                <ExternalLink size={16} />
                {t('airbnb.cta')}
              </a>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: 'name', label: t('form.name'), type: 'text' },
                { name: 'email', label: t('form.email'), type: 'email' },
              ].map((field) => (
                <input
                  key={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.label}
                  required
                  className="w-full bg-[#04141C]/60 border border-[#EFE7DA]/12 focus:border-[#C9A84C] text-[#EFE7DA] placeholder:text-[#EFE7DA]/30 text-sm font-sans px-5 py-4 outline-none transition-colors"
                />
              ))}

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="checkin"
                  type="date"
                  placeholder={t('form.checkin')}
                  className="bg-[#04141C]/60 border border-[#EFE7DA]/12 focus:border-[#C9A84C] text-[#EFE7DA]/70 text-sm font-sans px-5 py-4 outline-none transition-colors"
                />
                <input
                  name="checkout"
                  type="date"
                  placeholder={t('form.checkout')}
                  className="bg-[#04141C]/60 border border-[#EFE7DA]/12 focus:border-[#C9A84C] text-[#EFE7DA]/70 text-sm font-sans px-5 py-4 outline-none transition-colors"
                />
              </div>

              <input
                name="guests"
                type="number"
                min="1"
                max="20"
                placeholder={t('form.guests')}
                className="w-full bg-[#04141C]/60 border border-[#EFE7DA]/12 focus:border-[#C9A84C] text-[#EFE7DA] placeholder:text-[#EFE7DA]/30 text-sm font-sans px-5 py-4 outline-none transition-colors"
              />

              <textarea
                name="message"
                rows={4}
                placeholder={t('form.message')}
                className="w-full bg-[#04141C]/60 border border-[#EFE7DA]/12 focus:border-[#C9A84C] text-[#EFE7DA] placeholder:text-[#EFE7DA]/30 text-sm font-sans px-5 py-4 outline-none transition-colors resize-none"
              />

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2.5 bg-[#C9A84C] hover:bg-[#EFE7DA] text-[#04141C] text-[11px] tracking-[0.18em] uppercase font-sans font-semibold py-4 transition-colors duration-300"
              >
                <Send size={14} />
                {t('form.submit')}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
