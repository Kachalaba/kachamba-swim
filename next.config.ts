import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    tsconfigPath: "tsconfig.next.json",
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.kachalaba.coach" }],
        destination: "https://kachalaba.coach/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
