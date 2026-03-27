'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { MessageCircle, X, Send, ChevronRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WHATSAPP = '526242175935';
const EMAIL = 'villasera@seraholding.com';
const AIRBNB_URL =
  'https://www.airbnb.mx/rooms/1583142544563137626';

type Message = {
  from: 'bot' | 'user';
  text: string;
  options?: Option[];
};

type Option = {
  label: string;
  value: string;
};

// ─── Knowledge base (concierge-style, property-accurate) ─────────────────────
const faqs = {
  es: {
    greeting:
      'Hola — soy el asistente de Villa Sera.\n\nActúo como un concierge digital: conozco la propiedad, la zona y cómo organizar tu estadía. Puedo contarte sobre las 4 habitaciones y 4 baños, la playa privada nadable con acceso desde la casa, la vista al Arco de Cabo San Lucas, y por qué la ubicación es de las mejores de Los Cabos.\n\nPara fotos actualizadas, calendario, tarifas y reseñas, el listado completo está en Airbnb.\n\n¿Qué te gustaría explorar?',
    menu: [
      { label: '📋 Resumen de la villa', value: 'overview' },
      { label: '🛏️ 4 habitaciones · 4 baños', value: 'rooms' },
      { label: '📍 Ubicación y vista al Arco', value: 'location' },
      { label: '🏖️ Playa privada nadable', value: 'beach' },
      { label: '🍽️ Chef y servicios extra', value: 'chef' },
      { label: '⛵ Yates y actividades', value: 'yacht' },
      { label: '💆 Masajes y bienestar', value: 'massage' },
      { label: '🔗 Listado completo (Airbnb)', value: 'airbnb' },
      { label: '📅 Reservar ahora', value: 'book' },
    ] as Option[],
    answers: {
      overview:
        'Aquí tienes el panorama de Villa Sera 🏡\n\n• Habitaciones: 4 recámaras.\n• Baños: 4 baños completos.\n• Playa: privada, nadable y exclusiva para huéspedes, con acceso directo desde la propiedad.\n• Vista: el icónico Arco de Cabo San Lucas (Land\'s End) forma parte del paisaje.\n• Ubicación: entre las mejores de Los Cabos — aprox. 5 minutos al centro (downtown) de Cabo San Lucas y ~5 minutos a zonas con excelentes restaurantes; cerca de lo esencial sin renunciar a la privacidad.\n\nSi quieres profundizar en distribución, fotos o amenidades, el listado en Airbnb tiene todo el detalle.',
      rooms:
        'Distribución confirmada de la villa:\n\n• 4 habitaciones — espacios amplios, luminosidad y vistas al Mar de Cortés en buena parte de la casa.\n• 4 baños — acabados de lujo; pensados para grupos o familias que buscan comodidad real.\n\nPara ver cada recámara con fotos, medidas y distribución exacta, el listado oficial en Airbnb documenta habitación por habitación.',
      location:
        'Ubicación: uno de los puntos fuertes de Villa Sera 📍\n\n• Vista al Arco de Cabo San Lucas — ese monumento natural que define el destino; lo tienes como parte del horizonte desde la villa.\n• Proximidad práctica: alrededor de 5 minutos al downtown de Cabo San Lucas y ~5 minutos a áreas con muy buenos restaurantes y servicios. Es decir: cerca de todo lo que necesitas para salir a cenar, comprar o explorar, sin estar en medio del bullicio 24/7.\n• En términos de Los Cabos, es considerada una de las mejores ubicaciones: equilibrio entre exclusividad y acceso.\n\n¿Te ayudo con la playa privada o con reservar?',
      beach:
        'La playa en Villa Sera es un diferencial importante 🏖️\n\n• Es playa privada, nadable y exclusiva para quienes se hospedan en la villa — no es una playa pública compartida con masas de turistas.\n• Acceso directo desde la casa hasta la zona de playa privada: bajas desde la propiedad a tu cala.\n• Aguas del Mar de Cortés en un entorno controlado y privado — ideal para nadar y relajarte con discreción.\n\nSi quieres ver fotos aéreas de la cala y el acceso, están en el listado de Airbnb.',
      chef:
        'Servicios de gastronomía y staff son extras opcionales — no van incluidos en la tarifa base de la villa, pero sí pueden coordinarse para elevar la estadía 🍳\n\nChef privado con menús personalizados, cenas en la terraza con vista al mar, desayunos gourmet, etc. Todo se cotiza y agenda según fechas y preferencias.\n\nPara combinar con reserva o pedir una propuesta, WhatsApp o email conectan directo con el equipo.',
      yacht:
        'Actividades marítimas y en tierra se organizan como experiencias a la carta ⛵\n\nYates privados hacia el Arco, snorkel, pesca deportiva, cruceros al atardecer; también paddleboard, kayak, ATV o avistamiento de ballenas según temporada.\n\nNada de esto está incluido automáticamente en la renta de la villa — se coordinan aparte. Te puedo derivar por WhatsApp para itinerarios y disponibilidad.',
      massage:
        'Bienestar in-villa: terapeutas certificados que acuden a Villa Sera 💆\n\nMasajes, tratamientos faciales o rituales relajantes en la privacidad de la villa — servicio extra, con cita previa.\n\nSi quieres agregarlo a tu estancia, lo gestionamos por el canal de contacto directo.',
      airbnb:
        'El listado oficial en Airbnb reúne toda la información verificada: fotos de cada espacio, amenidades línea por línea, reglas de la casa, calendario de disponibilidad, tarifas y opiniones de huéspedes.\n\nAbro el enlace en una pestaña nueva…',
    } as Record<string, string>,
    bookFlow: {
      start:
        'Para reservar o recibir una cotización personalizada, el equipo atiende por WhatsApp o email. ¿Cuál prefieres?',
      options: [
        { label: '💬 WhatsApp (recomendado)', value: 'book_whatsapp' },
        { label: '✉️ Correo electrónico', value: 'book_email' },
      ] as Option[],
      whatsapp:
        'Perfecto. Abriendo WhatsApp con un mensaje preparado para que solo confirmes fechas y número de huéspedes 👋',
      email:
        'Abro tu cliente de correo con asunto y cuerpo sugeridos para Villa Sera ✉️',
    },
    backMenu: [{ label: '← Volver al menú', value: 'menu' }] as Option[],
    bookButton: '📅 Reservar / cotizar',
    afterDetailOptions: (bookLabel: string) =>
      [
        { label: '← Otra pregunta', value: 'menu' },
        { label: bookLabel, value: 'book' },
        { label: '🔗 Ver Airbnb', value: 'airbnb' },
      ] as Option[],
  },
  en: {
    greeting:
      'Hi — I\'m Villa Sera\'s assistant.\n\nI work like a digital concierge: I know the villa, the neighborhood, and how to plan your stay. I can explain the 4 bedrooms and 4 bathrooms, the private swimmable beach with direct access from the house, the view of the Arch of Cabo San Lucas, and why the location ranks among the best in Los Cabos.\n\nFor live photos, calendar, pricing, and guest reviews, the full listing is on Airbnb.\n\nWhat would you like to explore?',
    menu: [
      { label: '📋 Property overview', value: 'overview' },
      { label: '🛏️ 4 bedrooms · 4 bathrooms', value: 'rooms' },
      { label: '📍 Location & Arch view', value: 'location' },
      { label: '🏖️ Private swimmable beach', value: 'beach' },
      { label: '🍽️ Chef & add-on services', value: 'chef' },
      { label: '⛵ Yachts & activities', value: 'yacht' },
      { label: '💆 Massage & wellness', value: 'massage' },
      { label: '🔗 Full listing (Airbnb)', value: 'airbnb' },
      { label: '📅 Book now', value: 'book' },
    ] as Option[],
    answers: {
      overview:
        'Here\'s the snapshot of Villa Sera 🏡\n\n• Bedrooms: 4.\n• Bathrooms: 4 full bathrooms.\n• Beach: private, swimmable, and exclusive to guests, with direct access from the property.\n• View: the iconic Arch of Cabo San Lucas (Land\'s End) is part of the scenery.\n• Location: among the best in Los Cabos — roughly 5 minutes to downtown Cabo San Lucas and ~5 minutes to areas with excellent restaurants; close to what matters while staying private.\n\nFor layout, photos, and every amenity in writing, the Airbnb listing has the full breakdown.',
      rooms:
        'Confirmed layout:\n\n• 4 bedrooms — spacious rooms with Sea of Cortés views across much of the villa.\n• 4 bathrooms — high-end finishes; ideal for families or groups who want real comfort.\n\nFor room-by-room photos and specs, the official Airbnb listing documents each space.',
      location:
        'Location is a major strength at Villa Sera 📍\n\n• View of the Arch of Cabo San Lucas — that natural landmark that defines the destination; you see it from the villa.\n• Practical proximity: about 5 minutes to downtown Cabo San Lucas and ~5 minutes to great restaurant zones and services. You\'re near everything you need for dining, shopping, or exploring — without being in the middle of the crowd 24/7.\n\nIn Los Cabos terms, it\'s widely considered one of the best locations: privacy plus access.\n\nWant details on the private beach or booking?',
      beach:
        'The beach at Villa Sera is a real differentiator 🏖️\n\n• Private, swimmable, and exclusive to villa guests — not a crowded public beach.\n• Direct access from the house down to your private beach area — you walk from the property to the cove.\n• Sea of Cortés water in a private setting — ideal for swimming and relaxing with discretion.\n\nAerial shots of the cove and access are on the Airbnb listing.',
      chef:
        'Dining and staffing are optional add-ons — not included in the base villa rate, but easy to arrange 🍳\n\nPrivate chef with custom menus, terrace dinners with ocean views, gourmet breakfasts, etc. Everything is quoted and scheduled around your dates.\n\nWhatsApp or email connects you straight with the team for proposals.',
      yacht:
        'On-water and land experiences are arranged à la carte ⛵\n\nPrivate yachts to the Arch, snorkeling, sport fishing, sunset cruises; also paddleboard, kayak, ATV, whale watching (seasonal).\n\nNone of this is bundled into the villa rental by default — coordinated separately. I can point you to WhatsApp for itineraries and availability.',
      massage:
        'In-villa wellness: certified therapists come to Villa Sera 💆\n\nMassages, facials, or relaxation rituals in complete privacy — add-on service, booked in advance.\n\nTo add it to your stay, we handle it through direct contact.',
      airbnb:
        'The official Airbnb listing has verified details: photos of every space, full amenity list, house rules, availability calendar, pricing, and guest reviews.\n\nOpening it in a new tab…',
    } as Record<string, string>,
    bookFlow: {
      start:
        'To book or get a tailored quote, our team replies on WhatsApp or email. Which do you prefer?',
      options: [
        { label: '💬 WhatsApp (recommended)', value: 'book_whatsapp' },
        { label: '✉️ Email', value: 'book_email' },
      ] as Option[],
      whatsapp:
        'Opening WhatsApp with a pre-filled message — just confirm dates and guest count 👋',
      email:
        'Opening your email client with a suggested subject and body for Villa Sera ✉️',
    },
    backMenu: [{ label: '← Back to menu', value: 'menu' }] as Option[],
    bookButton: '📅 Book / get a quote',
    afterDetailOptions: (bookLabel: string) =>
      [
        { label: '← Another question', value: 'menu' },
        { label: bookLabel, value: 'book' },
        { label: '🔗 Open Airbnb', value: 'airbnb' },
      ] as Option[],
  },
};

export default function ChatWidget() {
  const locale = useLocale() as 'es' | 'en';
  const lang = faqs[locale] ?? faqs.es;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [initialized, setInitialized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !initialized) {
      setMessages([
        {
          from: 'bot',
          text: lang.greeting,
          options: lang.menu,
        },
      ]);
      setInitialized(true);
    }
  }, [open, initialized, lang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (msg: Message) => setMessages((prev) => [...prev, msg]);

  const handleOption = (value: string, label: string) => {
    addMessage({ from: 'user', text: label });

    setTimeout(() => {
      if (value === 'menu') {
        addMessage({ from: 'bot', text: lang.greeting, options: lang.menu });
        return;
      }

      if (value === 'book') {
        addMessage({
          from: 'bot',
          text: lang.bookFlow.start,
          options: lang.bookFlow.options,
        });
        return;
      }

      if (value === 'book_whatsapp') {
        addMessage({ from: 'bot', text: lang.bookFlow.whatsapp });
        setTimeout(() => {
          const msg =
            locale === 'es'
              ? 'Hola, quiero información o reserva en Villa Sera (4 hab / 4 baños, Los Cabos). Fechas: [indicar]. Huéspedes: [número].'
              : 'Hello, I\'d like information or a booking at Villa Sera (4 bed / 4 bath, Los Cabos). Dates: [your dates]. Guests: [number].';
          window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
        }, 600);
        return;
      }

      if (value === 'book_email') {
        addMessage({ from: 'bot', text: lang.bookFlow.email });
        setTimeout(() => {
          const subject =
            locale === 'es' ? 'Reserva / consulta Villa Sera — Los Cabos' : 'Villa Sera inquiry / booking — Los Cabos';
          const body =
            locale === 'es'
              ? 'Hola,\n\nMe interesa Villa Sera (4 habitaciones, 4 baños, playa privada nadable, vista al Arco).\n\nFechas deseadas:\nNúmero de huéspedes:\n\nGracias.'
              : 'Hello,\n\nI\'m interested in Villa Sera (4 bedrooms, 4 bathrooms, private swimmable beach, Arch view).\n\nDesired dates:\nNumber of guests:\n\nThank you.';
          window.open(
            `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
            '_blank'
          );
        }, 600);
        return;
      }

      if (value === 'airbnb') {
        addMessage({
          from: 'bot',
          text: lang.answers.airbnb,
          options: [
            ...lang.backMenu,
            { label: lang.bookButton, value: 'book' },
          ],
        });
        setTimeout(() => {
          window.open(AIRBNB_URL, '_blank', 'noopener,noreferrer');
        }, 400);
        return;
      }

      if (lang.answers[value]) {
        addMessage({
          from: 'bot',
          text: lang.answers[value],
          options: lang.afterDetailOptions(lang.bookButton),
        });
      }
    }, 350);
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1DA851] text-white px-4 py-3 shadow-xl transition-colors duration-300"
        style={{ borderRadius: '50px' }}
        aria-label="Chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={20} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle size={20} fill="white" strokeWidth={0} />
            </motion.span>
          )}
        </AnimatePresence>
        <span className="text-sm font-sans font-medium tracking-wide hidden sm:inline">
          {open
            ? locale === 'es'
              ? 'Cerrar'
              : 'Close'
            : locale === 'es'
              ? 'Concierge'
              : 'Concierge'}
        </span>
        {!open && (
          <span
            className="absolute inset-0 animate-ping bg-[#25D366] opacity-20 pointer-events-none"
            style={{ borderRadius: '50px' }}
          />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-24px)] flex flex-col shadow-2xl overflow-hidden"
            style={{ borderRadius: '16px', maxHeight: '560px' }}
          >
            <div className="bg-[#0D0D0D] px-5 py-4 flex items-center gap-3">
              <div
                className="w-9 h-9 bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center shrink-0"
                style={{ borderRadius: '50%' }}
              >
                <span
                  className="text-[#0D0D0D] text-lg font-light"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  VS
                </span>
              </div>
              <div>
                <p className="text-white text-sm font-sans font-medium">
                  Villa Sera · Concierge
                </p>
                <p className="text-[#25D366] text-[10px] tracking-wide font-sans">
                  ● {locale === 'es' ? 'Asistente inteligente' : 'Smart assistant'}
                </p>
              </div>
            </div>

            <div
              className="bg-[#F8F4EF] flex-1 overflow-y-auto px-4 py-4 space-y-3"
              style={{ maxHeight: '380px' }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`px-4 py-2.5 text-sm font-sans leading-relaxed whitespace-pre-line max-w-[90%] ${
                      msg.from === 'bot'
                        ? 'bg-white text-[#0D0D0D] shadow-sm'
                        : 'bg-[#0D0D0D] text-white'
                    }`}
                    style={{
                      borderRadius:
                        msg.from === 'bot' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                    }}
                  >
                    {msg.text}
                  </div>

                  {msg.options && msg.from === 'bot' && (
                    <div className="mt-2 flex flex-col gap-1.5 w-full max-w-[90%]">
                      {msg.options.map((opt) => (
                        <button
                          key={opt.value + opt.label}
                          onClick={() => handleOption(opt.value, opt.label)}
                          className="flex items-center justify-between gap-2 bg-white hover:bg-[#C9A84C] hover:text-[#0D0D0D] border border-[#E5DDD4] hover:border-[#C9A84C] text-[#0D0D0D] text-[11px] font-sans px-3 py-2 text-left transition-all duration-200 w-full shadow-sm"
                          style={{ borderRadius: '8px' }}
                        >
                          <span className="leading-snug">{opt.label}</span>
                          {opt.value === 'airbnb' ? (
                            <ExternalLink size={12} className="shrink-0 opacity-50" />
                          ) : (
                            <ChevronRight size={12} className="shrink-0 opacity-50" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="bg-white border-t border-[#E5DDD4] px-4 py-3 flex gap-2">
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
                  locale === 'es'
                    ? 'Hola, quiero información sobre Villa Sera (4 hab / 4 baños).'
                    : 'Hello, I\'d like information about Villa Sera (4 bed / 4 bath).'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1DA851] text-white text-[11px] tracking-wide font-sans py-2.5 transition-colors"
                style={{ borderRadius: '8px' }}
              >
                <MessageCircle size={13} fill="white" strokeWidth={0} />
                WhatsApp
              </a>
              <a
                href={`mailto:${EMAIL}?subject=${encodeURIComponent(
                  locale === 'es' ? 'Villa Sera — consulta' : 'Villa Sera — inquiry'
                )}`}
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#0D0D0D] hover:bg-[#A0342A] text-white text-[11px] tracking-wide font-sans py-2.5 transition-colors"
                style={{ borderRadius: '8px' }}
              >
                <Send size={12} />
                Email
              </a>
              <a
                href={AIRBNB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-2.5 border border-[#E5DDD4] hover:border-[#C9A84C] text-[#0D0D0D] hover:bg-[#F8F4EF] transition-colors"
                style={{ borderRadius: '8px' }}
                title="Airbnb"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
