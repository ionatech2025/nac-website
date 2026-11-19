/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/database", "@repo/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nacuganda.org",
        pathname: "/sites/default/files/**",
      },
    ],
  },
};

export default nextConfig;
