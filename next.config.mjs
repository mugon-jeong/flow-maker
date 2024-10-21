/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lucide-react'], // add this
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
      },
    ],
  },
};

export default nextConfig;
