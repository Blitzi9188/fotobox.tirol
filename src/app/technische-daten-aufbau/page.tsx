import type { Metadata } from "next";
import Link from "next/link";
import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader, SlashHeading } from "@/components/site/SiteShell";
import { DEFAULT_SETUP_CONTENT } from "@/lib/setupDefaults";

export const dynamic = "force-dynamic";
const SITE_URL = "https://fotoboxtirol-production.up.railway.app";

export async function generateMetadata(): Promise<Metadata> {
  const content = await readCmsContent();
  const setup = content.setup || DEFAULT_SETUP_CONTENT;

  return {
    title: setup.seoTitle || DEFAULT_SETUP_CONTENT.seoTitle,
    description: setup.seoDescription || DEFAULT_SETUP_CONTENT.seoDescription,
    alternates: {
      canonical: "/technische-daten-aufbau"
    },
    openGraph: {
      title: setup.seoTitle || DEFAULT_SETUP_CONTENT.seoTitle,
      description: setup.seoDescription || DEFAULT_SETUP_CONTENT.seoDescription,
      url: `${SITE_URL}/technische-daten-aufbau`,
      type: "article"
    }
  };
}

function getYouTubeEmbedUrl(value: string) {
  if (!value.trim()) return "";

  try {
    const url = new URL(value);

    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "").trim();
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) return value;
      const id = url.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
  } catch {
    return "";
  }

  return "";
}

function SpecIcon({ kind }: { kind: string }) {
  if (kind === "print") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden="true">
        <polyline points="7 8 7 3 17 3 17 8" />
        <path d="M7 18H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="7" y="14" width="10" height="7" />
      </svg>
    );
  }

  if (kind === "screen") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden="true">
        <rect x="3" y="4" width="18" height="12" rx="2.2" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <line x1="12" y1="16" x2="12" y2="20" />
      </svg>
    );
  }

  if (kind === "light") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden="true">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a6 6 0 0 0-3.9 10.56c.58.5.9 1.22.9 1.98V15h6v-.46c0-.76.32-1.48.9-1.98A6 6 0 0 0 12 2Z" />
      </svg>
    );
  }

  if (kind === "power") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden="true">
        <path d="M12 2v8" />
        <path d="M8.5 4.5A8 8 0 1 0 19 12" />
      </svg>
    );
  }

  if (kind === "event") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden="true">
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18" />
      </svg>
    );
  }

  if (kind === "photos") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden="true">
        <rect x="3" y="5" width="14" height="14" rx="2" />
        <path d="m17 8 4 4" />
        <path d="M8 11h.01" />
        <path d="m7 16 3-3 2 2 3-4 2 2" />
      </svg>
    );
  }

  if (kind === "time") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden="true">
      <path d="M4 8h3l1.7-2h6.6L17 8h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function TechnischeDatenAufbauPage() {
  const content = await readCmsContent();
  const setup = content.setup || DEFAULT_SETUP_CONTENT;
  const setupVideoEmbedUrl = getYouTubeEmbedUrl(setup.videoUrl || "");

  return (
    <>
      <SiteHeader content={content} />
      <main className="setup-page">
        <section className="page-hero seo-landing-hero pricing-hero setup-hero">
          <div className="container">
            <span className="pricing-hero-badge">{setup.badge}</span>
            <h1>
              <SlashHeading value={setup.heading} />
            </h1>
            <p className="pricing-hero-subtitle">{setup.lead}</p>
          </div>
        </section>

        <section className="seo-landing-section setup-section">
          <div className="container">
            <div className="setup-spec-layout">
              <div className="setup-spec-grid">
                {setup.specs.map((item) => (
                  <article key={item.label} className="setup-spec-card">
                    <div className="setup-spec-icon">
                      <SpecIcon kind={item.icon} />
                    </div>
                    <span className="setup-spec-label">{item.label}</span>
                    <p className="setup-spec-value">{item.value}</p>
                  </article>
                ))}
              </div>

              <div className="setup-spec-visual">
                <img src={setup.overviewImageUrl} alt={setup.overviewImageAlt || setup.heading} className="setup-spec-image" />
              </div>
            </div>
          </div>
        </section>

        <section className="seo-landing-section seo-landing-alt setup-section">
          <div className="container">
            <div className="setup-section-head">
              <h2 className="setup-section-title">
                <SlashHeading value={setup.stepsTitle} />
              </h2>
              <p className="setup-section-intro">{setup.stepsLead}</p>
            </div>

            <div className="setup-video-shell">
              {setupVideoEmbedUrl ? (
                <div className="setup-video-frame">
                  <iframe
                    src={setupVideoEmbedUrl}
                    title="Aufbauvideo der Fotobox"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="setup-video-placeholder">
                  <span className="setup-video-play" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 6.8v10.4a1 1 0 0 0 1.52.85l8.15-5.2a1 1 0 0 0 0-1.7l-8.15-5.2A1 1 0 0 0 8 6.8Z" />
                    </svg>
                  </span>
                  <strong>YouTube-Aufbauvideo</strong>
                  <p>Hier kann direkt ein YouTube-Video zum Aufbau und zur Funktionsweise der Fotobox eingebunden werden.</p>
                </div>
              )}
            </div>

            <div className="setup-steps-shell">
              <p className="setup-steps-label">Aufbau in {setup.steps.length} Schritten</p>
              <div className="setup-steps-grid">
                {setup.steps.map((step, index) => (
                  <article key={`${step.title}-${index}`} className="setup-step-cell">
                    <span className="setup-step-number">{String(index + 1).padStart(2, "0")}</span>
                    <div className="setup-step-copy">
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="seo-landing-section setup-section">
          <div className="container">
            <div className="setup-space-panel">
              <div className="setup-space-copy">
                <h2 className="setup-section-title">
                  <SlashHeading value={setup.spaceTitle} />
                </h2>
                <p className="setup-section-intro">{setup.spaceLead}</p>
                <div className="setup-note-box">
                  <strong>{setup.noteTitle}</strong>
                  <p>{setup.noteText}</p>
                </div>
              </div>

              <div className="setup-space-side">
                {setup.spaceImageUrl ? (
                  <div className="setup-space-visual">
                    <img src={setup.spaceImageUrl} alt={setup.spaceImageAlt || setup.spaceTitle} className="setup-space-image" />
                  </div>
                ) : null}

                <div className="setup-space-grid">
                  {setup.spaceItems.map((item) => (
                    <article key={item.label} className="setup-space-item">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="seo-landing-section seo-landing-alt setup-section">
          <div className="container">
            <div className="setup-two-column-grid">
              <article className="setup-info-card">
                <h2 className="setup-section-title">
                  <SlashHeading value={setup.checklistTitle} />
                </h2>
                <ul className="setup-check-list">
                  {setup.checklistItems.map((item) => (
                    <li key={item}>
                      <span className="setup-check-icon">
                        <CheckIcon />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="setup-info-card">
                <h2 className="setup-section-title">
                  <SlashHeading value={setup.featureTitle} />
                </h2>
                <div className="setup-feature-list">
                  {setup.featureItems.map((item) => (
                    <article key={item.title} className="setup-feature-card">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </article>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="seo-landing-section pricing-contact-section">
          <div className="container">
            <section className="pricing-contact-panel">
              <div className="pricing-contact-copy">
                <h2>{setup.ctaTitle}</h2>
                <p className="pricing-contact-intro">{setup.ctaLead}</p>
              </div>
              <div className="pricing-contact-actions">
                <Link href={setup.primaryCtaHref} className="pricing-contact-primary">
                  {setup.primaryCtaText}
                </Link>
                <Link href={setup.secondaryCtaHref} className="pricing-offer-button">
                  {setup.secondaryCtaText}
                </Link>
              </div>
            </section>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
