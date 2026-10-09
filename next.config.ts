
import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",

      "object-src 'none'",

      "base-uri 'self'",

      "frame-ancestors 'none'",

      "form-action 'self'",

      // Game images and analytics pixels
      [
        "img-src",
        "'self'",
        "data:",
        "blob:",
        "https://images.igdb.com",
        "https://*.google-analytics.com",
      ].join(" "),

      // Supabase, Sentry, Google Analytics
      [
        "connect-src",
        "'self'",
        "https://*.supabase.co",
        "wss://*.supabase.co",
        "https://*.ingest.us.sentry.io",
        "https://*.google-analytics.com",
        "https://www.googletagmanager.com",
      ].join(" "),

      // Styles
      "style-src 'self' 'unsafe-inline'",

      // Next.js, Google Analytics, Vercel monitoring
      [
        "script-src",
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://www.googletagmanager.com",
        "https://*.google-analytics.com",
        "https://va.vercel-scripts.com",
      ].join(" "),

      // Fonts
      "font-src 'self' data:",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.igdb.com",
        pathname: "/igdb/image/upload/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "gamebasehq",

  project: "javascript-nextjs",

  // Only print source-map upload logs in CI
  silent: !process.env.CI,

  // Upload additional source maps
  widenClientFileUpload: true,

  webpack: {
    automaticVercelMonitors: true,

    treeshake: {
      removeDebugLogging: true,
    },
  },
});
