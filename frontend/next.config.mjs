/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/images/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000',
        pathname: '/images/uploads/**',
      }
    ],
  },
  async rewrites() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*`, // Proxy to Backend
      },
      {
        source: '/auth/me',
        destination: `${API_URL}/auth/me`, // Proxy to Backend auth
      },
      {
        source: '/images/:path*',
        destination: `${API_URL}/images/:path*`, // Proxy to Backend static images
      }
    ];
  },
};

export default nextConfig;
