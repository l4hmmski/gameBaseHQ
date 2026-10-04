import type {
  NextConfig,
} from "next";

const securityHeaders = [
  {
    key:
      "X-Content-Type-Options",
    value: "nosniff",
  },

  {
    key:
      "X-Frame-Options",
    value: "DENY",
  },

  {
    key:
      "Referrer-Policy",
    value:
      "strict-origin-when-cross-origin",
  },

  {
    key:
      "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=()",
  },

  {
    key:
      "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "img-src 'self' data: blob: https://images.igdb.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "font-src 'self' data:",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source:
          "/(.*)",
        headers:
          securityHeaders,
      },
    ];
  },
};

export default nextConfig;