/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  compress: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2678400,
    localPatterns: [{ pathname: "/uploads/**" }]
  },

  async headers() {
    return [
      {
        // Sicherheits-Header für alle Seiten
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
        ]
      },
      {
        // Statische Assets (JS, CSS, Fonts) – immutable, 1 Jahr
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        // Uploads (Bilder) – 30 Tage
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400"
          }
        ]
      },
      {
        // Favicons & public-Assets
        source: "/:file(favicon.*|apple-touch-icon.*|site.webmanifest)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400"
          }
        ]
      }
    ];
  },

  async redirects() {
    return [
      {
        source: "/preisgestaltung",
        destination: "/preise",
        permanent: true
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "fotobox.tirol" }],
        destination: "https://www.fotobox.tirol/:path*",
        permanent: true
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "fotoboxtirol-production.up.railway.app" }],
        destination: "https://www.fotobox.tirol/:path*",
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
