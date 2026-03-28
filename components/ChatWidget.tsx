'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { X, ChevronRight, ChevronDown, ExternalLink, Send, Phone, Calendar, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WHATSAPP = '526242175935';
const EMAIL = 'villasera@seraholding.com';
const AIRBNB_URL = 'https://www.airbnb.mx/rooms/1583142544563137626';

const kb = {
  es: {
    greeting: '¡Hola! Soy el concierge de Villa Sera.\nEstoy aquí para responder cualquier duda sobre la villa, los servicios y Los Cabos.',
    faqLabel: 'Preguntas frecuentes',
    menu: [
      { label: '📋 Resumen de la villa', value: 'overview' },
      { label: '🛏️ Habitaciones y baños', value: 'rooms' },
      { label: '📍 Ubicación y vista al Arco', value: 'location' },
      { label: '🏖️ Playa privada', value: 'beach' },
      { label: '🌮 Los Cabos — qué hacer', value: 'cabos' },
      { label: '🍽️ Chef y servicios extra', value: 'chef' },
      { label: '⛵ Yates y actividades', value: 'yacht' },
      { label: '💆 Masajes y bienestar', value: 'massage' },
      { label: '🔗 Ver en Airbnb', value: 'airbnb', external: true },
    ],
    answers: {
      overview: 'Villa Sera en números 🏡\n\n• 4 recámaras · 4 baños completos\n• Playa privada nadable — acceso directo desde la villa\n• Vista directa al Arco de Cabo San Lucas y el Mar de Cortés\n• ~5 min al downtown de Cabo San Lucas\n• Propiedad exclusiva: un solo grupo a la vez\n• Servicios opcionales: chef privado, mayordomo, yate, spa',
      rooms: 'Distribución de Villa Sera 🛏️\n\n• 4 recámaras — amplias, luminosas, vistas al mar\n• 4 baños completos — acabados de lujo\n• Diseño pensado para grupos o familias que valoran privacidad y comodidad real\n\nPara fotos detalladas, el listado en Airbnb documenta cada espacio.',
      location: 'Ubicación — uno de los puntos más fuertes 📍\n\n• Vista al Arco de Cabo San Lucas desde la villa y la playa\n• ~5 min al centro de Cabo (restaurantes, marina, nightlife)\n• Mar de Cortés frente a ti — uno de los mares más biodiversos del mundo\n• Equilibrio perfecto: exclusividad sin aislamiento',
      beach: 'La playa privada es uno de los diferenciales de Villa Sera 🏖️\n\n• Exclusiva para huéspedes — no es playa pública\n• Nadable: aguas del Mar de Cortés tranquilas\n• Acceso directo desde la propiedad\n• Perfecta para nadar, kayak, paddleboard o simplemente descansar con total privacidad',
      cabos: 'Los Cabos — todo lo que puedes hacer cerca 🌮\n\n🍽️ GASTRONOMÍA\n• Edith\'s, Flora Farms, Manta, Nick-San\n• Mercado del Mar para mariscos frescos\n\n🌊 MAR Y AVENTURA\n• Tour al Arco de Cabo San Lucas (15 min en lancha)\n• Snorkel en El Arco — leones marinos\n• Pesca deportiva — marlin, dorado, atún\n• Avistamiento de ballenas (enero–marzo)\n\n🏌️ GOLF Y LUJO\n• Quivira, Diamante, Cabo del Sol\n• Spa en Esperanza o One&Only Palmilla\n\n🎉 VIDA NOCTURNA\n• Cabo Wabo, Squid Roe, Médano Beach',
      chef: 'Gastronomía en Villa Sera 🍳\n\nEl chef privado es un servicio opcional:\n\n• Menús personalizados con ingredientes locales\n• Desayunos gourmet, comidas y cenas\n• Cenas de gala en la terraza con vista al Mar de Cortés\n• Maridajes de vino y cócteles de autor\n• Se adapta a cualquier restricción alimentaria\n\nTambién disponible: mayordomo 24/7.\nCotización por WhatsApp.',
      yacht: 'Experiencias en el mar ⛵\n\n• Yate privado al Arco de Cabo San Lucas\n• Snorkel en El Arco — leones marinos\n• Pesca deportiva (marlin, dorado, wahoo)\n• Crucero al atardecer con champagne\n• Avistamiento de ballenas (enero–marzo)\n• Paddleboard y kayak desde la playa privada\n\nTodo se organiza a la carta. Coordinamos por WhatsApp.',
      massage: 'Bienestar en la villa 💆\n\nTerapeutas certificados acuden directamente a Villa Sera:\n\n• Masajes sueco, tejido profundo y relajación\n• Tratamientos faciales y aromaterapia\n• Sesiones de meditación al amanecer frente al mar\n• Yoga privado en la terraza\n\nCon cita previa. Lo coordinamos por WhatsApp.',
    } as Record<string, string>,
    book: {
      prompt: 'Elige cómo quieres reservar:',
      whatsappMsg: 'Hola, quiero información o reserva en Villa Sera (4 hab / 4 baños, playa privada, Los Cabos). Fechas: [indicar]. Huéspedes: [número].',
      emailSubject: 'Reserva / consulta Villa Sera — Los Cabos',
      emailBody: 'Hola,\n\nMe interesa Villa Sera (4 habitaciones, 4 baños, playa privada nadable, vista al Arco).\n\nFechas deseadas:\nNúmero de huéspedes:\n\nGracias.',
    },
    back: 'Volver a preguntas',
    bookBtn: 'Reservar',
  },
  en: {
    greeting: 'Hi! I\'m Villa Sera\'s concierge.\nI\'m here to answer any questions about the villa, services and Los Cabos.',
    faqLabel: 'Frequently asked questions',
    menu: [
      { label: '📋 Villa overview', value: 'overview' },
      { label: '🛏️ Bedrooms & bathrooms', value: 'rooms' },
      { label: '📍 Location & Arch view', value: 'location' },
      { label: '🏖️ Private beach', value: 'beach' },
      { label: '🌮 Los Cabos — what to do', value: 'cabos' },
      { label: '🍽️ Chef & add-on services', value: 'chef' },
      { label: '⛵ Yachts & activities', value: 'yacht' },
      { label: '💆 Massage & wellness', value: 'massage' },
      { label: '🔗 View on Airbnb', value: 'airbnb', external: true },
    ],
    answers: {
      overview: 'Villa Sera at a glance 🏡\n\n• 4 bedrooms · 4 full bathrooms\n• Private swimmable beach — direct access from the villa\n• Direct view of the Arch of Cabo San Lucas & Sea of Cortez\n• ~5 min to downtown Cabo San Lucas\n• Exclusive property: one group at a time\n• Optional services: private chef, butler, yacht, spa',
      rooms: 'Villa Sera layout 🛏️\n\n• 4 bedrooms — spacious, bright, Sea of Cortez views\n• 4 full bathrooms — luxury finishes\n• Designed for groups or families who value real privacy and comfort\n\nFor room-by-room photos, the Airbnb listing documents every space.',
      location: 'Location — one of Villa Sera\'s biggest strengths 📍\n\n• View of the Arch of Cabo San Lucas from the villa and the beach\n• ~5 min to downtown Cabo (restaurants, marina, nightlife)\n• Sea of Cortez right in front — one of the most biodiverse seas in the world\n• Perfect balance: exclusivity without isolation',
      beach: 'The private beach is one of Villa Sera\'s key differentiators 🏖️\n\n• Exclusive to villa guests — not a public beach\n• Swimmable: calm Sea of Cortez waters\n• Direct access from the property\n• Perfect for swimming, kayaking, paddleboarding, or relaxing in total privacy',
      cabos: 'Los Cabos — everything to do nearby 🌮\n\n🍽️ DINING\n• Edith\'s, Flora Farms, Manta, Nick-San\n• Mercado del Mar for fresh seafood\n\n🌊 OCEAN & ADVENTURE\n• Tour to the Arch (15 min by boat)\n• Snorkeling at El Arco — sea lions\n• Sport fishing — marlin, dorado, tuna\n• Whale watching (January–March)\n\n🏌️ GOLF & LUXURY\n• Quivira, Diamante, Cabo del Sol\n• Spa at Esperanza or One&Only Palmilla\n\n🎉 NIGHTLIFE\n• Cabo Wabo, Squid Roe, Médano Beach',
      chef: 'Dining at Villa Sera 🍳\n\nThe private chef is an optional add-on:\n\n• Custom menus with local ingredients\n• Gourmet breakfasts, lunches and dinners\n• Gala dinners on the terrace with Sea of Cortez & Arch views\n• Wine pairings and craft cocktails\n• Any dietary restriction accommodated\n\nAlso available: 24/7 butler.\nGet a quote via WhatsApp.',
      yacht: 'Ocean experiences ⛵\n\n• Private yacht to the Arch of Cabo San Lucas\n• Snorkeling at El Arco — sea lions, tropical fish\n• Sport fishing (marlin, dorado, wahoo)\n• Sunset cruise with champagne\n• Whale watching (January–March)\n• Paddleboard & kayak from the private beach\n\nAll à la carte. We coordinate via WhatsApp.',
      massage: 'In-villa wellness 💆\n\nCertified therapists come directly to Villa Sera:\n\n• Swedish, deep tissue & relaxation massages\n• Facial treatments and aromatherapy\n• Sunrise meditation by the sea\n• Private yoga on the terrace\n\nAdvance booking required. Coordinated via WhatsApp.',
    } as Record<string, string>,
    book: {
      prompt: 'Choose how you\'d like to book:',
      whatsappMsg: 'Hello, I\'d like information or a booking at Villa Sera (4 bed / 4 bath, private beach, Los Cabos). Dates: [your dates]. Guests: [number].',
      emailSubject: 'Villa Sera inquiry / booking — Los Cabos',
      emailBody: 'Hello,\n\nI\'m interested in Villa Sera (4 bedrooms, 4 bathrooms, private swimmable beach, Arch view).\n\nDesired dates:\nNumber of guests:\n\nThank you.',
    },
    back: 'Back to questions',
    bookBtn: 'Book now',
  },
};

type View = 'home' | 'topic';

export default function ChatWidget() {
  const locale = useLocale() as 'es' | 'en';
  const lang = kb[locale] ?? kb.es;

  const [open, setOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [view, setView] = useState<View>('home');
  const [currentTopic, setCurrentTopic] = useState('');
  const [bookingOpen, setBookingOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setFaqOpen(false);
    setView('home');
    setCurrentTopic('');
    setBookingOpen(false);
  };

  const openTopic = (value: string) => {
    if (value === 'airbnb') {
      window.open(AIRBNB_URL, '_blank', 'noopener,noreferrer');
      return;
    }
    setCurrentTopic(value);
    setView('topic');
    setFaqOpen(false);
  };

  const goHome = () => {
    setView('home');
    setCurrentTopic('');
    setFaqOpen(true);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => (open ? handleClose() : setOpen(true))}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 shadow-2xl"
        style={{
          borderRadius: '50px',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0D0D0D 100%)',
          border: '1px solid rgba(201,168,76,0.4)',
        }}
        aria-label="Concierge"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={18} className="text-[#C9A84C]" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <span className="text-[#C9A84C] text-base" style={{ fontFamily: 'var(--font-cormorant)' }}>✦</span>
            </motion.span>
          )}
        </AnimatePresence>
        <span className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase font-sans font-medium hidden sm:inline">
          Concierge
        </span>
        {!open && (
          <span className="absolute inset-0 animate-ping opacity-10 pointer-events-none" style={{ borderRadius: '50px', background: '#C9A84C' }} />
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] flex flex-col shadow-2xl overflow-hidden"
            style={{ borderRadius: '20px', border: '1px solid rgba(201,168,76,0.15)', background: '#0f0f0f' }}
          >
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #111 0%, #1a1408 100%)' }} className="px-5 py-4 flex items-center gap-3 border-b border-[#C9A84C]/10 shrink-0">
              <div className="w-9 h-9 shrink-0 flex items-center justify-center" style={{ borderRadius: '50%', background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>
                <span className="text-[#0D0D0D] text-sm font-medium" style={{ fontFamily: 'var(--font-cormorant)' }}>VS</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-sans font-medium tracking-wide">Villa Sera · Concierge</p>
                <p className="text-[#C9A84C]/70 text-[10px] tracking-[0.2em] uppercase font-sans">
                  {locale === 'es' ? '● Asistente inteligente' : '● Smart assistant'}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: '460px' }}>
              <AnimatePresence mode="wait">

                {/* HOME VIEW */}
                {view === 'home' && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="px-4 pt-5 pb-4 space-y-3"
                  >
                    {/* Greeting bubble */}
                    <div
                      className="px-4 py-3 text-sm font-sans text-white/90 leading-relaxed whitespace-pre-line"
                      style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '4px 16px 16px 16px' }}
                    >
                      {lang.greeting}
                    </div>

                    {/* FAQ toggle */}
                    <button
                      onClick={() => setFaqOpen((v) => !v)}
                      className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left transition-all duration-200"
                      style={{
                        background: faqOpen ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${faqOpen ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '12px',
                      }}
                    >
                      <span className="text-[#C9A84C] text-xs font-sans tracking-[0.12em] uppercase font-medium">
                        {lang.faqLabel}
                      </span>
                      <motion.span animate={{ rotate: faqOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={14} className="text-[#C9A84C]/70" />
                      </motion.span>
                    </button>

                    {/* FAQ list */}
                    <AnimatePresence>
                      {faqOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-1.5 pt-1">
                            {lang.menu.map((item) => (
                              <button
                                key={item.value}
                                onClick={() => openTopic(item.value)}
                                className="flex items-center justify-between gap-2 text-white/80 hover:text-[#C9A84C] text-[11px] font-sans px-3 py-2.5 text-left transition-all duration-150 w-full group"
                                style={{
                                  background: 'rgba(255,255,255,0.03)',
                                  border: '1px solid rgba(255,255,255,0.07)',
                                  borderRadius: '9px',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)';
                                  e.currentTarget.style.background = 'rgba(201,168,76,0.06)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                }}
                              >
                                <span className="leading-snug">{item.label}</span>
                                {'external' in item && item.external ? (
                                  <ExternalLink size={11} className="shrink-0 opacity-40" />
                                ) : (
                                  <ChevronRight size={11} className="shrink-0 opacity-40" />
                                )}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* TOPIC VIEW */}
                {view === 'topic' && currentTopic && (
                  <motion.div
                    key="topic"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 pt-4 pb-4 space-y-3"
                  >
                    <button
                      onClick={goHome}
                      className="flex items-center gap-1.5 text-[#C9A84C]/70 hover:text-[#C9A84C] text-[10px] font-sans tracking-[0.15em] uppercase transition-colors"
                    >
                      <ArrowLeft size={11} />
                      {lang.back}
                    </button>
                    <div
                      className="px-4 py-3.5 text-sm font-sans text-white/90 leading-relaxed whitespace-pre-line"
                      style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '4px 16px 16px 16px' }}
                    >
                      {lang.answers[currentTopic]}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Bottom — Book button */}
            <div style={{ background: '#111', borderTop: '1px solid rgba(201,168,76,0.12)' }} className="px-4 py-3 shrink-0">
              <AnimatePresence mode="wait">
                {bookingOpen ? (
                  <motion.div
                    key="booking"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="flex flex-col gap-2"
                  >
                    <p className="text-white/40 text-[10px] tracking-[0.15em] uppercase font-sans mb-0.5">{lang.book.prompt}</p>
                    <a
                      href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lang.book.whatsappMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 text-[#0D0D0D] text-xs font-sans font-semibold tracking-wide transition-opacity hover:opacity-90"
                      style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #C9A84C, #DFC07A)' }}
                    >
                      <Phone size={13} />
                      WhatsApp
                    </a>
                    <a
                      href={`mailto:${EMAIL}?subject=${encodeURIComponent(lang.book.emailSubject)}&body=${encodeURIComponent(lang.book.emailBody)}`}
                      className="flex items-center justify-center gap-2 py-2.5 text-white text-xs font-sans tracking-wide transition-opacity hover:opacity-90"
                      style={{ borderRadius: '10px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                    >
                      <Send size={12} />
                      Email
                    </a>
                    <a
                      href={AIRBNB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 text-white/40 hover:text-white/70 text-[10px] font-sans tracking-wide transition-colors"
                    >
                      <ExternalLink size={11} />
                      Airbnb
                    </a>
                    <button
                      onClick={() => setBookingOpen(false)}
                      className="text-white/30 hover:text-white/60 text-[10px] font-sans tracking-wide transition-colors py-1"
                    >
                      ← {locale === 'es' ? 'Cancelar' : 'Cancel'}
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="bookbtn"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    onClick={() => setBookingOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 text-[#0D0D0D] text-xs font-sans font-semibold tracking-[0.1em] uppercase transition-opacity hover:opacity-90"
                    style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #C9A84C, #DFC07A)' }}
                  >
                    <Calendar size={13} />
                    {lang.bookBtn}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
