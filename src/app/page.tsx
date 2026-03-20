import type { Metadata } from "next";
import Link from "next/link";
import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader, SlashHeading } from "@/components/site/SiteShell";
import BeforeAfterSlider from "@/components/site/BeforeAfterSlider";
import AccessoriesCarousel from "@/components/site/AccessoriesCarousel";

export const dynamic = "force-dynamic";
type HomepageBlockId = "hero" | "features" | "space" | "media" | "pricing" | "reviews" | "faq";
const DEFAULT_HOMEPAGE_ORDER: HomepageBlockId[] = ["hero", "features", "space", "media", "pricing", "reviews", "faq"];
const SITE_URL = "https://fotoboxtirol-production.up.railway.app";

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
  const title = content.seo.title?.trim() || "Fotobox Tirol das Original";
  const description =
    content.seo.description?.trim() ||
    "Fotobox Tirol das Original fuer Hochzeiten, Firmenfeiern und Events in Tirol.";
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
  const cmsOrder = content.layout?.homepageOrder || [];
  const uniqueCmsOrder = [...new Set(cmsOrder)];
  const homepageOrder: HomepageBlockId[] = [
    ...uniqueCmsOrder.filter((id): id is HomepageBlockId => DEFAULT_HOMEPAGE_ORDER.includes(id as HomepageBlockId)),
    ...DEFAULT_HOMEPAGE_ORDER.filter((id) => !uniqueCmsOrder.includes(id))
  ].filter((id) => id !== "reviews");
  const faqEntities = content.faq.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer
    }
  }));
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
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: faqEntities
      }
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
                  alt="Fotobox Tirol Hero"
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

            return null;
          })}
        <section className="home-bottom-cta">
          <div className="container home-bottom-cta-inner">
            <Link href="/kontakt" className="btn home-bottom-cta-btn">
              jetzt anfragen
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
