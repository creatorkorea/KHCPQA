/** @type {import('next').NextConfig} */
let supabaseImageHostname = "**.supabase.co";

try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    supabaseImageHostname = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
  }
} catch {
  supabaseImageHostname = "**.supabase.co";
}

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "7mb"
    }
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.smc365.ac",
        pathname: "/images/content/**"
      },
      {
        protocol: "https",
        hostname: supabaseImageHostname,
        pathname: "/storage/v1/object/public/**"
      }
    ]
  }
};

export default nextConfig;
