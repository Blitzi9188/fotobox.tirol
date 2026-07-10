import type { MetadataRoute } from "next";

const SITE_URL = "https://www.fotobox.tirol";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Alle oeffentlichen, indexierbaren Seiten.
  // Prioritaeten: Startseite 1.0 > Haupt-Landingpages 0.9 > Kontakt/Preise 0.8 > Rest 0.5
  // Rechtstexte niedrig (0.3). /danke ist noindex und gehoert NICHT in die Sitemap.
  const entries: Array<{ path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }> = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/fotobox-mieten-tirol", priority: 0.9, changeFrequency: "monthly" },
    { path: "/ki-fotobox-tirol", priority: 0.9, changeFrequency: "monthly" },
    { path: "/fotobox-anlaesse", priority: 0.9, changeFrequency: "monthly" },
    { path: "/fotobox-hochzeit", priority: 0.9, changeFrequency: "monthly" },
    { path: "/fotobox-firmenfeier", priority: 0.9, changeFrequency: "monthly" },
    { path: "/preise", priority: 0.8, changeFrequency: "monthly" },
    { path: "/layout-gestaltung", priority: 0.7, changeFrequency: "monthly" },
    { path: "/technische-daten-aufbau", priority: 0.7, changeFrequency: "monthly" },
    { path: "/kontakt", priority: 0.8, changeFrequency: "monthly" },
    { path: "/impressum", priority: 0.3, changeFrequency: "yearly" },
    { path: "/datenschutzerklaerung", priority: 0.3, changeFrequency: "yearly" },
    { path: "/agb", priority: 0.3, changeFrequency: "yearly" },
    { path: "/agb-b2b", priority: 0.3, changeFrequency: "yearly" }
  ];

  return entries.map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority
  }));
}
