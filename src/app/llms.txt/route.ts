const SITE_URL = "https://fotoboxtirol-production.up.railway.app";

export function GET() {
  const body = [
    "# Fotobox Tirol",
    "",
    "> Fotobox Tirol das Original für Hochzeiten, Firmenfeiern, Geburtstage, Messen und Events in Tirol.",
    "",
    "## Angebot",
    "- Premium Fotobox mieten in Tirol",
    "- Sofortdruck in Laborqualität",
    "- Individuelle Layouts und Branding",
    "- KI-Fotobox mit Transformationen und Effekten",
    "- Accessoires und Requisiten für Events",
    "",
    "## Wichtige Seiten",
    `- Startseite: ${SITE_URL}/`,
    `- Kontakt und Anfrage: ${SITE_URL}/kontakt`,
    `- Preise: ${SITE_URL}/preise`,
    `- Fotobox Anlässe: ${SITE_URL}/fotobox-anlaesse`,
    `- Impressum: ${SITE_URL}/impressum`,
    `- Datenschutz: ${SITE_URL}/datenschutzerklaerung`,
    `- AGB: ${SITE_URL}/agb`,
    "",
    "## Standort und Servicegebiet",
    "- Standort: Birgitz, Tirol, Österreich",
    "- Service: Tirol und Umgebung",
    "",
    "## Kontakt",
    "- Telefon: +43 664 3918 228",
    "- E-Mail: info@fotobox.tirol"
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
