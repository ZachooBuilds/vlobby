/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "subdomain",
      },
      {
        protocol: "https",
        hostname: "files.stripe.com",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "cdn.wallpapersafari.com",
      },
      {
        protocol: "https",
        hostname: "wlrjhfahgtvscqaickih.supabase.co",
      },
      {
        protocol: "https",
        hostname: "www.essentialair.co.nz",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
       {
        protocol: "https",
        hostname: "glad-kangaroo-520.convex.cloud",
      },

      
    ],
  },
};

export default nextConfig;
