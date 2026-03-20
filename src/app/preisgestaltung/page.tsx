import type { Metadata } from "next";
import Link from "next/link";
import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader, SlashHeading } from "@/components/site/SiteShell";
import ReferencesCarousel from "@/components/site/ReferencesCarousel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Preisgestaltung Fotobox Tirol | Pakete und Leistungen",
  description:
    "Eigene Preisgestaltungsseite fuer Pakete, Formate und Leistungen der Fotobox Tirol."
};

function CheckIcon() {
  return (
    <svg
      className="pricing-package-check"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden="true"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default async function PreisgestaltungPage() {
  const content = await readCmsContent();
  const pricingPackages = content.pricing.pagePlans || [];
  const technologyItems = (content.pricing.technologyItems || []).map((item, index) => ({
    ...item,
    icon: (
      index === 0 ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      ) : index === 1 ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="6" y="2" width="12" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
      )
    )
  }));
  const references = content.pricing.references || [];

  function formatPrice(value: number) {
    return new Intl.NumberFormat("de-AT").format(value);
  }
  return (
    <>
      <SiteHeader content={content} />
      <main>
        <section className="page-hero seo-landing-hero">
          <div className="container">
            <h1>{content.pricing.pageTitle || "Preisgestaltung"}</h1>
            <p>
              {content.pricing.pageIntro || "Eigene Uebersichtsseite fuer Pakete, Druckformate und Leistungen."}
            </p>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="container">
            <h2><SlashHeading value={content.pricing.pageHeading || "all/inclusive"} /></h2>
            <div className="grid grid-3 pricing-package-grid">
              {pricingPackages.map((plan) => (
                <article className={`price-card pricing-package-card ${plan.featured ? "featured pricing-package-featured" : ""}`} key={plan.name}>
                  <div className="price-header">
                    <h3>{plan.name}</h3>
                    <div className="pricing-package-amount">
                      <span>{formatPrice(plan.price)}€</span>
                      <small>{plan.meta || "/ Event"}</small>
                    </div>
                  </div>
                  <ul className="price-list">
                    {plan.items.map((item) => (
                      <li key={item}>
                        <CheckIcon />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/kontakt?paket=${encodeURIComponent(plan.name)}`}
                    className={`pricing-package-btn ${plan.featured ? "is-featured" : ""}`}
                  >
                    {plan.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="container">
            <h2><SlashHeading value={content.pricing.technologyHeading || "technik/bedienung"} /></h2>
            <div className="grid grid-3">
              {technologyItems.map((item) => (
                <article
                  className="feature-item"
                  key={item.title}
                  style={{
                    textAlign: "center",
                    border: "none",
                    background: "transparent",
                    padding: 0
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid var(--c-line)",
                      borderRadius: "999px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1.5rem",
                      color: "var(--c-accent)"
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>{item.title}</h3>
                  <p style={{ marginBottom: 0 }}>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="container">
            <h2 className="faq-title"><SlashHeading value={content.pricing.faqHeading || content.faq.heading} /></h2>
            <div className="faq-wrap">
              {content.faq.items.map((item) => (
                <details className="faq-item" key={item.question}>
                  <summary className="faq-question">{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="seo-landing-section seo-landing-alt">
          <div className="container">
            <h2><SlashHeading value={content.pricing.referencesHeading || "referenzen/partner"} /></h2>
            <ReferencesCarousel items={references} />
          </div>
        </section>

        <section className="seo-landing-section">
          <div className="container">
            <aside className="pricing-contact-block">
              <h2>{content.pricing.contactTitle || "Direkt anfragen"}</h2>
              <div className="pricing-contact-lines">
                <p><strong>Telefon:</strong> <a href={`tel:${content.contact.phone.replace(/[^+\d]/g, "")}`}>{content.contact.phone}</a></p>
                <p><strong>E-Mail:</strong> <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a></p>
                <p><strong>Adresse:</strong> {content.contact.address}</p>
              </div>
            </aside>
          </div>
        </section>

      </main>
      <SiteFooter content={content} />
    </>
  );
}
