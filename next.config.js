

const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  generateEtags: false,
  output: 'serverless',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/signup',
        permanent: false,
      },
    ];
  },
  webpack: (config) => {
    config.plugins.push(new NodePolyfillPlugin());
    config.stats = 'verbose';
    config.module.rules.push({
      test: /@chakra-ui\/react/,
      use: 'null-loader',
    });
    config.resolve.fallback = {
      fs: false,
      path: require.resolve('path-browserify'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      url: require.resolve('url'),
      util: require.resolve('util'),
      process: require.resolve('process/browser'),
    };
    return config;
  },
};

module.exports = nextConfig;