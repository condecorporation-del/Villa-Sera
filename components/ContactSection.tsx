'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MessageCircle, Mail, ExternalLink, Send } from 'lucide-react';

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
    <section id="contacto" ref={ref} className="py-24 lg:py-32 bg-[#0D0D0D]">
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
            className="text-white/50 font-sans font-light"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Contact options */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Direct booking */}
            <div className="border border-[#C9A84C]/30 p-8">
              <h3
                className="text-white text-2xl font-light mb-1"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                {t('direct.title')}
              </h3>
              <p className="text-[#C9A84C] text-xs tracking-widest uppercase font-sans mb-6">
                {t('direct.subtitle')}
              </p>

              <div className="space-y-4">
                <a
                  href="https://wa.me/526242175935"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-sans tracking-wide px-6 py-4 transition-colors duration-300 group"
                >
                  <MessageCircle size={18} />
                  <span>{t('direct.whatsapp')} — +52 624 217 5935</span>
                </a>
                <a
                  href="mailto:villasera@seraholding.com"
                  className="flex items-center gap-4 border border-white/20 hover:border-[#C9A84C] text-white/70 hover:text-white text-sm font-sans tracking-wide px-6 py-4 transition-all duration-300"
                >
                  <Mail size={18} className="text-[#C9A84C]" />
                  <span>{t('direct.email')} — villasera@seraholding.com</span>
                </a>
              </div>
            </div>

            {/* Airbnb */}
            <div className="border border-white/10 p-8">
              <h3
                className="text-white text-2xl font-light mb-1"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                {t('airbnb.title')}
              </h3>
              <p className="text-white/40 text-xs tracking-widest uppercase font-sans mb-6">
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
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
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
                  className="w-full bg-white/5 border border-white/10 focus:border-[#C9A84C] text-white placeholder:text-white/30 text-sm font-sans px-5 py-4 outline-none transition-colors"
                />
              ))}

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="checkin"
                  type="date"
                  placeholder={t('form.checkin')}
                  className="bg-white/5 border border-white/10 focus:border-[#C9A84C] text-white/70 text-sm font-sans px-5 py-4 outline-none transition-colors"
                />
                <input
                  name="checkout"
                  type="date"
                  placeholder={t('form.checkout')}
                  className="bg-white/5 border border-white/10 focus:border-[#C9A84C] text-white/70 text-sm font-sans px-5 py-4 outline-none transition-colors"
                />
              </div>

              <input
                name="guests"
                type="number"
                min="1"
                max="20"
                placeholder={t('form.guests')}
                className="w-full bg-white/5 border border-white/10 focus:border-[#C9A84C] text-white placeholder:text-white/30 text-sm font-sans px-5 py-4 outline-none transition-colors"
              />

              <textarea
                name="message"
                rows={4}
                placeholder={t('form.message')}
                className="w-full bg-white/5 border border-white/10 focus:border-[#C9A84C] text-white placeholder:text-white/30 text-sm font-sans px-5 py-4 outline-none transition-colors resize-none"
              />

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2.5 bg-[#C9A84C] hover:bg-[#DFC07A] text-[#0D0D0D] text-sm tracking-[0.2em] uppercase font-sans font-medium py-4 transition-all duration-300"
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
