import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
          },
        },
      ],
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mpnqfsnbbbamcgtajmqd.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-c7471db8ab8f41db811ca1c06bbaf3a3.r2.dev',
        pathname: '/somos-galgos/**',
      },
      {
        protocol: 'https',
        hostname: 'media.somosgalgos.es',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'no-referrer-when-downgrade',
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withPayload(withNextIntl(nextConfig));