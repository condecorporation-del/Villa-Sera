import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  pathnames: {
    '/': '/',
    '/servicios': {
      es: '/servicios',
      en: '/services',
    },
    '/galeria': {
      es: '/galeria',
      en: '/gallery',
    },
    '/experiencias': {
      es: '/experiencias',
      en: '/experiences',
    },
    '/contacto': {
      es: '/contacto',
      en: '/contact',
    },
  },
});
