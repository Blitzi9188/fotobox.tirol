import type { Metadata } from "next";
import Link from "next/link";
import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader, SlashHeading } from "@/components/site/SiteShell";
import BeforeAfterSlider from "@/components/site/BeforeAfterSlider";
import AccessoriesCarousel from "@/components/site/AccessoriesCarousel";
import ReferencesCarousel from "@/components/site/ReferencesCarousel";
import GoogleReviewsCarousel from "@/components/site/GoogleReviewsCarousel";
import { formatReviewDateWithCurrentYear, getSortedLatestReviews } from "@/lib/reviews";

export const dynamic = "force-dynamic";
type HomepageBlockId = "hero" | "features" | "space" | "media" | "pricing" | "reviews" | "faq";
const DEFAULT_HOMEPAGE_ORDER: HomepageBlockId[] = ["hero", "features", "reviews", "space", "media"];
const SITE_URL = "https://fotoboxtirol-production.up.railway.app";
const HOMEPAGE_AI_RIGHT_BEFORE_IMAGE = "/uploads/home-ai-right-after.jpg";
const HOMEPAGE_AI_RIGHT_AFTER_IMAGE = "/uploads/home-ai-right-before.jpg";

function subtitleHtmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|ul|ol)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await readCmsContent();
  const title = content.seo.title?.trim() || "Selfie Fotobox Tirol | Fotobox für Hochzeiten, Firmenfeiern und Events";
  const description =
    content.seo.description?.trim() ||
    "Selfie Fotobox Tirol für Hochzeiten, Firmenfeiern, Geburtstage und Events in Tirol. Moderne Fotobox mit Sofortdruck, Layouts, Branding und KI-Funktionen.";
  const ogImage = content.hero.imageUrl
    ? new URL(content.hero.imageUrl, SITE_URL).toString()
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: "/"
    },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: "Fotobox Tirol das Original",
      type: "website",
      locale: "de_AT",
      images: ogImage ? [{ url: ogImage, alt: "Fotobox Tirol das Original" }] : undefined
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [ogImage] : undefined
    }
  };
}

export default async function HomePage() {
  const content = await readCmsContent();
  const heroSubtitleText = (content.hero.subtitleText || subtitleHtmlToText(content.hero.subtitleHtml || "")).trim();
  const aiDescriptionText = (content.ai.descriptionText || subtitleHtmlToText(content.ai.descriptionHtml || "")).trim();
  const aiParagraphs = aiDescriptionText
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const homepageAiRightBeforeImage = HOMEPAGE_AI_RIGHT_BEFORE_IMAGE;
  const homepageAiRightAfterImage = HOMEPAGE_AI_RIGHT_AFTER_IMAGE;
  const cmsOrder = content.layout?.homepageOrder || [];
  const uniqueCmsOrder = [...new Set(cmsOrder)];
  const homepageOrder: HomepageBlockId[] = [
    ...uniqueCmsOrder.filter((id): id is HomepageBlockId => DEFAULT_HOMEPAGE_ORDER.includes(id as HomepageBlockId)),
    ...DEFAULT_HOMEPAGE_ORDER.filter((id) => !uniqueCmsOrder.includes(id))
  ];
  const orderedHomepageSections: HomepageBlockId[] = [
    ...homepageOrder.filter((id) => id === "hero"),
    ...homepageOrder.filter((id) => id === "features"),
    ...homepageOrder.filter((id) => id === "reviews"),
    ...homepageOrder.filter((id) => !["hero", "features", "reviews"].includes(id))
  ];
  const stars = (count: number) => Array.from({ length: Math.max(0, Math.min(5, Math.round(count))) }, (_, i) => (
    <span className="star" key={i}>★</span>
  ));
  const reviewsDefaults = {
    heading: "kunden/bewertungen",
    sourceLabel: "Google Bewertungen",
    score: "4.9",
    reviewCountLabel: "Basierend auf 47 Bewertungen",
    ctaLabel: "Alle Bewertungen auf Google ansehen",
    ctaHref: "https://g.page/fotoboxtirol/review",
    items: []
  };
  const reviews = {
    ...reviewsDefaults,
    ...(content.reviews || {}),
    items:
      Array.isArray(content.reviews?.items) && content.reviews.items.length > 0
        ? content.reviews.items
        : reviewsDefaults.items
  };
  const latestReviews = getSortedLatestReviews(reviews.items);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "ProfessionalService"],
        "@id": `${SITE_URL}/#business`,
        name: "Fotobox Tirol",
        url: SITE_URL,
        image: content.hero.imageUrl ? new URL(content.hero.imageUrl, SITE_URL).toString() : undefined,
        description: content.seo.description,
        telephone: content.contact.phone,
        email: content.contact.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: content.contact.address
        },
        areaServed: "Tirol",
        sameAs: (content.footer.socialLinks || []).map((link) => link.href).filter(Boolean)
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#service`,
        serviceType: "Fotobox Vermietung",
        provider: {
          "@id": `${SITE_URL}/#business`
        },
        areaServed: "Tirol",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Fotobox Pakete",
          itemListElement: content.pricing.plans.map((plan) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: plan.name
            },
            price: String(plan.price),
            priceCurrency: "EUR"
          }))
        }
      },
    ]
  };

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {homepageOrder.includes("hero") ? (
          <section className="hero">
            {content.hero.imageUrl ? (
              <div className="hero-media">
                <img
                  src={content.hero.imageUrl}
                  alt="Selfie Fotobox Tirol für Hochzeiten, Firmenfeiern und Events in Tirol"
                  className="hero-bg-image"
                />
              </div>
            ) : null}
            <div className="hero-glow hero-glow-right" />
            <div className="hero-content">
              <h1><SlashHeading value={content.hero.title} /></h1>
              <p
                className="hero-sub"
                style={{ color: content.hero.subtitleColor || undefined }}
              >
                {heroSubtitleText}
              </p>
              <div className="hero-actions">
                <Link href="/kontakt" className="btn hero-btn-primary">{content.hero.ctaText}</Link>
                <Link
                  href={content.hero.secondaryCtaHref || "/#features"}
                  className="btn btn-outline hero-btn-secondary"
                >
                  {content.hero.secondaryCtaText || "Mehr erfahren"}
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {orderedHomepageSections
          .filter((section) => section !== "hero")
          .map((section) => {
            if (section === "features") {
              return (
                <section id="features" className="features" key="features">
                  <div className="container">
                    <h2><SlashHeading value={content.features.heading} /></h2>
                    <div className="grid grid-3">
                      {content.features.items.map((feature) => (
                        <article className="feature-item" key={feature.title}>
                          <h3>{feature.title}</h3>
                          <p>{feature.description}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                </section>
              );
            }

            if (section === "media") {
              return (
                <div key="media-combined">
                  <section id="ai" className="container ai-section">
                    <div className="ai-showcase">
                      <div className="ai-compare-wrap">
                        <BeforeAfterSlider
                          title="KI Vergleich Links"
                          beforeImageUrl={content.ai.compareLeftBeforeUrl}
                          afterImageUrl={content.ai.compareLeftAfterUrl}
                          beforeImageAlt="Vorher-Bild der KI-Fotobox mit normalem Portrait vor der Umwandlung"
                          afterImageAlt="Nachher-Bild der KI-Fotobox mit kreativ verwandeltem Portrait"
                        />
                      </div>
                      <div className="ai-text">
                        <div className="ai-heading-wrap">
                          <span className="ai-badge ai-badge-float">{content.ai.badge}</span>
                          <h2><SlashHeading value={content.ai.heading} /></h2>
                        </div>
                        <div className="ai-description-block">
                          {(aiParagraphs.length > 0 ? aiParagraphs : [aiDescriptionText]).filter(Boolean).map((paragraph, index) => (
                            <p key={`ai-copy-${index}`}>{paragraph}</p>
                          ))}
                        </div>
                        <ul className="price-list">
                          {content.ai.bullets.map((item) => <li key={item}>✓ {item}</li>)}
                        </ul>
                        <div className="section-subpage-link">
                          <Link href="/ki-fotobox-tirol" className="btn">
                            zur ki-seite
                          </Link>
                        </div>
                      </div>
                      <div className="ai-compare-wrap">
                        <BeforeAfterSlider
                          title="KI Vergleich Rechts"
                          beforeImageUrl={homepageAiRightBeforeImage}
                          afterImageUrl={homepageAiRightAfterImage}
                          beforeImageAlt="Vorher-Bild der KI-Fotobox mit Person vor der KI-Transformation"
                          afterImageAlt="Nachher-Bild der KI-Fotobox mit Rennfahrer-Motiv nach der KI-Transformation"
                        />
                      </div>
                    </div>
                  </section>
                </div>
              );
            }

            if (section === "space") {
              return (
                <section id="space" className="space-block" key="space">
                  <div className="container">
                    <div className="space-grid">
                      <div className="space-copy">
                        <h2><SlashHeading value={content.space.heading} /></h2>
                        <p>{content.space.description}</p>
                        <div className="section-subpage-link">
                          <Link href="/technische-daten-aufbau" className="btn">
                            zu platz & aufbau
                          </Link>
                        </div>
                      </div>
                      <div className="space-visual">
                        {content.space.imageUrl ? (
                          <img src={content.space.imageUrl} alt="Platzbedarf der Fotobox für Events, Hochzeiten und Firmenfeiern" className="cover-image" />
                        ) : (
                          <div className="placeholder">[Platzbedarf Grafik]</div>
                        )}
                      </div>
                    </div>
                    <AccessoriesCarousel
                      heading={content.accessories.heading}
                      items={content.accessories.items}
                    />
                    <div id="layout" className="space-grid layout-grid-one" style={{ marginTop: "2rem" }}>
                      <div className="space-copy">
                        <h2><SlashHeading value={content.space.layoutOneHeading || "layout/gestaltung"} /></h2>
                        <p>{content.space.layoutOneDescription || content.space.description}</p>
                      </div>
                      <div className="space-visual space-visual-small">
                        {(content.space.layoutOneImageUrl || content.space.imageUrl) ? (
                          <img
                            src={content.space.layoutOneImageUrl || content.space.imageUrl}
                            alt={content.space.layoutOneImageAlt || "Fotobox Layout im Format 5x15 für Hochzeit oder Firmenfeier"}
                            className="cover-image"
                          />
                        ) : (
                          <div className="placeholder">[Layout/Gestaltung Grafik]</div>
                        )}
                      </div>
                    </div>
                    <div className="space-grid layout-grid-two" style={{ marginTop: "2rem" }}>
                      <div className="space-visual">
                        {(content.space.layoutTwoImageUrl || content.space.imageUrl) ? (
                          <img
                            src={content.space.layoutTwoImageUrl || content.space.imageUrl}
                            alt={content.space.layoutTwoImageAlt || "Fotobox Layout im Format 10x15 mit individuellem Event-Design"}
                            className="cover-image"
                          />
                        ) : (
                          <div className="placeholder">[Layout/Gestaltung Grafik]</div>
                        )}
                      </div>
                      <div className="space-copy">
                        <p>{content.space.layoutTwoDescription || content.space.description}</p>
                        <div className="section-subpage-link">
                          <Link href="/layout-gestaltung" className="btn">
                            zur layout-seite
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            }

            if (section === "reviews") {
              return latestReviews.length > 0 ? (
                <section id="reviews" className="reviews" key="reviews">
                  <div className="container">
                    <div className="overall-rating">
                      <div className="reviews-header">
                        <h2 style={{ marginBottom: "0.35rem" }}>
                          {reviews.heading.split("/")[0]}<span className="accent-slash">/</span>{reviews.heading.split("/")[1] || ""}
                        </h2>
                        <div className="google-badge">
                          <svg className="google-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                          </svg>
                          {reviews.sourceLabel}
                        </div>
                      </div>
                      <div className="stars-row">{stars(5)}</div>
                      <div className="review-count">{reviews.reviewCountLabel}</div>
                    </div>
                    <GoogleReviewsCarousel
                      items={latestReviews.map((review) => ({
                        ...review,
                        date: formatReviewDateWithCurrentYear(review.date)
                      }))}
                    />
                    <div className="reviews-cta">
                      <a href={reviews.ctaHref} target="_blank" rel="noopener noreferrer">
                        {reviews.ctaLabel}
                      </a>
                    </div>
                  </div>
                </section>
              ) : null;
            }

            if (section === "pricing") {
              return (
                <section id="pricing" className="pricing" key="pricing">
                  <div className="container">
                    <h2><SlashHeading value={content.pricing.heading} /></h2>
                    <div className="grid grid-3">
                      {content.pricing.plans.map((plan) => (
                        <article className={`price-card ${plan.featured ? "featured" : ""}`} key={plan.name}>
                          <div className="price-header">
                            <h3>{plan.name}</h3>
                            <div className="price-amount">{plan.price}<span>€</span></div>
                          </div>
                          <ul className="price-list">
                            {plan.items.map((item) => <li key={item}>✓ {item}</li>)}
                          </ul>
                          <Link
                            href={`/kontakt?paket=${encodeURIComponent(plan.name)}`}
                            className={plan.featured ? "btn" : "btn btn-outline"}
                          >
                            {plan.cta}
                          </Link>
                        </article>
                      ))}
                    </div>
                    {content.pricing.references && content.pricing.references.length > 0 ? (
                      <div className="home-references-block">
                        <h3 className="home-references-title">
                          <SlashHeading value={content.pricing.referencesHeading || "referenzen/partner"} />
                        </h3>
                        <ReferencesCarousel items={content.pricing.references} />
                      </div>
                    ) : null}
                  </div>
                </section>
              );
            }

            if (section === "faq") {
              return (
                <section id="faq" className="container" key="faq">
                  <h2 className="faq-title"><SlashHeading value={content.faq.heading} /></h2>
                  <div className="faq-wrap">
                    {content.faq.items.map((item) => (
                      <details className="faq-item" key={item.question}>
                        <summary className="faq-question">{item.question}</summary>
                        <p>{item.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              );
            }

            return null;
          })}
      </main>
      <SiteFooter content={content} />
    </>
  );
}
