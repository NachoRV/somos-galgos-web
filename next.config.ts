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
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withPayload(withNextIntl(nextConfig));