/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
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
