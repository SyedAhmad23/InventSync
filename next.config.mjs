/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        pathname: "**",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
