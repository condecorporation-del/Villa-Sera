import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    qualities: [75, 90],
  },
  async rewrites() {
    return [
      { source: '/guest-guide', destination: '/guest-guide/index.html' },
      { source: '/guest-guide/', destination: '/guest-guide/index.html' },
    ];
  },
};

export default withNextIntl(nextConfig);
