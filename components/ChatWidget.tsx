'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { X, ChevronRight, ExternalLink, Send, Phone, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WHATSAPP = '526242175935';
const EMAIL = 'villasera@seraholding.com';
const AIRBNB_URL = 'https://www.airbnb.mx/rooms/1583142544563137626';

type Message = { from: 'bot' | 'user'; text: string; options?: Option[] };
type Option = { label: string; value: string };

const kb = {
  es: {
    greeting: '¡Hola! Soy el concierge de Villa Sera. ¿En qué puedo ayudarte?',
    menu: [
      { label: '📋 Resumen de la villa', value: 'overview' },
      { label: '🛏️ Habitaciones y baños', value: 'rooms' },
      { label: '📍 Ubicación y vista al Arco', value: 'location' },
      { label: '🏖️ Playa privada', value: 'beach' },
      { label: '🌮 Los Cabos — qué hacer', value: 'cabos' },
      { label: '🍽️ Chef y servicios extra', value: 'chef' },
      { label: '⛵ Yates y actividades', value: 'yacht' },
      { label: '💆 Masajes y bienestar', value: 'massage' },
      { label: '🔗 Ver en Airbnb', value: 'airbnb' },
      { label: '📅 Reservar', value: 'book' },
    ] as Option[],
    answers: {
      overview: 'Villa Sera en números 🏡\n\n• 4 recámaras · 4 baños completos\n• Playa privada nadable — acceso directo desde la villa\n• Vista directa al Arco de Cabo San Lucas y el Mar de Cortés\n• ~5 min al downtown de Cabo San Lucas\n• Propiedad exclusiva: un solo grupo a la vez\n• Servicios opcionales: chef privado, mayordomo, yate, spa\n\n¿Qué te gustaría saber con más detalle?',
      rooms: 'Distribución de Villa Sera 🛏️\n\n• 4 recámaras — amplias, luminosas, vistas al mar en gran parte de la casa\n• 4 baños completos — acabados de lujo\n• Diseño pensado para grupos o familias que valoran privacidad y comodidad real\n\nPara fotos detalladas habitación por habitación, el listado en Airbnb documenta cada espacio.',
      location: 'Ubicación — uno de los puntos más fuertes 📍\n\n• Vista al Arco de Cabo San Lucas (Land\'s End) desde la villa y la playa\n• ~5 min al centro de Cabo (restaurantes, marina, nightlife)\n• ~5 min a Pedregal y zonas de alta gama\n• Mar de Cortés frente a ti — considerado uno de los mares más biodiversos del mundo\n• Equilibrio perfecto: exclusividad sin aislamiento',
      beach: 'La playa privada es uno de los diferenciales de Villa Sera 🏖️\n\n• Exclusiva para huéspedes — no es playa pública\n• Nadable: aguas del Mar de Cortés tranquilas\n• Acceso directo desde la propiedad — bajas y estás en tu cala\n• Perfecta para nadar, kayak, paddleboard o simplemente descansar con total privacidad',
      cabos: 'Los Cabos — todo lo que puedes hacer cerca 🌮\n\n🍽️ GASTRONOMÍA\n• Edith\'s, Flora Farms, Manta, Nick-San — algunos de los mejores restaurantes de México\n• Mercado del Mar para mariscos frescos\n• Tour gastronómico por San José del Cabo\n\n🌊 MAR Y AVENTURA\n• Tour al Arco de Cabo San Lucas (15 min en lancha)\n• Snorkel en El Arco — leones marinos y vida marina increíble\n• Pesca deportiva — marlin, dorado, atún\n• Avistamiento de ballenas (enero–marzo)\n• Buceo en La Paz (2h)\n\n🏌️ GOLF Y LUJO\n• Quivira, Diamante, Cabo del Sol — campos de talla mundial\n• Spa en Esperanza o One&Only Palmilla\n\n🎉 VIDA NOCTURNA\n• Cabo Wabo, Squid Roe, El Squid Roe — zona de clubs\n• Médano Beach — ambiente de día\n\n¿Quieres que te ayude a organizar alguna actividad?',
      chef: 'Gastronomía en Villa Sera 🍳\n\nEl chef privado es un servicio opcional — no está incluido en la tarifa base, se contrata aparte:\n\n• Menús personalizados con ingredientes locales\n• Desayunos gourmet, comidas y cenas\n• Cenas de gala en la terraza con vista al Mar de Cortés y el Arco\n• Maridajes de vino y cócteles de autor\n• Se adapta a cualquier restricción alimentaria\n\nTambién disponible: mayordomo 24/7 para cualquier solicitud.\n\nCotización por WhatsApp o email.',
      yacht: 'Experiencias en el mar ⛵\n\n• Yate privado al Arco de Cabo San Lucas\n• Snorkel en El Arco — leones marinos, peces tropicales\n• Pesca deportiva (marlin, dorado, wahoo)\n• Crucero al atardecer con champagne\n• Avistamiento de ballenas (temporada enero–marzo)\n• Paddleboard y kayak desde la playa privada\n• ATV en el desierto de Los Cabos\n\nTodo se organiza a la carta — no está incluido en la renta de la villa. Coordinamos por WhatsApp.',
      massage: 'Bienestar en la villa 💆\n\nTerapeutas certificados acuden directamente a Villa Sera:\n\n• Masajes sueco, de tejido profundo y relajación\n• Tratamientos faciales\n• Rituales de aromaterapia\n• Sesiones de meditación al amanecer frente al mar\n• Yoga privado en la terraza\n\nServicio extra — con cita previa. Lo coordinamos por el canal de contacto directo.',
      airbnb: 'El listado oficial en Airbnb tiene fotos de cada espacio, calendario de disponibilidad, tarifas y reseñas verificadas.\n\nAbriendo en nueva pestaña…',
    } as Record<string, string>,
    book: {
      prompt: 'Elige cómo quieres reservar:',
      whatsappMsg: 'Hola, quiero información o reserva en Villa Sera (4 hab / 4 baños, playa privada, Los Cabos). Fechas: [indicar]. Huéspedes: [número].',
      emailSubject: 'Reserva / consulta Villa Sera — Los Cabos',
      emailBody: 'Hola,\n\nMe interesa Villa Sera (4 habitaciones, 4 baños, playa privada nadable, vista al Arco).\n\nFechas deseadas:\nNúmero de huéspedes:\n\nGracias.',
      openingWA: 'Abriendo WhatsApp con mensaje preparado 👋',
      openingEmail: 'Abriendo tu cliente de correo ✉️',
    },
    back: '← Volver',
    bookBtn: '📅 Reservar',
  },
  en: {
    greeting: 'Hi! I\'m Villa Sera\'s concierge. How can I help you?',
    menu: [
      { label: '📋 Villa overview', value: 'overview' },
      { label: '🛏️ Bedrooms & bathrooms', value: 'rooms' },
      { label: '📍 Location & Arch view', value: 'location' },
      { label: '🏖️ Private beach', value: 'beach' },
      { label: '🌮 Los Cabos — what to do', value: 'cabos' },
      { label: '🍽️ Chef & add-on services', value: 'chef' },
      { label: '⛵ Yachts & activities', value: 'yacht' },
      { label: '💆 Massage & wellness', value: 'massage' },
      { label: '🔗 View on Airbnb', value: 'airbnb' },
      { label: '📅 Book now', value: 'book' },
    ] as Option[],
    answers: {
      overview: 'Villa Sera at a glance 🏡\n\n• 4 bedrooms · 4 full bathrooms\n• Private swimmable beach — direct access from the villa\n• Direct view of the Arch of Cabo San Lucas & Sea of Cortez\n• ~5 min to downtown Cabo San Lucas\n• Exclusive property: one group at a time\n• Optional services: private chef, butler, yacht, spa\n\nWhat would you like to know more about?',
      rooms: 'Villa Sera layout 🛏️\n\n• 4 bedrooms — spacious, bright, Sea of Cortez views throughout\n• 4 full bathrooms — luxury finishes\n• Designed for groups or families who value real privacy and comfort\n\nFor room-by-room photos, the Airbnb listing documents every space in detail.',
      location: 'Location — one of Villa Sera\'s biggest strengths 📍\n\n• View of the Arch of Cabo San Lucas (Land\'s End) from the villa and the beach\n• ~5 min to downtown Cabo (restaurants, marina, nightlife)\n• ~5 min to Pedregal and upscale areas\n• Sea of Cortez right in front — one of the most biodiverse seas in the world\n• Perfect balance: exclusivity without isolation',
      beach: 'The private beach is one of Villa Sera\'s key differentiators 🏖️\n\n• Exclusive to villa guests — not a public beach\n• Swimmable: calm Sea of Cortez waters\n• Direct access from the property — walk from the villa to your cove\n• Perfect for swimming, kayaking, paddleboarding, or just relaxing in total privacy',
      cabos: 'Los Cabos — everything to do nearby 🌮\n\n🍽️ DINING\n• Edith\'s, Flora Farms, Manta, Nick-San — some of the best restaurants in Mexico\n• Mercado del Mar for fresh seafood\n• Culinary tour through San José del Cabo\n\n🌊 OCEAN & ADVENTURE\n• Tour to the Arch of Cabo San Lucas (15 min by boat)\n• Snorkeling at El Arco — sea lions and incredible marine life\n• Sport fishing — marlin, dorado, tuna\n• Whale watching (January–March)\n• Scuba diving in La Paz (2h away)\n\n🏌️ GOLF & LUXURY\n• Quivira, Diamante, Cabo del Sol — world-class courses\n• Spa at Esperanza or One&Only Palmilla\n\n🎉 NIGHTLIFE\n• Cabo Wabo, Squid Roe — party zone\n• Médano Beach — daytime scene\n\nWant help organizing any activity?',
      chef: 'Dining at Villa Sera 🍳\n\nThe private chef is an optional add-on — not included in the base rate:\n\n• Custom menus with local ingredients\n• Gourmet breakfasts, lunches and dinners\n• Gala dinners on the terrace with Sea of Cortez & Arch views\n• Wine pairings and craft cocktails\n• Any dietary restriction accommodated\n\nAlso available: 24/7 butler for any request.\n\nGet a quote via WhatsApp or email.',
      yacht: 'Ocean experiences ⛵\n\n• Private yacht to the Arch of Cabo San Lucas\n• Snorkeling at El Arco — sea lions, tropical fish\n• Sport fishing (marlin, dorado, wahoo)\n• Sunset cruise with champagne\n• Whale watching (January–March season)\n• Paddleboard & kayak from the private beach\n• ATV in the Los Cabos desert\n\nAll organized à la carte — not included in the villa rental. We coordinate via WhatsApp.',
      massage: 'In-villa wellness 💆\n\nCertified therapists come directly to Villa Sera:\n\n• Swedish, deep tissue & relaxation massages\n• Facial treatments\n• Aromatherapy rituals\n• Sunrise meditation by the sea\n• Private yoga on the terrace\n\nAdd-on service — advance booking required. Coordinated through direct contact.',
      airbnb: 'The official Airbnb listing has photos of every space, availability calendar, rates and verified guest reviews.\n\nOpening in a new tab…',
    } as Record<string, string>,
    book: {
      prompt: 'Choose how you\'d like to book:',
      whatsappMsg: 'Hello, I\'d like information or a booking at Villa Sera (4 bed / 4 bath, private beach, Los Cabos). Dates: [your dates]. Guests: [number].',
      emailSubject: 'Villa Sera inquiry / booking — Los Cabos',
      emailBody: 'Hello,\n\nI\'m interested in Villa Sera (4 bedrooms, 4 bathrooms, private swimmable beach, Arch view).\n\nDesired dates:\nNumber of guests:\n\nThank you.',
      openingWA: 'Opening WhatsApp with a pre-filled message 👋',
      openingEmail: 'Opening your email client ✉️',
    },
    back: '← Back',
    bookBtn: '📅 Book now',
  },
};

export default function ChatWidget() {
  const locale = useLocale() as 'es' | 'en';
  const lang = kb[locale] ?? kb.es;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !initialized) {
      setMessages([{ from: 'bot', text: lang.greeting, options: lang.menu }]);
      setInitialized(true);
    }
  }, [open, initialized, lang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const add = (msg: Message) => setMessages((p) => [...p, msg]);

  const handleOption = (value: string, label: string) => {
    add({ from: 'user', text: label });
    setTimeout(() => {
      if (value === 'menu') {
        add({ from: 'bot', text: lang.greeting, options: lang.menu });
        return;
      }
      if (value === 'book') {
        setBookingOpen(true);
        return;
      }
      if (value === 'book_whatsapp') {
        add({ from: 'bot', text: lang.book.openingWA });
        setTimeout(() => window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lang.book.whatsappMsg)}`, '_blank'), 500);
        return;
      }
      if (value === 'book_email') {
        add({ from: 'bot', text: lang.book.openingEmail });
        setTimeout(() => window.open(`mailto:${EMAIL}?subject=${encodeURIComponent(lang.book.emailSubject)}&body=${encodeURIComponent(lang.book.emailBody)}`, '_blank'), 500);
        return;
      }
      if (value === 'airbnb') {
        add({ from: 'bot', text: lang.answers.airbnb, options: [{ label: lang.back, value: 'menu' }] });
        setTimeout(() => window.open(AIRBNB_URL, '_blank', 'noopener,noreferrer'), 400);
        return;
      }
      if (lang.answers[value]) {
        add({
          from: 'bot',
          text: lang.answers[value],
          options: [
            { label: lang.back, value: 'menu' },
            { label: lang.bookBtn, value: 'book' },
          ],
        });
      }
    }, 300);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 shadow-2xl transition-all duration-300"
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
            style={{ borderRadius: '20px', maxHeight: '580px', border: '1px solid rgba(201,168,76,0.15)' }}
          >
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #111 0%, #1a1408 100%)' }} className="px-5 py-4 flex items-center gap-3 border-b border-[#C9A84C]/10">
              <div className="w-9 h-9 shrink-0 flex items-center justify-center" style={{ borderRadius: '50%', background: 'linear-gradient(135deg, #C9A84C, #8B6914)' }}>
                <span className="text-[#0D0D0D] text-sm font-medium" style={{ fontFamily: 'var(--font-cormorant)' }}>VS</span>
              </div>
              <div>
                <p className="text-white text-sm font-sans font-medium tracking-wide">Villa Sera · Concierge</p>
                <p className="text-[#C9A84C]/70 text-[10px] tracking-[0.2em] uppercase font-sans">
                  {locale === 'es' ? '● Asistente inteligente' : '● Smart assistant'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="bg-[#0f0f0f] flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ maxHeight: '380px' }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-2.5 text-sm font-sans leading-relaxed whitespace-pre-line max-w-[92%] ${
                      msg.from === 'bot'
                        ? 'text-white/90'
                        : 'text-[#0D0D0D]'
                    }`}
                    style={{
                      background: msg.from === 'bot' ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #C9A84C, #DFC07A)',
                      borderRadius: msg.from === 'bot' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                    }}
                  >
                    {msg.text}
                  </div>
                  {msg.options && msg.from === 'bot' && (
                    <div className="mt-2 flex flex-col gap-1.5 w-full max-w-[92%]">
                      {msg.options.map((opt) => (
                        <button
                          key={opt.value + opt.label}
                          onClick={() => handleOption(opt.value, opt.label)}
                          className="flex items-center justify-between gap-2 text-white/80 hover:text-[#C9A84C] text-[11px] font-sans px-3 py-2 text-left transition-all duration-200 w-full"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '8px',
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.4)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.06)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
                        >
                          <span className="leading-snug">{opt.label}</span>
                          {opt.value === 'airbnb' ? (
                            <ExternalLink size={11} className="shrink-0 opacity-40" />
                          ) : (
                            <ChevronRight size={11} className="shrink-0 opacity-40" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Bottom bar — Book now only */}
            <div style={{ background: '#111', borderTop: '1px solid rgba(201,168,76,0.12)' }} className="px-4 py-3">
              <AnimatePresence mode="wait">
                {bookingOpen ? (
                  <motion.div
                    key="booking"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="flex flex-col gap-2"
                  >
                    <p className="text-white/50 text-[10px] tracking-[0.15em] uppercase font-sans mb-1">{lang.book.prompt}</p>
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
                      className="flex items-center justify-center gap-2 py-3 text-white text-xs font-sans tracking-wide transition-opacity hover:opacity-90"
                      style={{ borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
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
                      {lang.back}
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
                    {locale === 'es' ? 'Reservar' : 'Book now'}
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
