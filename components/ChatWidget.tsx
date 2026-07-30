'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { X, ChevronDown, ExternalLink, Send, Phone, Calendar, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WHATSAPP = '526242175935';
const EMAIL = 'villasera@seraholding.com';
const AIRBNB_URL = 'https://www.airbnb.mx/rooms/1583142544563137626';

const kb = {
  es: {
    greeting: 'Hola, soy el concierge de Villa Sera.\nPuedo darte información sobre la villa, los servicios, Los Cabos, y checar disponibilidad de fechas. ¿En qué te ayudo?',
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
    greeting: 'Hi, I\'m Villa Sera\'s concierge.\nI can give you information about the villa, our services, Los Cabos, and check date availability. How can I help?',
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

async function askConcierge(history: Message[], locale: string): Promise<string | null> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locale,
        messages: history.map((m) => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text })),
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.reply === 'string' ? data.reply : null;
  } catch {
    return null;
  }
}

export default function ChatWidget() {
  const locale = useLocale() as 'es' | 'en';
  const lang = kb[locale] ?? kb.es;

  const [open, setOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Seed the greeting on mount so the panel already has content the instant it
  // opens, instead of populating after the open animation.
  useEffect(() => {
    setMessages((prev) => (prev.length === 0 ? [{ from: 'bot', text: lang.greeting }] : prev));
  }, [lang.greeting]);

  const markSeen = () => {
    try {
      sessionStorage.setItem('vs-concierge-seen', '1');
    } catch {
      /* private mode — the greeting simply shows again next load */
    }
  };

  // Show the concierge on its own so visitors can see help is here, once per
  // session. On a phone the panel would cover the whole screen, so there it
  // announces itself with the teaser bubble instead of opening.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('vs-concierge-seen')) return;

    const id = setTimeout(() => {
      const roomForPanel = window.matchMedia('(min-width: 640px)').matches;
      const stillReading = !document.hidden;
      if (!stillReading) return;
      if (roomForPanel) {
        setOpen(true);
      } else {
        setTeaser(true);
      }
      markSeen();
    }, 5000);

    return () => clearTimeout(id);
  }, []);

  const dismissTeaser = () => {
    setTeaser(false);
    markSeen();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleClose = () => {
    setOpen(false);
    setFaqOpen(false);
    setBookingOpen(false);
    markSeen();
  };

  const handleOpen = () => {
    dismissTeaser();
    setOpen(true);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || typing) return;
    const userMsg: Message = { from: 'user', text: text.trim() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setFaqOpen(false);
    setTyping(true);

    const reply = await askConcierge(history, locale);
    setTyping(false);
    setMessages((p) => [...p, { from: 'bot', text: reply ?? lang.fallback }]);
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
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5 sm:flex-row sm:items-center sm:gap-3">
        {/* Teaser: invites the first question, once per session */}
        <AnimatePresence>
          {teaser && !open && (
            <motion.div
              initial={{ opacity: 0, x: 12, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 12, scale: 0.94 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 max-w-[15rem]"
            >
              <button
                onClick={handleOpen}
                className="text-left px-4 py-2.5 text-[13px] font-sans leading-snug text-[#EFE7DA] hover:text-white transition-colors"
                style={{
                  borderRadius: '14px 14px 4px 14px',
                  background: 'linear-gradient(150deg, #12384A 0%, #0A2430 100%)',
                  border: '1px solid rgba(201,168,76,0.35)',
                  boxShadow: '0 12px 30px -10px rgba(0,0,0,0.6)',
                }}
              >
                {locale === 'es'
                  ? '¿Dudas sobre la villa o fechas? Pregúntame aquí.'
                  : 'Questions about the villa or dates? Ask me here.'}
              </button>
              <button
                onClick={dismissTeaser}
                className="text-[#EFE7DA]/40 hover:text-[#EFE7DA]/80 transition-colors p-1"
                aria-label={locale === 'es' ? 'Cerrar aviso' : 'Dismiss'}
              >
                <X size={13} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          {/* Expanding rings — the button is the brightest thing on a dark page,
              and these keep pushing the eye back to it until it is used. */}
          {!open && (
            <>
              {[0, 1].map((i) => (
                <motion.span
                  key={i}
                  className="absolute inset-0 pointer-events-none"
                  style={{ borderRadius: '999px', border: '2px solid rgba(201,168,76,0.7)' }}
                  animate={{ opacity: [0.75, 0], scale: [1, 1.18] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: 'easeOut',
                    delay: i * 1.2,
                  }}
                />
              ))}
              <motion.span
                className="absolute -inset-1 pointer-events-none"
                style={{
                  borderRadius: '999px',
                  background:
                    'radial-gradient(circle, rgba(201,168,76,0.55) 0%, rgba(201,168,76,0) 70%)',
                }}
                animate={{ opacity: [0.45, 0.95, 0.45], scale: [1, 1.06, 1] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </>
          )}
          <motion.button
            onClick={() => (open ? handleClose() : handleOpen())}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="relative flex items-center gap-3 pl-3 pr-6 py-3"
            style={{
              borderRadius: '999px',
              background: open
                ? 'linear-gradient(160deg, #12384A 0%, #04141C 100%)'
                : 'linear-gradient(140deg, #F0D28C 0%, #C9A84C 52%, #B08F3A 100%)',
              border: open ? '1px solid rgba(201,168,76,0.55)' : '1px solid rgba(240,210,140,0.9)',
              boxShadow: open
                ? '0 12px 34px -8px rgba(0,0,0,0.65)'
                : '0 1px 0 rgba(255,255,255,0.45) inset, 0 14px 38px -10px rgba(0,0,0,0.7), 0 0 34px -6px rgba(201,168,76,0.75)',
            }}
            aria-label="Concierge"
          >
          <span
            className="relative flex items-center justify-center shrink-0"
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: open ? 'linear-gradient(150deg, #F0D28C 0%, #C9A84C 55%, #9C7C33 100%)' : '#04141C',
            }}
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="flex">
                  <X size={17} className="text-[#04141C]" strokeWidth={2.4} />
                </motion.span>
              ) : (
                <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} className="flex">
                  <MessageCircle size={17} className="text-[#F0D28C]" strokeWidth={2.4} />
                </motion.span>
              )}
            </AnimatePresence>
            {!open && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#3DDC84] ring-2 ring-[#C9A84C]" />
            )}
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span
              className={`text-[15px] tracking-[0.02em] font-sans font-bold ${
                open ? 'text-[#F5DBA0]' : 'text-[#04141C]'
              }`}
            >
              Concierge
            </span>
            <span
              className={`text-[10.5px] font-sans ${
                open ? 'text-[#C9A84C]/65' : 'text-[#04141C]/70'
              }`}
            >
              {locale === 'es' ? '¿Cómo te ayudo?' : 'How can I help?'}
            </span>
          </span>
          </motion.button>
        </div>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-50 inset-x-3 bottom-24 sm:inset-x-auto sm:right-6 sm:w-[480px] flex flex-col overflow-hidden"
            style={{
              borderRadius: '24px',
              border: '1px solid rgba(201,168,76,0.22)',
              background: '#04141C',
              // A fixed height (not just a max) so the flex-1 messages area
              // actually fills the space left over instead of shrinking to
              // its own content — that was what let the topics grid look
              // like it was taking over the whole panel.
              height: 'min(760px, 84vh)',
              boxShadow: '0 32px 80px -16px rgba(0,0,0,0.75), 0 0 0 1px rgba(201,168,76,0.06)',
            }}
          >
            {/* Thin gold accent line */}
            <div className="h-[3px] shrink-0" style={{ background: 'linear-gradient(90deg, #9C7C33, #F0D28C 50%, #9C7C33)' }} />

            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0A2430 0%, #12384A 100%)' }} className="px-6 py-5 flex items-center gap-4 border-b border-[#C9A84C]/12 shrink-0">
              <div className="relative shrink-0">
                <motion.span
                  className="absolute -inset-1.5 pointer-events-none"
                  style={{
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(201,168,76,0.45) 0%, rgba(201,168,76,0) 72%)',
                  }}
                  animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div
                  className="relative w-12 h-12 flex items-center justify-center"
                  style={{
                    borderRadius: '50%',
                    background: 'linear-gradient(150deg, #F0D28C 0%, #C9A84C 55%, #9C7C33 100%)',
                    boxShadow: '0 1px 0 rgba(255,255,255,0.4) inset, 0 4px 16px -4px rgba(201,168,76,0.55)',
                  }}
                >
                  <span className="text-[#04141C] text-lg font-medium" style={{ fontFamily: 'var(--font-display)' }}>VS</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#EFE7DA] text-[17px] font-sans font-semibold tracking-wide leading-tight">
                  Villa Sera Concierge
                </p>
                <p className="text-[#3DDC84] text-[11px] font-sans flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3DDC84] inline-block" />
                  {locale === 'es' ? 'En línea · responde al momento' : 'Online · replies right away'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-[#EFE7DA]/35 hover:text-[#EFE7DA]/80 transition-colors p-1.5 -mr-1.5"
                aria-label={locale === 'es' ? 'Cerrar' : 'Close'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 min-h-[90px] overflow-y-auto px-5 pt-6 pb-3 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="px-5 py-3.5 text-[15.5px] font-sans leading-[1.6] whitespace-pre-line max-w-[86%]"
                    style={{
                      background: msg.from === 'bot' ? '#0A2430' : 'linear-gradient(135deg, #C9A84C, #DFC07A)',
                      color: msg.from === 'bot' ? 'rgba(239,231,218,0.92)' : '#04141C',
                      borderRadius: msg.from === 'bot' ? '6px 20px 20px 20px' : '20px 6px 20px 20px',
                      border: msg.from === 'bot' ? '1px solid rgba(239,231,218,0.08)' : 'none',
                      boxShadow: msg.from === 'bot' ? '0 2px 8px -2px rgba(0,0,0,0.3)' : '0 2px 12px -3px rgba(201,168,76,0.45)',
                    }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div
                    className="px-5 py-3.5 flex items-center gap-1.5"
                    style={{ background: '#0A2430', borderRadius: '6px 20px 20px 20px' }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{ background: 'rgba(239,231,218,0.55)' }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick topics — collapsed by default so the conversation is
                what the panel shows; tap to reveal all 9 at once in a grid,
                instead of a strip where most are hidden off-screen. */}
            <div className="shrink-0 border-t border-[#EFE7DA]/8">
              <button
                onClick={() => setFaqOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-2 px-5 py-3 text-left"
              >
                <span className="text-[#C9A84C] text-[11px] font-sans tracking-[0.14em] uppercase">
                  {lang.faqLabel}
                </span>
                <motion.span animate={{ rotate: faqOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={15} className="text-[#C9A84C]/70" />
                </motion.span>
              </button>

              <AnimatePresence>
                {faqOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-2 px-5 pb-3.5 max-h-[280px] overflow-y-auto">
                      {lang.menu.map((item) => {
                        const [emoji, ...rest] = item.label.split(' ');
                        const text = rest.join(' ');
                        return (
                          <button
                            key={item.value}
                            onClick={() => openTopic(item.value)}
                            className="group flex items-center gap-2.5 text-left px-3 py-2.5 transition-colors duration-150"
                            style={{
                              borderRadius: '14px',
                              background: 'rgba(239,231,218,0.04)',
                              border: '1px solid rgba(239,231,218,0.1)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(201,168,76,0.12)';
                              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(239,231,218,0.04)';
                              e.currentTarget.style.borderColor = 'rgba(239,231,218,0.1)';
                            }}
                          >
                            <span
                              className="shrink-0 flex items-center justify-center text-[15px]"
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: '50%',
                                background: 'rgba(201,168,76,0.14)',
                              }}
                            >
                              {emoji}
                            </span>
                            <span className="flex-1 min-w-0 text-[#EFE7DA]/85 group-hover:text-[#EFE7DA] text-[12.5px] leading-tight font-sans">
                              {text}
                            </span>
                            {'external' in item && item.external && (
                              <ExternalLink size={11} className="shrink-0 opacity-40" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Text input */}
            <div className="px-5 pb-4 pt-1 shrink-0">
              <div
                className="flex items-center gap-2 pl-5 pr-2 py-1.5"
                style={{
                  background: '#0A2430',
                  border: '1px solid rgba(239,231,218,0.12)',
                  borderRadius: '999px',
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  disabled={typing}
                  placeholder={lang.placeholder}
                  className="flex-1 min-w-0 bg-transparent text-[#EFE7DA] text-[15.5px] font-sans py-2.5 outline-none placeholder:text-[#EFE7DA]/30 disabled:opacity-50"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || typing}
                  className="shrink-0 w-10 h-10 flex items-center justify-center text-[#04141C] transition-opacity duration-150 disabled:opacity-25"
                  style={{
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #C9A84C, #DFC07A)',
                  }}
                  aria-label={locale === 'es' ? 'Enviar' : 'Send'}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>

            {/* Bottom — Book button */}
            <div style={{ background: '#020C12', borderTop: '1px solid rgba(201,168,76,0.12)' }} className="px-5 py-4 shrink-0">
              <AnimatePresence mode="wait">
                {bookingOpen ? (
                  <motion.div
                    key="booking"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="flex flex-col gap-2"
                  >
                    <p className="text-[#EFE7DA]/40 text-[10px] tracking-[0.15em] uppercase font-sans mb-0.5">{lang.book.prompt}</p>
                    <a
                      href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lang.book.whatsappMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 text-[#04141C] text-xs font-sans font-semibold tracking-wide transition-opacity hover:opacity-90"
                      style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #C9A84C, #DFC07A)' }}
                    >
                      <Phone size={13} />
                      WhatsApp
                    </a>
                    <a
                      href={`mailto:${EMAIL}?subject=${encodeURIComponent(lang.book.emailSubject)}&body=${encodeURIComponent(lang.book.emailBody)}`}
                      className="flex items-center justify-center gap-2 py-2.5 text-[#EFE7DA] text-xs font-sans tracking-wide transition-opacity hover:opacity-90"
                      style={{ borderRadius: '10px', background: '#0A2430', border: '1px solid rgba(239,231,218,0.14)' }}
                    >
                      <Send size={12} />
                      Email
                    </a>
                    <a
                      href={AIRBNB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 text-[#EFE7DA]/40 hover:text-[#EFE7DA]/70 text-[10px] font-sans tracking-wide transition-colors"
                    >
                      <ExternalLink size={11} />
                      Airbnb
                    </a>
                    <button
                      onClick={() => setBookingOpen(false)}
                      className="text-[#EFE7DA]/30 hover:text-[#EFE7DA]/60 text-[10px] font-sans tracking-wide transition-colors py-1"
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
                    className="w-full flex items-center justify-center gap-2 py-3 text-[#04141C] text-xs font-sans font-semibold tracking-[0.1em] uppercase transition-opacity hover:opacity-90"
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
