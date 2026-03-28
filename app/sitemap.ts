import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.villa-sera.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}/es`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          'es-MX': `${BASE_URL}/es`,
          'en-US': `${BASE_URL}/en`,
          'x-default': `${BASE_URL}/es`,
        },
      },
    },
    {
      url: `${BASE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          'es-MX': `${BASE_URL}/es`,
          'en-US': `${BASE_URL}/en`,
          'x-default': `${BASE_URL}/es`,
        },
      },
    },
  ];
}
