import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://kttedywsmneiwqgvgbgo.supabase.co/**')],
  },
};

export default nextConfig;
