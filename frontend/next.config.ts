import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sdgs.un.org',
        port: '',
        pathname: '/sites/default/files/goals/**',
      },
    ],
  },
};

export default nextConfig;
