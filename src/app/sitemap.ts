import type { MetadataRoute } from "next";

const SITE_URL = "https://fotoboxtirol-production.up.railway.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    "",
    "/fotobox-mieten-tirol",
    "/kontakt",
    "/preise",
    "/danke",
    "/impressum",
    "/datenschutzerklaerung",
    "/agb",
    "/agb-b2b"
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/kontakt" || path === "/preise" ? 0.8 : 0.5
  }));
}
