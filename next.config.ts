import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    qualities: [75, 90],
  },
  async redirects() {
    return [
      {
        source: '/guest-guide.html',
        destination: '/g',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
