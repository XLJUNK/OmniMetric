import type { NextConfig } from "next"; // Server Restart Trigger

// @ts-expect-error - next-pwa does not have built-in types for this import style
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  images: { unoptimized: true },
  turbopack: {},
};

export default withPWA(nextConfig);
