import Link from "next/link";
import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader, SlashHeading } from "@/components/site/SiteShell";
import BeforeAfterSlider from "@/components/site/BeforeAfterSlider";
import AccessoriesCarousel from "@/components/site/AccessoriesCarousel";

export const dynamic = "force-dynamic";
type HomepageBlockId = "hero" | "features" | "space" | "media" | "pricing" | "reviews" | "faq";
const DEFAULT_HOMEPAGE_ORDER: HomepageBlockId[] = ["hero", "features", "space", "media", "pricing", "reviews", "faq"];

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

export default async function HomePage() {
  const content = await readCmsContent();
  const reviews = content.reviews || {
    heading: "kunden/bewertungen",
    sourceLabel: "Google Bewertungen",
    score: "4.9",
    reviewCountLabel: "Basierend auf 47 Bewertungen",
    ctaLabel: "Alle Bewertungen auf Google ansehen",
    ctaHref: "https://g.page/fotoboxtirol/review",
    items: [
      {
        name: "Sarah M.",
        date: "Oktober 2024",
        text: "Absolut begeistert! Die Fotobox war der Highlight unserer Hochzeit.",
        initials: "SM",
        avatarColor: "#ea2c2c",
        rating: 5
      },
      {
        name: "Thomas K.",
        date: "September 2024",
        text: "Für unsere Firmenfeier genau das Richtige. Klare Empfehlung.",
        initials: "TK",
        avatarColor: "#1a1a1a",
        rating: 5
      },
      {
        name: "Laura B.",
        date: "August 2024",
        text: "Top Bildqualität und reibungsloser Ablauf.",
        initials: "LB",
        avatarColor: "#616161",
        rating: 5
      }
    ]
  };
  const heroSubtitleText = (content.hero.subtitleText || subtitleHtmlToText(content.hero.subtitleHtml || "")).trim();
  const aiDescriptionText = (content.ai.descriptionText || subtitleHtmlToText(content.ai.descriptionHtml || "")).trim();
  const aiParagraphs = aiDescriptionText
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const cmsOrder = content.layout?.homepageOrder || [];
  const uniqueCmsOrder = [...new Set(cmsOrder)];
  const homepageOrder: HomepageBlockId[] = [
    ...uniqueCmsOrder.filter((id): id is HomepageBlockId => DEFAULT_HOMEPAGE_ORDER.includes(id as HomepageBlockId)),
    ...DEFAULT_HOMEPAGE_ORDER.filter((id) => !uniqueCmsOrder.includes(id))
  ];
  const stars = (value: number) => Array.from({ length: Math.max(0, Math.min(5, value)) }, (_, i) => (
    <span className="star" key={i}>★</span>
  ));

  return (
    <>
      <SiteHeader content={content} />
      <main>
        {homepageOrder.includes("hero") ? (
          <section className="hero">
            {content.hero.imageUrl ? (
              <img
                src={content.hero.imageUrl}
                alt="Fotobox Tirol Hero"
                className="hero-bg-image"
              />
            ) : null}
            <div className="hero-glow hero-glow-left" />
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

        {homepageOrder
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
                        <Link href="/kontakt" className="btn ai-cta-btn">
                          jetzt die Zukunft Starten
                        </Link>
                        <ul className="price-list">
                          {content.ai.bullets.map((item) => <li key={item}>✓ {item}</li>)}
                        </ul>
                      </div>
                      <div className="ai-compare-wrap">
                        <BeforeAfterSlider
                          title="KI Vergleich Rechts"
                          beforeImageUrl={content.ai.compareRightBeforeUrl}
                          afterImageUrl={content.ai.compareRightAfterUrl}
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
                      </div>
                      <div className="space-visual">
                        {content.space.imageUrl ? (
                          <img src={content.space.imageUrl} alt="Platzbedarf Fotobox" className="cover-image" />
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
                            alt={content.space.layoutOneImageAlt || "Layout Gestaltung Fotobox"}
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
                            alt={content.space.layoutTwoImageAlt || "Layout Gestaltung Fotobox"}
                            className="cover-image"
                          />
                        ) : (
                          <div className="placeholder">[Layout/Gestaltung Grafik]</div>
                        )}
                      </div>
                      <div className="space-copy">
                        <p>{content.space.layoutTwoDescription || content.space.description}</p>
                      </div>
                    </div>
                  </div>
                </section>
              );
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

            if (section === "reviews") {
              return (
                <section id="reviews" className="reviews" key="reviews">
                  <div className="container">
                    <div className="overall-rating">
                      <div className="reviews-header">
                        <h2 style={{ marginBottom: 0 }}><SlashHeading value={reviews.heading} /></h2>
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
                      <div className="overall-score">{reviews.score}</div>
                      <div className="stars-row">{stars(5)}</div>
                      <div className="review-count">{reviews.reviewCountLabel}</div>
                    </div>
                    <div className="reviews-grid">
                      {reviews.items.map((review, index) => (
                        <article className="review-card" key={`${review.name}-${index}`}>
                          <div className="review-top">
                            <div className="reviewer-avatar" style={{ background: review.avatarColor || "#ea2c2c" }}>{review.initials}</div>
                            <div>
                              <div className="reviewer-name">{review.name}</div>
                              <div className="review-date">{review.date}</div>
                            </div>
                          </div>
                          <div className="review-stars">{stars(review.rating)}</div>
                          <p className="review-text">{review.text}</p>
                        </article>
                      ))}
                    </div>
                    <div className="reviews-cta">
                      <a href={reviews.ctaHref} target="_blank" rel="noopener noreferrer">
                        {reviews.ctaLabel}
                      </a>
                    </div>
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
