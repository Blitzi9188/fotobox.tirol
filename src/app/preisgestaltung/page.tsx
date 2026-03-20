import type { Metadata } from "next";
import Link from "next/link";
import { readCmsContent } from "@/lib/cms";
import { SiteFooter, SiteHeader, SlashHeading } from "@/components/site/SiteShell";
import ReferencesCarousel from "@/components/site/ReferencesCarousel";

export const dynamic = "force-dynamic";

const DEFAULT_PAGE_PLANS = [
  {
    name: "Essential",
    price: 490,
    meta: "/ Event",
    featured: false,
    cta: "Anfragen",
    items: [
      "4 Stunden Laufzeit",
      "Digitale Flatrate (Online Galerie)",
      "Standard KI-Retusche",
      "Auf- & Abbau inklusive"
    ]
  },
  {
    name: "Premium",
    price: 790,
    meta: "/ Event",
    featured: true,
    cta: "Jetzt buchen",
    items: [
      "Open-End Laufzeit (max. 12h)",
      "Sofort-Druck Flatrate (400 Prints)",
      "Premium Hochzeits-Filter & Overlay",
      "QR-Code Sofort-Download",
      "Requisiten Box (Hochzeit-Edition)"
    ]
  },
  {
    name: "Black Label",
    price: 1290,
    meta: "/ Event",
    featured: false,
    cta: "Anfragen",
    items: [
      "Alles aus dem Premium-Paket",
      "Live-Slideshow auf TV/Beamer",
      "Persoenlicher Operator vor Ort",
      "High-End Gaestebuch & Klebe-Service"
    ]
  }
];

const DEFAULT_TECHNOLOGY_ITEMS = [
  {
    title: "Studioqualitaet",
    description:
      "Integrierte DSLR-Kamera und professioneller Studioblitz sorgen fuer sauber ausgeleuchtete Bilder in jeder Event-Umgebung."
  },
  {
    title: "Touch Bedienung",
    description:
      "Intuitive Benutzerfuehrung ueber den grossen Touchscreen, damit sich auch Gaeste ohne Einweisung sofort zurechtfinden."
  },
  {
    title: "Sofortdruck",
    description:
      "High-Speed Fotodruck in Sekunden mit klaren Ausdrucken in Laborqualitaet, abgestimmt auf euer Event oder Branding."
  }
];

const DEFAULT_REFERENCES = [
  { name: "Fiegl+Spielberger", href: "https://www.fiegl.co.at", logoDomain: "fiegl.co.at" },
  { name: "Congress Messe Innsbruck", href: "https://www.cmi.at", logoDomain: "cmi.at" },
  { name: "Kloster Bräu Seefeld", href: "https://klosterbraeu.com", logoDomain: "klosterbraeu.com" },
  { name: "Tiroler Versicherung", href: "https://www.tiroler-versicherung.at", logoDomain: "tiroler-versicherung.at" },
  { name: "Völkl Ski", href: "https://www.voelkl.com", logoDomain: "voelkl.com" },
  { name: "Recycling Ahrental", href: "https://www.rz-ahrental.at", logoDomain: "rz-ahrental.at" },
  { name: "Sandoz", href: "https://www.sandoz.com", logoDomain: "sandoz.com" },
  { name: "Interalpen Hotel", href: "https://www.interalpen.com", logoDomain: "interalpen.com" },
  { name: "Wetscher", href: "https://www.wetscher.com", logoDomain: "wetscher.com" },
  { name: "Burton", href: "https://www.burton.com", logoDomain: "burton.com" },
  { name: "Tiroler Wasserkraft", href: "https://www.tiwag.at", logoDomain: "tiwag.at" },
  { name: "Woods Seefeld", href: "https://www.woods-seefeld.com", logoDomain: "woods-seefeld.com" },
  { name: "OFA", href: "https://www.ofa.at", logoDomain: "ofa.at" },
  { name: "Bayrischer Hof", href: "https://www.bayerischerhof.de/de/", logoDomain: "bayerischerhof.de", initials: "BH" },
  { name: "VOGUE Germany", href: "https://www.vogue.de", logoDomain: "vogue.de" },
  { name: "Adlers Hotel", href: "https://www.adlers-innsbruck.com", logoDomain: "adlers-innsbruck.com" },
  { name: "Hypo Tirol Bank", href: "https://www.hypotirol.com", logoDomain: "hypotirol.com" },
  { name: "Aqua Dome", href: "https://www.aqua-dome.at", logoDomain: "aqua-dome.at" },
  { name: "Aufschnaiter", href: "https://www.aufschnaiter.com", logoDomain: "aufschnaiter.com" },
  { name: "Salt Schweiz", href: "https://www.salt.ch", logoDomain: "salt.ch" },
  { name: "Büro im Laden", href: "https://www.xn--dasbroimladen-zob.at/im-laden", logoDomain: "xn--dasbroimladen-zob.at" },
  { name: "Donau Versicherung", href: "https://www.donauversicherung.at", logoDomain: "donauversicherung.at" },
  {
    name: "Tirol Werbung",
    href: "https://www.tirolwerbung.at",
    logoDomain: "tirolwerbung.at",
    logoSrc: "https://www.tirolwerbung.at/_Resources/Static/Packages/imx.bestpractice/images/PageHeader/tirol.svg?bust=20775f4e"
  },
  {
    name: "Innsbruck Tourismus",
    href: "https://www.innsbruck.info",
    logoDomain: "innsbruck.info",
    logoSrc: "https://www.innsbruckphoto.at/logos/INNSBRUCK/RGB/Logo_INNSBRUCK_rgb.jpg"
  },
  { name: "Thöni Telfs", href: "https://www.thoeni.com", logoDomain: "thoeni.com" },
  { name: "Kaufhaus Tyrol", href: "https://kaufhaus-tyrol.at", logoDomain: "kaufhaus-tyrol.at" },
  { name: "DEZ Einkaufszentrum", href: "https://www.dez.at", logoDomain: "dez.at" },
  { name: "Löffler", href: "https://www.loeffler.at", logoDomain: "loeffler.at" },
  { name: "Innio / Jenbach", href: "https://www.innio.com", logoDomain: "innio.com" }
];

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
  const pricingPackages =
    content.pricing.pagePlans && content.pricing.pagePlans.length > 0
      ? content.pricing.pagePlans
      : DEFAULT_PAGE_PLANS;
  const technologySource =
    content.pricing.technologyItems && content.pricing.technologyItems.length > 0
      ? content.pricing.technologyItems
      : DEFAULT_TECHNOLOGY_ITEMS;
  const technologyItems = technologySource.map((item, index) => ({
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
  const references =
    content.pricing.references && content.pricing.references.length > 0
      ? content.pricing.references
      : DEFAULT_REFERENCES;

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
