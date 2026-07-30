import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    qualities: [45, 70, 75, 80],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a0.muscache.com',
        pathname: '/im/pictures/**',
      },
    ],
  },
  // Ensure Vercel serverless bundle includes the HTML read by app/guest-guide/route.ts
  outputFileTracingIncludes: {
    '/guest-guide': ['./public/guest-guide/index.html'],
  },
};

export default withNextIntl(nextConfig);
