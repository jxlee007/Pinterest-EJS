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
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*', // Proxy to Backend
      },
      {
        source: '/auth/me',
        destination: 'http://localhost:5000/auth/me', // Proxy to Backend auth
      },
      {
        source: '/images/:path*',
        destination: 'http://localhost:5000/images/:path*', // Proxy to Backend static images
      }
    ];
  },
};

export default nextConfig;
