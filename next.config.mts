import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    PRISMA_CONNECTION_URL: process.env.PRISMA_CONNECTION_URL,
    CLERK_WEBHOOK_KEY: process.env.CLERK_WEBHOOK_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    OPENAI_CONNECTION_KEY: process.env.OPENAI_CONNECTION_KEY,
  },
};

export default nextConfig;
