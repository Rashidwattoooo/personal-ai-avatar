/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disabled: StrictMode double-invokes effects in dev, which needlessly tears down
  // and rebuilds the live Daily/WebRTC call and can end the Tavus conversation mid-join.
  reactStrictMode: false,
  poweredByHeader: false,
};

export default nextConfig;
