/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      // Alte Preisseite dauerhaft auf die neue Preisseite umleiten.
      {
        source: "/preisgestaltung",
        destination: "/preise",
        permanent: true // 301
      },
      // Nackte Domain -> www (Absicherung auf App-Ebene).
      // Empfehlung: zusaetzlich im Railway-Dashboard auf Domain-Ebene setzen,
      // da das schneller greift, bevor die Anfrage den Server erreicht.
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "fotobox.tirol"
          }
        ],
        destination: "https://www.fotobox.tirol/:path*",
        permanent: true // 301
      },
      // Alte Railway-Vorschau-URL -> echte Domain.
      // Sorgt dafuer, dass die railway.app-URL aus dem Google-Index faellt
      // und niemand mehr auf der Vorschau-Adresse landet.
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "fotoboxtirol-production.up.railway.app"
          }
        ],
        destination: "https://www.fotobox.tirol/:path*",
        permanent: true // 301
      }
    ];
  }
};

module.exports = nextConfig;
