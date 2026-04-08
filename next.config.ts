import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    qualities: [75, 90],
  },
  // Ensure Vercel serverless bundle includes the HTML read by app/guest-guide/route.ts
  outputFileTracingIncludes: {
    '/guest-guide': ['./public/guest-guide/index.html'],
  },
};

export default withNextIntl(nextConfig);
