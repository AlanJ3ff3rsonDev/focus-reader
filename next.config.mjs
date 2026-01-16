/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Fix for pdfjs-dist
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    return config;
  },
  // Reduce build memory usage
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
