import type { Metadata } from "next";
import Link from "next/link";
import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader, SlashHeading } from "@/components/site/SiteShell";
import { DEFAULT_LAYOUT_PAGE_CONTENT } from "@/lib/layoutPageDefaults";

export const dynamic = "force-dynamic";
const SITE_URL = "https://fotoboxtirol-production.up.railway.app";

const ADVANTAGE_ICONS = [
  (
    <svg key="star" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  (
    <svg key="user" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  (
    <svg key="book" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  (
    <svg key="frame" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  )
];

export async function generateMetadata(): Promise<Metadata> {
  const content = await readCmsContent();
  const layoutPage = content.layoutPage || DEFAULT_LAYOUT_PAGE_CONTENT;
  const title = layoutPage.seoTitle || DEFAULT_LAYOUT_PAGE_CONTENT.seoTitle;
  const description = layoutPage.seoDescription || DEFAULT_LAYOUT_PAGE_CONTENT.seoDescription;

  return {
    title,
    description,
    alternates: {
      canonical: "/layout-gestaltung"
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/layout-gestaltung`,
      type: "article",
      locale: "de_AT",
      siteName: "Fotobox Tirol"
    },
    twitter: {
      card: "summary",
      title,
      description
    }
  };
}

function BenefitIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function LayoutStripMockup({
  primaryImageUrl,
  primaryImageAlt,
  secondaryImageUrl,
  secondaryImageAlt
}: {
  primaryImageUrl?: string;
  primaryImageAlt?: string;
  secondaryImageUrl?: string;
  secondaryImageAlt?: string;
}) {
  return (
    <div className="layout-mockup layout-mockup-strip">
      <div className="layout-strip-secondary">
        <img
          src={secondaryImageUrl || "/uploads/layout-strip-weihnachtsfeier-2.png"}
          alt={secondaryImageAlt || "Hinterer Fotostreifen im Format 5x15 mit Beispiel-Layout für Eventfotos"}
          className="layout-strip-image"
        />
      </div>
      <div className="layout-strip-primary">
        <img
          src={primaryImageUrl || "/uploads/layout-strip-weihnachtsfeier-1.png"}
          alt={primaryImageAlt || "Vorderer Fotostreifen im Format 5x15 mit individuellem Fotobox-Layout"}
          className="layout-strip-image is-featured"
        />
      </div>
    </div>
  );
}

function LayoutClassicMockup({
  primaryImageUrl,
  primaryImageAlt,
  secondaryImageUrl,
  secondaryImageAlt
}: {
  primaryImageUrl?: string;
  primaryImageAlt?: string;
  secondaryImageUrl?: string;
  secondaryImageAlt?: string;
}) {
  return (
    <div className="layout-mockup layout-mockup-classic">
      <div className="layout-classic-secondary">
        <img
          src={secondaryImageUrl || "/uploads/layout-classic-10x15-2.png"}
          alt={secondaryImageAlt || "Hinterer Print im Format 10x15 mit Beispiel-Layout für Eventfotos"}
          className="layout-classic-image"
        />
      </div>
      <div className="layout-classic-primary">
        <img
          src={primaryImageUrl || "/uploads/layout-classic-10x15-1.png"}
          alt={primaryImageAlt || "Vorderer Print im Format 10x15 mit individuellem Fotobox-Layout"}
          className="layout-classic-image is-featured"
        />
      </div>
    </div>
  );
}

export default async function LayoutGestaltungPage() {
  const content = await readCmsContent();
  const layoutPage = content.layoutPage || DEFAULT_LAYOUT_PAGE_CONTENT;
  const formatSections = layoutPage.formatSections?.length ? layoutPage.formatSections : DEFAULT_LAYOUT_PAGE_CONTENT.formatSections;
  const advantages = layoutPage.advantages?.length ? layoutPage.advantages : DEFAULT_LAYOUT_PAGE_CONTENT.advantages;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/layout-gestaltung#page`,
        name: layoutPage.seoTitle || DEFAULT_LAYOUT_PAGE_CONTENT.seoTitle,
        url: `${SITE_URL}/layout-gestaltung`,
        description: layoutPage.seoDescription || DEFAULT_LAYOUT_PAGE_CONTENT.seoDescription
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/layout-gestaltung#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Startseite",
            item: `${SITE_URL}/`
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Layout Gestaltung",
            item: `${SITE_URL}/layout-gestaltung`
          }
        ]
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/layout-gestaltung#service`,
        name: "Fotobox Layout Gestaltung Tirol",
        serviceType: "Individuelle Fotobox Layouts für 5x15 und 10x15",
        url: `${SITE_URL}/layout-gestaltung`,
        areaServed: "Tirol",
        description: layoutPage.lead,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Fotobox Layout Formate",
          itemListElement: formatSections.map((section) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: section.heading,
              description: section.lead
            }
          }))
        }
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/layout-gestaltung#benefits`,
        name: "Vorteile individueller Fotobox Layouts",
        itemListElement: advantages.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Thing",
            name: item.title,
            description: item.text
          }
        }))
      }
    ]
  };

  return (
    <>
      <SiteHeader content={content} />
      <main className="layout-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <section className="page-hero seo-landing-hero pricing-hero layout-page-hero">
          <div className="container">
            <span className="pricing-hero-badge">{layoutPage.badge}</span>
            <h1>
              <SlashHeading value={layoutPage.heading} />
            </h1>
            <p>{layoutPage.lead}</p>
          </div>
        </section>

        <section id="layout-formate" className="seo-landing-section layout-format-section">
          <div className="container layout-format-stack">
            {formatSections.map((section, index) => {
              const reversed = index % 2 === 1;

              return (
                <article key={section.heading} className={`layout-format-grid${reversed ? " is-reversed" : ""}`}>
                  <div className="layout-format-copy">
                    <span className="layout-format-badge">{section.eyebrow}</span>
                    <h2>
                      <SlashHeading value={section.heading} />
                    </h2>
                    <p className="layout-format-lead">{section.lead}</p>
                    <div className="layout-benefit-list">
                      {section.items.map((item) => (
                        <article key={item.title} className="layout-benefit-item">
                          <span className="layout-benefit-icon">
                            <BenefitIcon />
                          </span>
                          <div>
                            <h3>{item.title}</h3>
                            <p>{item.text}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                    <div className="seo-link-cluster" aria-label="Weitere passende Seiten">
                      <span className="seo-link-cluster-label">Dazu passend:</span>
                      <div className="seo-link-cluster-list">
                        <Link href="/preisgestaltung" className="seo-link-chip">Pakete und Preise ansehen</Link>
                        <Link href="/fotobox-anlaesse" className="seo-link-chip">Passende Anlässe entdecken</Link>
                        <Link href="/ki-fotobox-tirol" className="seo-link-chip">KI-Layouts und Motive ansehen</Link>
                      </div>
                    </div>
                  </div>

                  <div className="layout-format-visual">
                    {index === 0 ? (
                      <LayoutStripMockup
                        primaryImageUrl={section.mockupPrimaryImageUrl}
                        primaryImageAlt={section.mockupPrimaryImageAlt}
                        secondaryImageUrl={section.mockupSecondaryImageUrl}
                        secondaryImageAlt={section.mockupSecondaryImageAlt}
                      />
                    ) : (
                      <LayoutClassicMockup
                        primaryImageUrl={section.mockupPrimaryImageUrl}
                        primaryImageAlt={section.mockupPrimaryImageAlt}
                        secondaryImageUrl={section.mockupSecondaryImageUrl}
                        secondaryImageAlt={section.mockupSecondaryImageAlt}
                      />
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="seo-landing-section seo-landing-alt layout-advantage-section">
          <div className="container">
            <div className="layout-section-head">
              <h2>
                <SlashHeading value={layoutPage.advantagesTitle} />
              </h2>
              <p>{layoutPage.advantagesLead}</p>
            </div>
            <div className="layout-advantage-panel">
              <div className="layout-advantage-grid">
                {advantages.map((item, index) => (
                  <article key={item.title} className="layout-advantage-card">
                    <div className="layout-advantage-icon">{ADVANTAGE_ICONS[index % ADVANTAGE_ICONS.length]}</div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="seo-landing-section pricing-contact-section">
          <div className="container">
            <section className="pricing-contact-panel layout-contact-panel">
              <div className="pricing-contact-copy">
                <h2>{layoutPage.finalTitle}</h2>
                <p className="pricing-contact-intro">{layoutPage.finalLead}</p>
              </div>
              <div className="pricing-contact-actions">
                <Link href={layoutPage.finalPrimaryCtaHref} className="pricing-contact-primary">
                  {layoutPage.finalPrimaryCtaText}
                </Link>
                <Link href={layoutPage.finalSecondaryCtaHref} className="pricing-offer-button">
                  {layoutPage.finalSecondaryCtaText}
                </Link>
                <div className="seo-link-cluster seo-link-cluster--center" aria-label="Weitere empfohlene Seiten">
                  <span className="seo-link-cluster-label">Auch interessant:</span>
                  <div className="seo-link-cluster-list">
                    <Link href="/ki-fotobox-tirol" className="seo-link-chip">KI-Fotobox ansehen</Link>
                    <Link href="/fotobox-anlaesse" className="seo-link-chip">Anlässe vergleichen</Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  );
}
