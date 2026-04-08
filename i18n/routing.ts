import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'en',
  // No pathnames - using cookie-based locale instead of URL-based
});
