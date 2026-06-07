import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://danafdr-portfolio-api.onrender.com/api/:path*',
      },
      {
        source: '/sanctum/csrf-cookie',
        destination: 'https://danafdr-portfolio-api.onrender.com/sanctum/csrf-cookie',
      },
      {
        source: '/storage/:path*',
        destination: 'https://danafdr-portfolio-api.onrender.com/storage/:path*',
      }
    ];
  }
};

export default nextConfig;
