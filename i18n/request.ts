import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { routing } from './routing';

export default getRequestConfig(async () => {
  // Read locale from cookie, fallback to default
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('user-locale')?.value;
  
  let locale: string;
  
  // Validate cookie locale
  if (localeCookie && routing.locales.includes(localeCookie as 'es' | 'en')) {
    locale = localeCookie;
  } else {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
