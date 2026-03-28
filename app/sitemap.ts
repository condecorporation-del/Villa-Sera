import { MetadataRoute } from 'next';

const BASE_URL = 'https://villa-sera.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/servicios', '/galeria', '/experiencias', '/contacto'];
  const locales = [
    { locale: 'es', routeMap: { '/servicios': '/servicios', '/galeria': '/galeria', '/experiencias': '/experiencias', '/contacto': '/contacto' } },
    { locale: 'en', routeMap: { '/servicios': '/services', '/galeria': '/gallery', '/experiencias': '/experiences', '/contacto': '/contact' } },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const { locale, routeMap } of locales) {
      const localizedRoute = route in routeMap ? routeMap[route as keyof typeof routeMap] : route;
      entries.push({
        url: `${BASE_URL}/${locale}${localizedRoute}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            'es-MX': `${BASE_URL}/es${route in routeMap ? (locales[0].routeMap as Record<string, string>)[route] ?? route : route}`,
            'en-US': `${BASE_URL}/en${route in routeMap ? (locales[1].routeMap as Record<string, string>)[route] ?? route : route}`,
          },
        },
      });
    }
  }

  return entries;
}
