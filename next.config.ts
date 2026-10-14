import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  devIndicators: false,
};

export default config;
