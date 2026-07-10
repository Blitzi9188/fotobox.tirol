const SITE_URL = "https://www.fotobox.tirol";

export const revalidate = 3600;

export function GET() {
  const body = [
    "# Fotobox Tirol",
    "",
    "> Fotobox Tirol – das Original für Hochzeiten, Firmenfeiern, Geburtstage, Messen und Events in ganz Tirol. Hochwertige, selbst gebaute Fotobox mit Spiegelreflexkamera, Sofortdruck, individuellem Layout, Requisiten und optionalen KI-Effekten. Seit 2013 im Einsatz.",
    "",
    "## Angebot",
    "- Premium Fotobox mieten in Tirol (ab 400 €)",
    "- Sofortdruck in Laborqualität (600–800 Ausdrucke inklusive)",
    "- Individuelle Print-Layouts mit Namen, Datum und Farben",
    "- KI-Fotobox mit Transformationen und Effekten",
    "- Accessoires und Requisiten für Events",
    "- Abholung oder Lieferung inklusive Aufbau und Einschulung",
    "",
    "## Wichtige Seiten",
    `- Startseite: ${SITE_URL}/`,
    `- Fotobox mieten Tirol: ${SITE_URL}/fotobox-mieten-tirol`,
    `- Fotobox Anlässe (Übersicht): ${SITE_URL}/fotobox-anlaesse`,
    `- Hochzeitsfotobox: ${SITE_URL}/fotobox-hochzeit`,
    `- Fotobox für Firmenfeiern: ${SITE_URL}/fotobox-firmenfeier`,
    `- KI-Fotobox: ${SITE_URL}/ki-fotobox-tirol`,
    `- Layout-Gestaltung: ${SITE_URL}/layout-gestaltung`,
    `- Technische Daten und Aufbau: ${SITE_URL}/technische-daten-aufbau`,
    `- Preise und Pakete: ${SITE_URL}/preise`,
    `- Kontakt und Anfrage: ${SITE_URL}/kontakt`,
    `- Impressum: ${SITE_URL}/impressum`,
    `- Datenschutz: ${SITE_URL}/datenschutzerklaerung`,
    `- AGB: ${SITE_URL}/agb`,
    "",
    "## Anlässe",
    "- Hochzeiten (rund 50 pro Jahr, seit 2013, auf Tirols schönsten Locations)",
    "- Firmenfeiern und Firmenevents (Branding, gebrandete Ausdrucke, Rechnung, DSGVO)",
    "- Geburtstage und private Feiern",
    "- Messen, Galas und Bälle",
    "",
    "## Standort und Servicegebiet",
    "- Standort: Birgitz, 6092, Tirol, Österreich",
    "- Servicegebiet: ganz Tirol und Umgebung",
    "",
    "## Kontakt",
    "- Telefon: +43 664 3918 228",
    "- E-Mail: info@fotobox.tirol",
    `- Website: ${SITE_URL}/`
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
