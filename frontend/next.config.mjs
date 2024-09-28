/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  images: {
    domains: ['cdn.countryflags.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.countryflags.com',
        pathname: '/thumbs/**',
      },
    ],
  },
};

export default nextConfig;