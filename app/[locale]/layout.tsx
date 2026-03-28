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

const BASE_URL = 'https://villa-sera.vercel.app';

const META = {
  es: {
    title: 'Villa Sera — Villa de Lujo Privada en Los Cabos',
    description:
      'Villa privada de ultra-lujo en Los Cabos: 4 recámaras, 4 baños, playa privada nadable, vistas al Mar de Cortés y al Arco de Cabo San Lucas. Chef privado, mayordomo y yates disponibles.',
    keywords:
      'villa lujo Los Cabos, renta villa privada Cabo San Lucas, villa playa privada México, villa vacacional lujo Baja California, alquiler villa exclusiva Los Cabos, villa Mar de Cortés',
  },
  en: {
    title: 'Villa Sera — Private Luxury Villa in Los Cabos',
    description:
      'Ultra-luxury private villa in Los Cabos: 4 bedrooms, 4 bathrooms, private swimmable beach, views of the Sea of Cortez and the Arch of Cabo San Lucas. Private chef, butler and yachts available.',
    keywords:
      'luxury villa Los Cabos, private villa rental Cabo San Lucas, private beach villa Mexico, vacation villa Baja California, exclusive villa rental Los Cabos, Sea of Cortez villa',
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
    title: { default: meta.title, template: '%s | Villa Sera' },
    description: meta.description,
    keywords: meta.keywords,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
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
      images: [{ url: `${BASE_URL}/images/CasaSergio233.jpg`, width: 1200, height: 800, alt: 'Villa Sera — Los Cabos' }],
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
      '@type': 'LodgingBusiness',
      '@id': `${BASE_URL}/#villa`,
      name: 'Villa Sera',
      description:
        'Villa privada de ultra-lujo en Los Cabos con 4 recámaras, 4 baños completos, playa privada nadable y vistas directas al Mar de Cortés y al Arco de Cabo San Lucas.',
      url: BASE_URL,
      telephone: '+526242175935',
      priceRange: '$$$$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Cabo San Lucas',
        addressRegion: 'Baja California Sur',
        addressCountry: 'MX',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 22.8905, longitude: -109.9167 },
      image: [
        `${BASE_URL}/images/CasaSergio233.jpg`,
        `${BASE_URL}/images/CasaSergio126.jpg`,
        `${BASE_URL}/images/CasaSergio180.jpg`,
        `${BASE_URL}/images/livingroom villa serena.jpg`,
        `${BASE_URL}/images/master room 1.jpg`,
      ],
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Playa privada nadable', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Vista al Mar de Cortés', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Vista al Arco de Cabo San Lucas', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Chef privado (opcional)', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Mayordomo 24/7 (opcional)', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Yate (opcional)', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Spa y masajes (opcional)', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Concierge', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Privacidad total', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'WiFi', value: true },
      ],
      numberOfRooms: 4,
      checkinTime: '15:00',
      checkoutTime: '11:00',
      availableLanguage: [
        { '@type': 'Language', name: 'Spanish' },
        { '@type': 'Language', name: 'English' },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${BASE_URL}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cuántas habitaciones y baños tiene Villa Sera?',
          acceptedAnswer: { '@type': 'Answer', text: 'Villa Sera tiene 4 recámaras y 4 baños completos. Es una propiedad privada exclusiva para un solo grupo de huéspedes a la vez.' },
        },
        {
          '@type': 'Question',
          name: '¿Villa Sera tiene playa privada?',
          acceptedAnswer: { '@type': 'Answer', text: 'Sí. Villa Sera cuenta con acceso directo a una playa privada nadable, exclusiva para los huéspedes de la villa.' },
        },
        {
          '@type': 'Question',
          name: '¿Dónde está ubicada Villa Sera en Los Cabos?',
          acceptedAnswer: { '@type': 'Answer', text: 'Villa Sera está ubicada en Los Cabos, Baja California Sur, México, a aproximadamente 5 minutos del centro de Cabo San Lucas, con vistas directas al Mar de Cortés y al Arco de Cabo San Lucas.' },
        },
        {
          '@type': 'Question',
          name: '¿Qué servicios incluye Villa Sera?',
          acceptedAnswer: { '@type': 'Answer', text: 'La villa se puede complementar con servicios opcionales: chef privado, mayordomo 24/7, renta de yates, masajes y spa, actividades acuáticas y concierge para restaurantes y transporte.' },
        },
        {
          '@type': 'Question',
          name: '¿Cómo se reserva Villa Sera?',
          acceptedAnswer: { '@type': 'Answer', text: 'Se reserva directamente vía WhatsApp al +52 624 217 5935. También está disponible en Airbnb. La reserva directa garantiza el mejor precio sin comisiones.' },
        },
        {
          '@type': 'Question',
          name: '¿Se puede ver el Arco de Cabo San Lucas desde Villa Sera?',
          acceptedAnswer: { '@type': 'Answer', text: "Sí. El icónico Arco de Cabo San Lucas (Land's End) es visible desde la villa y desde la playa privada." },
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'Villa Sera Los Cabos',
      inLanguage: ['es-MX', 'en-US'],
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
