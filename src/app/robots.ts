import type { MetadataRoute } from "next";

const SITE_URL = "https://www.fotobox.tirol";

// KI- und Such-Crawler, die explizit erlaubt werden, damit die Inhalte
// in Google und in KI-Assistenten (ChatGPT, Claude, Perplexity, Gemini ...) auffindbar sind.
const ALLOWED_BOTS = [
  "*",
  "Googlebot",
  "Bingbot",
  // OpenAI
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  // Anthropic (Claude)
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  // Google KI-Training / Gemini
  "Google-Extended",
  // Apple Intelligence
  "Applebot",
  "Applebot-Extended",
  // Weitere
  "cohere-ai",
  "CCBot"
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: ALLOWED_BOTS.map((userAgent) => ({
      userAgent,
      allow: "/"
    })),
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}
