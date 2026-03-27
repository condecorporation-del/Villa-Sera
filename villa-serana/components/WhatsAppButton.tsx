'use client';

import { useTranslations } from 'next-intl';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '526242175935';

export default function WhatsAppButton() {
  const t = useTranslations('whatsapp');

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('tooltip')}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] text-white px-4 py-3 shadow-xl hover:bg-[#1DA851] transition-all duration-300 hover:shadow-2xl hover:scale-105 group"
      style={{ borderRadius: '50px' }}
    >
      <MessageCircle size={20} fill="white" strokeWidth={0} />
      <span className="text-sm font-sans font-medium tracking-wide hidden sm:inline">
        {t('tooltip')}
      </span>
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-20 pointer-events-none" style={{ borderRadius: '50px' }} />
    </a>
  );
}
