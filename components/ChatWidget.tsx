'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { X, ChevronRight, ChevronDown, ExternalLink, Send, Phone, Calendar, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WHATSAPP = '526242175935';
const EMAIL = 'villasera@seraholding.com';
const AIRBNB_URL = 'https://www.airbnb.mx/rooms/1583142544563137626';

const kb = {
  es: {
    greeting: '¡Hola! Soy el concierge de Villa Sera.\nEstoy aquí para responder cualquier duda sobre la villa, los servicios y Los Cabos.',
    placeholder: 'Escribe tu pregunta...',
    faqLabel: 'Preguntas frecuentes',
    fallback: 'Para información personalizada, escríbenos directo por WhatsApp y te respondemos al momento. 👋',
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
    keywords: {
      overview: ['villa', 'resumen', 'cuántas', 'cuantas', 'recámara', 'recamara', 'habitacion', 'habitación', 'baño', 'bano', 'completo', 'grupo', 'exclusiv', 'privad'],
      rooms: ['cuarto', 'habitacion', 'habitación', 'recámara', 'recamara', 'baño', 'bano', 'cama', 'dormitori', 'bedroom'],
      location: ['ubicacion', 'ubicación', 'donde', 'dónde', 'arco', 'arch', 'cabo san lucas', 'distancia', 'lejos', 'centro', 'mar', 'cortés', 'cortes'],
      beach: ['playa', 'beach', 'nadar', 'nadable', 'mar', 'agua', 'kayak', 'paddleboard', 'privada'],
      cabos: ['cabos', 'restaurante', 'comer', 'hacer', 'actividad', 'tour', 'golf', 'nightlife', 'noche', 'ballena', 'pesca', 'snorkel', 'buceo'],
      chef: ['chef', 'cocina', 'comida', 'desayuno', 'cena', 'almuerzo', 'mayordomo', 'butler', 'gastronomia', 'gastronomía', 'menu', 'menú'],
      yacht: ['yate', 'yacht', 'barco', 'lancha', 'pesca', 'snorkel', 'atardecer', 'mar', 'actividad', 'atv', 'excursion'],
      massage: ['masaje', 'massage', 'spa', 'bienestar', 'relajacion', 'relajación', 'yoga', 'meditacion', 'facial'],
    } as Record<string, string[]>,
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
    placeholder: 'Type your question...',
    faqLabel: 'Frequently asked questions',
    fallback: 'For personalized information, message us on WhatsApp and we\'ll reply right away. 👋',
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
    keywords: {
      overview: ['villa', 'overview', 'bedroom', 'bathroom', 'rooms', 'how many', 'exclusive', 'private', 'group'],
      rooms: ['bedroom', 'bathroom', 'room', 'bed', 'suite', 'layout'],
      location: ['location', 'where', 'arch', 'cabo san lucas', 'distance', 'far', 'downtown', 'sea', 'cortez'],
      beach: ['beach', 'swim', 'swimmable', 'sea', 'water', 'kayak', 'paddleboard', 'private'],
      cabos: ['cabos', 'restaurant', 'eat', 'do', 'activity', 'tour', 'golf', 'nightlife', 'whale', 'fishing', 'snorkel', 'dive'],
      chef: ['chef', 'cook', 'food', 'breakfast', 'dinner', 'lunch', 'butler', 'gastronomy', 'menu', 'meal'],
      yacht: ['yacht', 'boat', 'fishing', 'snorkel', 'sunset', 'sea', 'activity', 'atv', 'excursion'],
      massage: ['massage', 'spa', 'wellness', 'relax', 'yoga', 'meditation', 'facial'],
    } as Record<string, string[]>,
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

type Message = { from: 'bot' | 'user'; text: string };

function findAnswer(input: string, keywords: Record<string, string[]>, answers: Record<string, string>): string | null {
  const lower = input.toLowerCase();
  for (const [topic, words] of Object.entries(keywords)) {
    if (words.some((w) => lower.includes(w))) {
      return answers[topic] ?? null;
    }
  }
  return null;
}

export default function ChatWidget() {
  const locale = useLocale() as 'es' | 'en';
  const lang = kb[locale] ?? kb.es;

  const [open, setOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [bookingOpen, setBookingOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ from: 'bot', text: lang.greeting }]);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleClose = () => {
    setOpen(false);
    setFaqOpen(false);
    setBookingOpen(false);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { from: 'user', text: text.trim() };
    setMessages((p) => [...p, userMsg]);
    setInput('');
    setFaqOpen(false);

    setTimeout(() => {
      const answer = findAnswer(text, lang.keywords, lang.answers);
      setMessages((p) => [...p, { from: 'bot', text: answer ?? lang.fallback }]);
    }, 400);
  };

  const openTopic = (value: string) => {
    if (value === 'airbnb') {
      window.open(AIRBNB_URL, '_blank', 'noopener,noreferrer');
      return;
    }
    const item = lang.menu.find((m) => m.value === value);
    const label = item?.label ?? value;
    const userMsg: Message = { from: 'user', text: label };
    const botMsg: Message = { from: 'bot', text: lang.answers[value] ?? lang.fallback };
    setMessages((p) => [...p, userMsg, botMsg]);
    setFaqOpen(false);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage(input);
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
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] flex flex-col shadow-2xl"
            style={{ borderRadius: '20px', border: '1px solid rgba(201,168,76,0.15)', background: '#0f0f0f', maxHeight: '600px' }}
          >
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #111 0%, #1a1408 100%)', borderRadius: '20px 20px 0 0' }} className="px-5 py-4 flex items-center gap-3 border-b border-[#C9A84C]/10 shrink-0">
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

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="px-4 py-2.5 text-sm font-sans leading-relaxed whitespace-pre-line max-w-[88%]"
                    style={{
                      background: msg.from === 'bot' ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #C9A84C, #DFC07A)',
                      color: msg.from === 'bot' ? 'rgba(255,255,255,0.9)' : '#0D0D0D',
                      borderRadius: msg.from === 'bot' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* FAQ toggle */}
            <div className="px-4 pb-2 shrink-0">
              <button
                onClick={() => setFaqOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left transition-all duration-200"
                style={{
                  background: faqOpen ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${faqOpen ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '10px',
                }}
              >
                <span className="text-[#C9A84C]/80 text-[10px] font-sans tracking-[0.15em] uppercase">
                  {lang.faqLabel}
                </span>
                <motion.span animate={{ rotate: faqOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={13} className="text-[#C9A84C]/60" />
                </motion.span>
              </button>

              <AnimatePresence>
                {faqOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-1 pt-1.5">
                      {lang.menu.map((item) => (
                        <button
                          key={item.value}
                          onClick={() => openTopic(item.value)}
                          className="flex items-center justify-between gap-2 text-white/75 hover:text-[#C9A84C] text-[11px] font-sans px-3 py-2 text-left transition-all duration-150 w-full"
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '8px',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
                            e.currentTarget.style.background = 'rgba(201,168,76,0.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                          }}
                        >
                          <span>{item.label}</span>
                          {'external' in item && item.external
                            ? <ExternalLink size={10} className="shrink-0 opacity-40" />
                            : <ChevronRight size={10} className="shrink-0 opacity-40" />
                          }
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Text input */}
            <div className="px-4 pb-3 shrink-0">
              <div
                className="flex items-center gap-2"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={lang.placeholder}
                  className="flex-1 bg-transparent text-white/90 text-sm font-sans px-4 py-3 outline-none placeholder:text-white/25"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  className="mr-2 p-1.5 transition-all duration-150 disabled:opacity-20"
                  style={{ color: '#C9A84C' }}
                >
                  <Send size={15} />
                </button>
              </div>
            </div>

            {/* Bottom — Book button */}
            <div style={{ background: '#111', borderTop: '1px solid rgba(201,168,76,0.12)', borderRadius: '0 0 20px 20px' }} className="px-4 py-3 shrink-0">
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
