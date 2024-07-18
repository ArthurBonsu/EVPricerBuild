/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  generateEtags: false,
  
  async redirects() {
      return [
        {
          source: '/',
          destination: '/signup',
          permanent: false, // Use `true` if you want the redirect to be permanent
        },
      ];
    },
  };
  
  module.exports = nextConfig;
  