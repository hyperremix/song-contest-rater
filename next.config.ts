import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'ik.imagekit.io',
        protocol: 'https',
        pathname: '/hyperremix/**',
      },
    ],
  },
  experimental: {
    authInterrupts: true,
  },
};

export default withNextIntl(nextConfig);
