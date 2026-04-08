import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Exclude guest-guide: static HTML in public/guest-guide/ (not locale-routed)
  matcher: ['/((?!api|_next|_vercel|guest-guide(?:/.*)?|.*\\..*).*)'],
};
