import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

const BASE_URL = 'https://www.villa-sera.com';
const AIRBNB_URL = 'https://www.airbnb.mx/rooms/1583142544563137626';

const META = {
  es: {
    title: 'Villa Sera — Villa Privada con Playa en Los Cabos | Renta de Lujo Cabo San Lucas',
    description:
      'Villa privada de ultra-lujo en Los Cabos: 4 recámaras, playa privada nadable, vista al Arco de Cabo San Lucas y Mar de Cortés. Chef privado, mayordomo y yate. Reserva directa — mejor precio garantizado.',
    keywords:
      'villa privada Los Cabos, renta villa lujo Cabo San Lucas, villa con playa privada Los Cabos, villa vacacional Los Cabos, villa 4 recamaras Cabo San Lucas, villa frente al mar Los Cabos, renta villa exclusiva Baja California Sur, villa lujo playa privada México, villa Arco Cabo San Lucas, alquiler villa Los Cabos, villa Mar de Cortés, villa con chef privado Los Cabos, villas en Cabo, villa Cabo, villa Los Cabos precio, villa privada nadable Cabo',
  },
  en: {
    title: 'Villa Sera — Private Beach Villa in Los Cabos | Luxury Rental Cabo San Lucas',
    description:
      'Ultra-luxury private villa in Los Cabos: 4 bedrooms, private swimmable beach, views of the Arch of Cabo San Lucas & Sea of Cortez. Private chef, butler & yacht. Book direct — best price guaranteed.',
    keywords:
      'luxury villa Los Cabos, private villa rental Cabo San Lucas, villa with private beach Los Cabos, villas in Cabo, 4 bedroom villa Cabo San Lucas, beachfront villa Los Cabos, exclusive villa rental Baja California Sur, private beach villa Mexico, villa Arch Cabo San Lucas, villa rental Los Cabos, Sea of Cortez villa, villa with private chef Los Cabos, cabo villas, villa Cabo rental, Los Cabos villa price, swimmable beach villa Cabo',
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = locale === 'en' ? 'en' : 'es';
  const meta = META[lang];
  const canonical = `${BASE_URL}/${lang}`;

  return {
    metadataBase: new URL(BASE_URL),
    title: { default: meta.title, template: '%s | Villa Sera Los Cabos' },
    description: meta.description,
    keywords: meta.keywords,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
    icons: {
      icon: '/favicon.png',
      apple: '/favicon.png',
    },
    alternates: {
      canonical,
      languages: {
        'es-MX': `${BASE_URL}/es`,
        'en-US': `${BASE_URL}/en`,
        'x-default': `${BASE_URL}/es`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      siteName: 'Villa Sera Los Cabos',
      images: [
        { url: `${BASE_URL}/images/CasaSergio233.jpg`, width: 1200, height: 800, alt: 'Villa Sera — Playa privada y vista al Arco, Los Cabos' },
        { url: `${BASE_URL}/images/CasaSergio126.jpg`, width: 1200, height: 800, alt: 'Villa Sera — Vista al Mar de Cortés, Los Cabos' },
      ],
      locale: lang === 'es' ? 'es_MX' : 'en_US',
      alternateLocale: lang === 'es' ? 'en_US' : 'es_MX',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [`${BASE_URL}/images/CasaSergio233.jpg`],
    },
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LodgingBusiness', 'VacationRental'],
      '@id': `${BASE_URL}/#villa`,
      name: 'Villa Sera',
      alternateName: ['Villa Sera Los Cabos', 'Villa Sera Cabo San Lucas', 'Villa Sera Baja California'],
      description:
        'Villa privada de ultra-lujo en Los Cabos con 4 recámaras, 4 baños completos, playa privada nadable exclusiva y vistas directas al Mar de Cortés y al Arco de Cabo San Lucas. Servicios opcionales: chef privado, mayordomo 24/7, yate, spa y concierge.',
      url: BASE_URL,
      telephone: '+526242175935',
      email: 'villasera@seraholding.com',
      priceRange: '$$$$$',
      currenciesAccepted: 'USD, MXN',
      paymentAccepted: 'Cash, Credit Card, Bank Transfer',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Cabo San Lucas',
        addressRegion: 'Baja California Sur',
        postalCode: '23450',
        addressCountry: 'MX',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 22.8905, longitude: -109.9167 },
      hasMap: 'https://maps.google.com/?q=22.8905,-109.9167',
      image: [
        `${BASE_URL}/images/CasaSergio233.jpg`,
        `${BASE_URL}/images/CasaSergio126.jpg`,
        `${BASE_URL}/images/CasaSergio180.jpg`,
        `${BASE_URL}/images/livingroom villa serena.jpg`,
        `${BASE_URL}/images/master room 1.jpg`,
        `${BASE_URL}/images/exterior 1.jpg`,
      ],
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Playa privada nadable', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Swimmable private beach', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Vista al Mar de Cortés', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Vista al Arco de Cabo San Lucas', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Chef privado', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Mayordomo 24/7', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Yate privado', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Spa y masajes en villa', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Concierge', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Privacidad total — un grupo a la vez', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'WiFi de alta velocidad', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Kayak y paddleboard', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Terraza con vista al mar', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Piscina', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Yoga privado', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Estacionamiento privado', value: true },
      ],
      numberOfRooms: 4,
      numberOfBathroomsTotal: 4,
      occupancy: { '@type': 'QuantitativeValue', maxValue: 8, minValue: 1 },
      checkinTime: 'T15:00',
      checkoutTime: 'T11:00',
      availableLanguage: [
        { '@type': 'Language', name: 'Spanish' },
        { '@type': 'Language', name: 'English' },
      ],
      sameAs: [
        AIRBNB_URL,
        `https://wa.me/526242175935`,
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${BASE_URL}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Villa Sera in Los Cabos?',
          acceptedAnswer: { '@type': 'Answer', text: 'Villa Sera is an ultra-luxury private villa in Los Cabos, Mexico, with 4 bedrooms, 4 full bathrooms, a private swimmable beach, and direct views of the Arch of Cabo San Lucas and the Sea of Cortez. It is rented exclusively to one group at a time.' },
        },
        {
          '@type': 'Question',
          name: 'Does Villa Sera have a private beach?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. Villa Sera has direct access to a private swimmable beach exclusive to villa guests, not a public beach. The calm Sea of Cortez waters are perfect for swimming, kayaking and paddleboarding.' },
        },
        {
          '@type': 'Question',
          name: 'How many bedrooms does Villa Sera have?',
          acceptedAnswer: { '@type': 'Answer', text: 'Villa Sera has 4 spacious bedrooms and 4 full bathrooms with luxury finishes. It accommodates up to 8 guests and is rented exclusively to one group at a time for complete privacy.' },
        },
        {
          '@type': 'Question',
          name: 'Where is Villa Sera located in Los Cabos?',
          acceptedAnswer: { '@type': 'Answer', text: 'Villa Sera is located in Los Cabos, Baja California Sur, Mexico, approximately 5 minutes from downtown Cabo San Lucas. The villa has direct views of the iconic Arch of Cabo San Lucas (Land\'s End) and the Sea of Cortez.' },
        },
        {
          '@type': 'Question',
          name: 'Can you see the Arch from Villa Sera?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. The iconic Arch of Cabo San Lucas (Land\'s End) is visible from Villa Sera and from the private beach.' },
        },
        {
          '@type': 'Question',
          name: 'What services does Villa Sera include?',
          acceptedAnswer: { '@type': 'Answer', text: 'Villa Sera offers optional add-on services: private chef, 24/7 butler, private yacht rental, in-villa massage and spa, yoga, water activities, and concierge for restaurants and transport.' },
        },
        {
          '@type': 'Question',
          name: 'How do I book Villa Sera?',
          acceptedAnswer: { '@type': 'Answer', text: 'Book Villa Sera directly via WhatsApp at +52 624 217 5935 for the best price with no commission fees. Also available on Airbnb. Direct bookings receive personalized concierge service.' },
        },
        {
          '@type': 'Question',
          name: 'Is Villa Sera available on Airbnb?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes, Villa Sera is listed on Airbnb with photos of every space, availability calendar and verified guest reviews. However, booking directly via WhatsApp guarantees the best price without Airbnb fees.' },
        },
        {
          '@type': 'Question',
          name: '¿Cuánto cuesta rentar Villa Sera en Los Cabos?',
          acceptedAnswer: { '@type': 'Answer', text: 'El precio de Villa Sera varía según temporada y número de noches. Para obtener la mejor tarifa sin comisiones, contáctanos directo por WhatsApp al +52 624 217 5935. La reserva directa siempre garantiza el mejor precio.' },
        },
        {
          '@type': 'Question',
          name: '¿Villa Sera tiene chef privado?',
          acceptedAnswer: { '@type': 'Answer', text: 'Sí. Villa Sera ofrece chef privado como servicio opcional. El chef prepara menús personalizados con ingredientes locales, desayunos gourmet, comidas, cenas de gala y maridajes de vino. Se adapta a cualquier restricción alimentaria.' },
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'Villa Sera Los Cabos',
      description: 'Official website of Villa Sera, private luxury villa in Los Cabos with private beach and Arch views.',
      inLanguage: ['es-MX', 'en-US'],
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/es` },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale} className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
