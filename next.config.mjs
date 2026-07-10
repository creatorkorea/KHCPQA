/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.smc365.ac",
        pathname: "/images/content/**"
      }
    ]
  }
};

export default nextConfig;
