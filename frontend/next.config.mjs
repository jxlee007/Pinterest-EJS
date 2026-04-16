/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*', // Proxy to Backend
      },
      {
        source: '/auth/me',
        destination: 'http://localhost:3000/auth/me', // Proxy to Backend auth
      },
      {
        source: '/images/:path*',
        destination: 'http://localhost:3000/images/:path*', // Proxy to Backend static images
      }
    ];
  },
};

export default nextConfig;
